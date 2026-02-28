import { useState, useMemo } from 'react'
import { load, save, KEYS } from '../utils/storage.js'
import { kellyPositionSize, calcPerformanceStats, fmt } from '../utils/calculations.js'

export default function RiskManager({ showToast }) {
  const [capital, setCapital] = useState(() => load(KEYS.CAPITAL, 500000))
  const [riskPct, setRiskPct] = useState(1.5)
  const trades = load(KEYS.TRADES, [])
  const stats = useMemo(() => calcPerformanceStats(trades), [trades])

  const kelly = useMemo(() => {
    if (!stats.winRate || !stats.avgWin || !stats.avgLoss) return null
    return kellyPositionSize(stats.winRate, stats.avgWin, stats.avgLoss, capital)
  }, [stats, capital])

  const maxRiskPerTrade = (capital * riskPct) / 100
  const maxPositionQty = (qty, priceRisk) => priceRisk > 0 ? Math.floor(maxRiskPerTrade / priceRisk) : 0

  const saveCapital = () => {
    save(KEYS.CAPITAL, capital)
    showToast('Capital saved', 'success')
  }

  const RiskRow = ({ label, value, color, sub }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: color || 'var(--text-1)' }}>
        {value}
      </div>
    </div>
  )

  return (
    <div>
      <div className="module-header">
        <div>
          <div className="module-title">🛡 Risk Manager</div>
          <div className="module-subtitle">Position sizing · Kelly criterion · Drawdown control</div>
        </div>
      </div>

      {/* Capital Setup */}
      <div className="card module-section">
        <div className="section-label">💼 Trading Capital</div>
        <div className="input-row" style={{ alignItems: 'flex-end' }}>
          <div className="input-group">
            <label className="input-label">Total Capital (₹)</label>
            <input className="input-field" type="number" step="10000"
              value={capital} onChange={e => setCapital(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="input-group">
            <label className="input-label">Risk per Trade (%)</label>
            <input className="input-field" type="number" step="0.25" min="0.5" max="5"
              value={riskPct} onChange={e => setRiskPct(parseFloat(e.target.value) || 1)} />
          </div>
          <button className="btn btn-success" style={{ marginBottom: 0 }} onClick={saveCapital}>Save</button>
        </div>

        <RiskRow label="Max Risk per Trade" value={fmt.currency(maxRiskPerTrade, 0)} color="var(--red)"
          sub={`${riskPct}% of ₹${(capital / 100000).toFixed(1)}L`} />
        <RiskRow label="Estimated Max Lots" value={`~${Math.floor(capital / 100000)} lots`} color="var(--blue)"
          sub="Approximate (25T per lot @ 100k margin)" />
      </div>

      {/* Position Size Calculator */}
      <div className="card module-section">
        <div className="section-label">⚖️ Position Size Calculator</div>
        <PositionSizer capital={capital} riskPct={riskPct} maxRiskPerTrade={maxRiskPerTrade} />
      </div>

      {/* Kelly Criterion */}
      <div className="card module-section">
        <div className="section-label">🧮 Kelly Criterion (Live)</div>
        {!kelly ? (
          <div className="warning-item info">
            ℹ️ Log at least 5 completed trades to calculate Kelly sizing
          </div>
        ) : (
          <>
            <RiskRow label="Full Kelly" value={fmt.pct(kelly.kelly, 1)} color="var(--gold)"
              sub="Theoretical optimal — too aggressive" />
            <RiskRow label="Half Kelly (Recommended)" value={fmt.pct(kelly.halfKelly, 1)} color="var(--green)"
              sub="Safer, still near-optimal" />
            <RiskRow label="Recommended Position Size" value={fmt.currency(kelly.positionValue, 0)}
              color={kelly.positionValue > 0 ? 'var(--green)' : 'var(--red)'}
              sub="Based on your capital" />
            <div className={`warning-item ${kelly.positionValue > 0 ? 'success' : ''} mt-3`}
              style={{ background: kelly.positionValue > 0 ? 'var(--green-bg)' : 'var(--red-bg)', borderColor: kelly.positionValue > 0 ? 'var(--green-dim)' : 'var(--red-dim)', color: kelly.positionValue > 0 ? 'var(--green)' : 'var(--red)' }}>
              {kelly.positionValue > 0 ? '✅' : '❌'} {kelly.recommendation}
            </div>
          </>
        )}
      </div>

      {/* Drawdown Stats */}
      {stats.totalTrades > 0 && (
        <div className="card module-section">
          <div className="section-label">📉 Drawdown Analysis</div>
          <RiskRow label="Max Drawdown" value={fmt.pct(stats.maxDDPct, 1)} color="var(--red)"
            sub={fmt.currency(stats.maxDD, 0)} />
          <RiskRow label="Profit Factor" value={stats.profitFactor === Infinity ? '∞' : fmt.num(stats.profitFactor, 2)}
            color={stats.profitFactor >= 1.5 ? 'var(--green)' : stats.profitFactor >= 1 ? 'var(--gold)' : 'var(--red)'} />
          <RiskRow label="Sharpe Ratio" value={fmt.num(stats.sharpe, 2)}
            color={stats.sharpe >= 1 ? 'var(--green)' : stats.sharpe >= 0 ? 'var(--gold)' : 'var(--red)'}
            sub="Annualized (252 trading days)" />
          <RiskRow label="Win Rate" value={fmt.pct(stats.winRate, 1)}
            color={stats.winRate >= 55 ? 'var(--green)' : stats.winRate >= 45 ? 'var(--gold)' : 'var(--red)'} />

          {/* Risk Rules */}
          <div className="divider" />
          <div className="card-title mb-3">📋 Iron Rules</div>
          {[
            { rule: 'Stop trading if drawdown > 15%', ok: stats.maxDDPct < 15 },
            { rule: 'No trade if confidence < 55%', ok: true },
            { rule: 'Never average a loss position', ok: true },
            { rule: 'Win rate must stay above 45%', ok: stats.winRate >= 45 || stats.totalTrades < 5 },
            { rule: 'Profit factor must stay above 1.0', ok: stats.profitFactor >= 1 || stats.totalTrades < 5 },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(26,43,60,0.6)', fontSize: 12 }}>
              <span style={{ fontSize: 14 }}>{r.ok ? '✅' : '❌'}</span>
              <span style={{ color: r.ok ? 'var(--text-2)' : 'var(--red)' }}>{r.rule}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PositionSizer({ capital, riskPct, maxRiskPerTrade }) {
  const [buyP, setBuyP] = useState('')
  const [stop, setStop] = useState('')
  const [priceRisk, setPriceRisk] = useState('')

  const qty = useMemo(() => {
    const risk = parseFloat(priceRisk) || (parseFloat(buyP) - parseFloat(stop)) || 0
    if (!risk || risk <= 0) return null
    return {
      qty: Math.floor(maxRiskPerTrade / risk),
      value: Math.floor(maxRiskPerTrade / risk) * (parseFloat(buyP) || 0)
    }
  }, [buyP, stop, priceRisk, maxRiskPerTrade])

  return (
    <>
      <div className="input-row">
        <div className="input-group">
          <label className="input-label">Buy Price (₹/kg)</label>
          <input className="input-field" type="number" step="0.5" placeholder="96.00"
            value={buyP} onChange={e => setBuyP(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Stop Loss (₹/kg)</label>
          <input className="input-field" type="number" step="0.5" placeholder="94.50"
            value={stop} onChange={e => setStop(e.target.value)} />
        </div>
      </div>
      <div className="input-group mb-3">
        <label className="input-label">OR Direct Risk per kg (₹)</label>
        <input className="input-field" type="number" step="0.1" placeholder="e.g. 1.50"
          value={priceRisk} onChange={e => setPriceRisk(e.target.value)} />
      </div>
      {qty && (
        <div style={{ background: 'var(--bg-3)', borderRadius: 8, padding: 14, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Optimal Quantity</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
              {qty.qty.toLocaleString()} kg
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Capital Deployed</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>
              {fmt.currency(qty.value, 0)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Max Risk ({riskPct}%)</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
              {fmt.currency(maxRiskPerTrade, 0)}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
