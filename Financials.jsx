// ============================================================
// Core calculation engine for RBO Trade Intelligence
// ============================================================

// ─── Price Range Estimation ───────────────────────────────
export function estimatePriceRange(inputs) {
  const {
    fcpoClose, fcpoPrevClose,
    zlClose, zlPrevClose,
    localYesterday,
    local5dHigh, local5dLow,
    fcpo5dHigh, fcpo5dLow,
    zl5dHigh, zl5dLow,
    brokerKLCE, exchangeKLCE,
    brokerCBOT, exchangeCBOT
  } = inputs

  if (!fcpoClose || !fcpoPrevClose || !zlClose || !zlPrevClose || !localYesterday) {
    return null
  }

  // Step 1: % Changes
  const fcpoPct = ((fcpoClose - fcpoPrevClose) / fcpoPrevClose) * 100
  const zlPct = ((zlClose - zlPrevClose) / zlPrevClose) * 100

  // Step 2: Combined Signal (weighted)
  const combinedSignal = (0.6 * fcpoPct) + (0.4 * zlPct)

  // Step 3: Local 5-day avg range
  const local5dAvgRange = local5dHigh && local5dLow
    ? (local5dHigh - local5dLow) / 2
    : Math.abs(localYesterday * 0.012) // fallback: 1.2% of price

  // Step 4: Volatility multiplier
  let multiplier
  const absSig = Math.abs(combinedSignal)
  if (absSig > 1.0) multiplier = 1.5
  else if (absSig > 0.5) multiplier = 1.2
  else multiplier = 0.8

  // Step 5: Expected move (sensitivity = 0.5, lag dampener on local market)
  const expectedMove = (combinedSignal / 100) * localYesterday * 0.5

  // Step 6: Mid price
  const midPrice = localYesterday + expectedMove

  // Step 7: Bounds
  const upper = midPrice + (local5dAvgRange * multiplier)
  const lower = midPrice - (local5dAvgRange * multiplier)
  const rangeWidth = upper - lower

  // Step 8: Broker Spreads
  const klceSpread = (brokerKLCE && exchangeKLCE) ? brokerKLCE - exchangeKLCE : null
  const cbotSpread = (brokerCBOT && exchangeCBOT) ? brokerCBOT - exchangeCBOT : null

  // Step 9: Volatility levels (5-day)
  let fcpoVol = 0, zlVol = 0
  if (fcpo5dHigh && fcpo5dLow && fcpo5dLow > 0)
    fcpoVol = ((fcpo5dHigh - fcpo5dLow) / fcpo5dLow) * 100
  if (zl5dHigh && zl5dLow && zl5dLow > 0)
    zlVol = ((zl5dHigh - zl5dLow) / zl5dLow) * 100
  const avgGlobalVol = (fcpoVol + zlVol) / 2

  let volatilityLevel = 'MEDIUM'
  if (avgGlobalVol > 3.5 || absSig > 1.5) volatilityLevel = 'HIGH'
  else if (avgGlobalVol < 1.2 && absSig < 0.4) volatilityLevel = 'LOW'

  // Step 10: Confidence score
  let confidence = 60
  // Strong signal → more confident
  if (absSig > 1.2) confidence += 10
  else if (absSig > 0.7) confidence += 5
  // Weak/noisy → less confident
  if (absSig < 0.25) confidence -= 12
  // Broker spread anomaly → less reliable
  if (klceSpread !== null && Math.abs(klceSpread) > 100) confidence -= 6
  if (cbotSpread !== null && Math.abs(cbotSpread) > 60) confidence -= 4
  // Both indicators agree → more confident
  if (Math.sign(fcpoPct) === Math.sign(zlPct)) confidence += 5
  else confidence -= 5 // Divergence → noise
  // Clamp
  confidence = Math.max(42, Math.min(78, confidence))

  // Step 11: Trade Signal
  let tradeSignal = 'NO TRADE'
  let signalClass = 'no-trade'
  if (rangeWidth < 1.0) {
    tradeSignal = 'NO TRADE — Range too tight'
    signalClass = 'no-trade'
  } else if (absSig > 0.8) {
    tradeSignal = 'BREAKOUT BIAS'
    signalClass = 'breakout'
  } else {
    tradeSignal = 'MEAN REVERSION BIAS'
    signalClass = 'mean-rev'
  }

  // Step 12: Warnings
  const warnings = []
  if (rangeWidth < 1.0)
    warnings.push({ type: 'danger', msg: 'Range < ₹1/kg — broker spread will consume profit' })
  if (confidence < 55)
    warnings.push({ type: 'warn', msg: `Confidence ${confidence}% — model below threshold, avoid trading` })
  if (klceSpread !== null && Math.abs(klceSpread) > 100)
    warnings.push({ type: 'warn', msg: `KLCE broker spread ₹${Math.abs(klceSpread).toFixed(0)} — possible manipulation` })
  if (cbotSpread !== null && Math.abs(cbotSpread) > 60)
    warnings.push({ type: 'warn', msg: `CBOT broker spread ₹${Math.abs(cbotSpread).toFixed(0)} — elevated bias` })
  if (Math.sign(fcpoPct) !== Math.sign(zlPct))
    warnings.push({ type: 'info', msg: 'FCPO/ZL diverging — conflicting signals, reduce position size' })
  if (volatilityLevel === 'HIGH')
    warnings.push({ type: 'warn', msg: 'HIGH volatility regime — widen stops, reduce size' })

  // Step 13: Insights
  const insights = []
  if (volatilityLevel === 'LOW' && rangeWidth < 1.5)
    insights.push('Compression zone: wait for breakout confirmation')
  if (absSig > 1.0 && Math.sign(fcpoPct) === Math.sign(zlPct))
    insights.push('Dual confirmation: both FCPO and ZL aligned, higher conviction')
  if (klceSpread !== null && klceSpread < -30)
    insights.push('Broker pricing below exchange: accumulation signal')
  if (klceSpread !== null && klceSpread > 80)
    insights.push('Broker premium high: distribution / selling pressure')

  return {
    fcpoPct, zlPct, combinedSignal,
    local5dAvgRange, multiplier,
    expectedMove, midPrice,
    upper, lower, rangeWidth,
    klceSpread, cbotSpread,
    fcpoVol, zlVol, avgGlobalVol,
    volatilityLevel, confidence,
    tradeSignal, signalClass,
    warnings, insights
  }
}

// ─── Trade Decision Engine ────────────────────────────────
export function evaluateTrade(inputs) {
  const { buy, sell, qty, transport, broker, days, vol, rel } = inputs

  const margin = sell - buy - transport - broker
  const risk = vol * days
  const totalProfit = margin * qty
  const rr = risk > 0 ? margin / risk : Infinity

  let score = 0
  const reasons = []
  const flags = []

  // Margin (max 30)
  if (margin > 3) { score += 30; reasons.push('Excellent margin >₹3') }
  else if (margin > 2) { score += 25; reasons.push('Strong margin >₹2') }
  else if (margin > 1) { score += 18; reasons.push('Moderate margin') }
  else if (margin > 0) { score += 8; flags.push('⚠ Thin margin <₹1') }
  else { score += 0; flags.push('✖ Negative margin') }

  // Risk vs Margin (max 30)
  if (risk <= 0) { score += 25 }
  else if (risk < 0.3 * margin) { score += 30; reasons.push('Very low risk') }
  else if (risk < 0.5 * margin) { score += 24; reasons.push('Low risk') }
  else if (risk < margin) { score += 16 }
  else { score += 4; flags.push('⚠ Risk > Margin') }

  // Days (max 20)
  if (days <= 1) { score += 20; reasons.push('Intraday / same-day') }
  else if (days <= 2) { score += 18 }
  else if (days <= 4) { score += 12 }
  else { score += 6; flags.push('⚠ Long holding') }

  // Reliability (max 20: 4 pts per star)
  score += Math.min(5, rel) * 4
  if (rel >= 4) reasons.push('Reliable counterparty')
  else if (rel <= 2) flags.push('⚠ Low counterparty reliability')

  // Negative margin override
  let decision, decisionClass
  if (margin <= 0) {
    decision = 'NO TRADE'; decisionClass = 'no-trade'
  } else if (risk > margin) {
    decision = 'NO TRADE'; decisionClass = 'no-trade'
  } else if (score >= 72) {
    decision = 'STRONG TRADE'; decisionClass = 'trade'
  } else if (score >= 60) {
    decision = 'TRADE'; decisionClass = 'trade'
  } else if (score >= 50) {
    decision = 'CONSIDER — 50% SIZE'; decisionClass = 'consider'
  } else {
    decision = 'NO TRADE'; decisionClass = 'no-trade'
  }

  // Recommended position size (% of standard)
  let positionPct = 0
  if (decisionClass === 'trade') positionPct = score >= 72 ? 100 : 75
  else if (decisionClass === 'consider') positionPct = 50

  return {
    margin, risk, totalProfit, rr,
    score, decision, decisionClass,
    positionPct, reasons, flags
  }
}

// ─── Kelly Criterion Position Sizing ─────────────────────
export function kellyPositionSize(winRate, avgWin, avgLoss, capital) {
  if (!winRate || !avgWin || !avgLoss || avgLoss === 0) return null
  const p = winRate / 100
  const q = 1 - p
  const b = avgWin / avgLoss
  const kelly = (p * b - q) / b
  const fractionalKelly = kelly * 0.5 // half-Kelly for safety
  const positionValue = fractionalKelly * capital
  return {
    kelly: kelly * 100,
    halfKelly: fractionalKelly * 100,
    positionValue: Math.max(0, positionValue),
    recommendation: kelly > 0 ? 'POSITIVE EDGE' : 'NO EDGE — STOP TRADING'
  }
}

// ─── Drawdown Analysis ────────────────────────────────────
export function calcDrawdown(trades) {
  if (!trades.length) return { maxDD: 0, maxDDPct: 0, currentDD: 0 }
  let peak = 0, equity = 0, maxDD = 0
  const equityCurve = trades.map(t => {
    equity += (t.actualProfit || 0)
    if (equity > peak) peak = equity
    const dd = peak - equity
    if (dd > maxDD) maxDD = dd
    return { equity, drawdown: dd }
  })
  const current = equityCurve[equityCurve.length - 1]
  const maxDDPct = peak > 0 ? (maxDD / peak) * 100 : 0
  return { maxDD, maxDDPct, currentDD: current?.drawdown || 0, equityCurve }
}

// ─── Performance Statistics ───────────────────────────────
export function calcPerformanceStats(trades) {
  if (!trades.length) return {}
  const completed = trades.filter(t => t.actualProfit != null)
  if (!completed.length) return {}

  const profits = completed.map(t => t.actualProfit)
  const wins = profits.filter(p => p > 0)
  const losses = profits.filter(p => p <= 0)

  const totalPnL = profits.reduce((a, b) => a + b, 0)
  const winRate = (wins.length / completed.length) * 100
  const avgWin = wins.length ? wins.reduce((a, b) => a + b, 0) / wins.length : 0
  const avgLoss = losses.length ? Math.abs(losses.reduce((a, b) => a + b, 0) / losses.length) : 0
  const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : Infinity

  const mean = totalPnL / completed.length
  const variance = profits.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / completed.length
  const stdDev = Math.sqrt(variance)
  const sharpe = stdDev > 0 ? (mean / stdDev) * Math.sqrt(252) : 0

  const { maxDD, maxDDPct, equityCurve } = calcDrawdown(completed)

  // Running P&L for chart
  let running = 0
  const equityData = completed.map((t, i) => {
    running += t.actualProfit
    return { trade: i + 1, pnl: running, daily: t.actualProfit }
  })

  // Score bucket analysis
  const highBucket = completed.filter(t => t.score >= 70)
  const midBucket = completed.filter(t => t.score >= 50 && t.score < 70)
  const lowBucket = completed.filter(t => t.score < 50)

  function bucketStats(arr) {
    if (!arr.length) return { avg: 0, winRate: 0, count: 0 }
    const p = arr.map(t => t.actualProfit)
    const w = p.filter(x => x > 0)
    return {
      avg: p.reduce((a, b) => a + b, 0) / arr.length,
      winRate: (w.length / arr.length) * 100,
      count: arr.length
    }
  }

  return {
    totalTrades: completed.length,
    wins: wins.length, losses: losses.length,
    totalPnL, winRate, avgWin, avgLoss,
    profitFactor, sharpe, stdDev,
    maxDD, maxDDPct, equityData,
    buckets: {
      high: bucketStats(highBucket),
      mid: bucketStats(midBucket),
      low: bucketStats(lowBucket)
    }
  }
}

// ─── Scenario Builder ─────────────────────────────────────
export function buildScenarios(baseInputs) {
  const { buyPrice, sellPrice, qty, transport, broker, holding } = baseInputs

  function calcScenario(sellMod, volMod) {
    const modifiedSell = sellPrice * (1 + sellMod / 100)
    const margin = modifiedSell - buyPrice - transport - broker
    const profit = margin * qty
    return { margin: +margin.toFixed(2), profit: +profit.toFixed(2), sell: +modifiedSell.toFixed(2) }
  }

  return {
    bear: calcScenario(-3, 1.5),
    base: calcScenario(0, 1.0),
    bull: calcScenario(3, 0.8),
    extreme_bear: calcScenario(-6, 2.0),
    extreme_bull: calcScenario(6, 0.6)
  }
}

// ─── Format helpers ───────────────────────────────────────
export const fmt = {
  currency: (n, d = 2) => n != null ? `₹${(+n).toFixed(d)}` : '—',
  pct: (n, d = 2) => n != null ? `${(+n).toFixed(d)}%` : '—',
  num: (n, d = 2) => n != null ? (+n).toFixed(d) : '—',
  sign: (n) => n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2),
  signPct: (n) => n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`,
  date: () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
  time: () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  datetime: () => new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
