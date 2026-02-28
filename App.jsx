import { useState } from 'react'
import { evaluateTrade, fmt } from '../utils/calculations.js'
import { load, save, KEYS } from '../utils/storage.js'

const EMPTY = { buy: '', sell: '', qty: '', transport: '', broker: '', days: '', vol: '', rel: '' }

export default function TradeEngine({ showToast }) {
  const [inputs, setInputs] = useState(EMPTY)
  const [result, setResult] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [trades, setTrades] = useState(() => load(KEYS.TRADES, []))
  const [showHistory, setShowHistory] = useState(false)
  const [actualInput, setActualInput] = useState('')

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }))
  const pf = (v) => parseFloat(v) || 0

  const evaluate = () => {
    const p = { buy: pf(inputs.buy), sell: pf(inputs.sell), qty: pf(inputs.qty), transport: pf(inputs.transport), broker: pf(inputs.broker), days: pf(inputs.days), vol: pf(inputs.vol), rel: pf(inputs.rel) }
    if (!p.buy || !p.sell || !p.qty) { showToast('Fill Buy, Sell, Qty at minimum', 'error'); return }
    if (p.rel < 1 || p.rel > 5) { showToast('Reliability must be 1–5', 'error'); return }
    const r = evaluateTrade(p)
    setResult({ ...r, inputs: p, timestamp: fmt.datetime() })
    setLastResult({ ...r, inputs: p, timestamp: fmt.datetime() })
  }

  const saveTrade = () => {
    if (!lastResult) { showToast('Evaluate first', 'error'); return }
    const actual = parseFloat(actualInput)
    if (isNaN(actual)) { showToast('Enter actual P&L', 'error'); return }
    const trade = { ...lastResult, actualProfit: actual, id: Date.now() }
    const updated = [...trades, trade]
    setTrades(updated)
    save(KEYS.TRADES, updated)
    setActualInput('')
    setResult(null)
    setInputs(EMPTY)
    showToast('✅ Trade saved', 'success')
  }

  const deleteTrade = (id) => {
    const updated = trades.filter(t => t.id !== id)
    setTrades(updated)
    save(KEYS.TRADES, updated)
    showToast('Trade deleted', 'info')
  }

  const inp = (label, key, placeholder, step = '0.01') => (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input className="input-field" type="number" step={step} placeholder={placeholder}
        value={inputs[key]} onChange={e => set(key, e.target.value)} />
    </div>
  )

  const decisionColor = (cls) => cls === 'trade' ? 'var(--green)' : cls === 'consider' ? 'var(--orange)' : 'var(--red)'
  const panelClass = (cls) => cls === 'trade' ? 'trade' : cls === 'consider' ? 'consider' : 'no-trade'

  return (
    <div>
      <div className="module-header">
        <div>
          <div className="module-title">🎯 Trade Decision Engine</div>
          <div className="module-subtitle">Risk-scored decision + position sizing + logging</div>
        </div>
        <button className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: 12 }}
          onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? '← Evaluate' : `📜 History (${trades.length})`}
        </button>
      </div>

      {!showHistory ? (
        <>
          {/* Inputs */}
          <div className="card module-section">
            <div className="section-label">💰 Trade Parameters</div>
            <div className="input-row">
              {inp('Buy Price (₹/kg)', 'buy', '92.00')}
              {inp('Sell Price (₹/kg)', 'sell', '96.50')}
            </div>
            <div className="input-row">
              {inp('Quantity (kg)', 'qty', '5000', '100')}
              {inp('Transport Cost (₹/kg)', 'transport', '0.80')}
            </div>
            <div className="input-row">
              {inp('Broker Cost (₹/kg)', 'broker', '0.30')}
              {inp('Holding Days', 'days', '2', '1')}
            </div>
            <div className="input-row">
              {inp('Volatility (₹/kg/day)', 'vol', '1.20')}
              {inp('Reliability (1–5)', 'rel', '4', '1')}
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={evaluate}>
            ⚡ Evaluate Trade
          </button>

          {/* Result */}
          {result && (
            <>
              <div className={`result-panel ${panelClass(result.decisionClass)} mt-4`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div className="result-decision" style={{ color: decisionColor(result.decisionClass) }}>
                      {result.decision}
                    </div>
                    <div className="result-subtitle">{result.timestamp}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
                      {result.score}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>/ 100</div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="confidence-bar mb-3">
                  <div className="confidence-bar-fill" style={{
                    width: `${result.score}%`,
                    background: decisionColor(result.decisionClass)
                  }} />
                </div>

                <div className="result-grid">
                  <div className="result-item">
                    <div className="result-item-label">Net Margin/kg</div>
                    <div className={`result-item-value ${result.margin >= 0 ? 'green' : 'red'}`}>
                      {fmt.currency(result.margin)}
                    </div>
                  </div>
                  <div className="result-item">
                    <div className="result-item-label">Risk/kg</div>
                    <div className="result-item-value red">{fmt.currency(result.risk)}</div>
                  </div>
                  <div className="result-item">
                    <div className="result-item-label">Risk/Reward</div>
                    <div className="result-item-value gold">
                      {result.rr === Infinity ? '∞' : fmt.num(result.rr)}
                    </div>
                  </div>
                  <div className="result-item">
                    <div className="result-item-label">Total Profit</div>
                    <div className={`result-item-value ${result.totalProfit >= 0 ? 'green' : 'red'}`}>
                      {fmt.currency(result.totalProfit, 0)}
                    </div>
                  </div>
                  <div className="result-item">
                    <div className="result-item-label">Position Size</div>
                    <div className="result-item-value blue">{result.positionPct}%</div>
                  </div>
                </div>

                {/* Reasons */}
                {result.reasons.length > 0 && (
                  <div className="warnings mt-3">
                    {result.reasons.map((r, i) => (
                      <div key={i} className="warning-item success">✅ {r}</div>
                    ))}
                  </div>
                )}

                {result.flags.length > 0 && (
                  <div className="warnings mt-2">
                    {result.flags.map((f, i) => (
                      <div key={i} className="warning-item">{f}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Trade */}
              {(result.decisionClass === 'trade' || result.decisionClass === 'consider') && (
                <div className="card mt-3">
                  <div className="section-label">💾 Log Actual Outcome</div>
                  <div className="input-row" style={{ alignItems: 'flex-end' }}>
                    <div className="input-group">
                      <label className="input-label">Actual Profit / Loss (₹ total)</label>
                      <input className="input-field" type="number" step="100"
                        placeholder="e.g. 18000 or -5000"
                        value={actualInput}
                        onChange={e => setActualInput(e.target.value)} />
                    </div>
                    <button className="btn btn-success" style={{ marginTop: 20 }} onClick={saveTrade}>
                      Save Trade
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* History view */
        <div>
          {trades.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
              No trades logged yet. Evaluate and save trades to build history.
            </div>
          ) : (
            <>
              <div className="table-wrap card">
                <div className="card-title mb-3">Trade Log ({trades.length} trades)</div>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Decision</th>
                      <th>Score</th>
                      <th>Predicted</th>
                      <th>Actual</th>
                      <th>R/R</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...trades].reverse().map((t, i) => (
                      <tr key={t.id}>
                        <td className="text-muted">{trades.length - i}</td>
                        <td style={{ fontSize: 11 }}>{t.timestamp}</td>
                        <td>
                          <span className={`badge ${
                            t.decisionClass === 'trade' ? 'badge-green' :
                            t.decisionClass === 'consider' ? 'badge-orange' : 'badge-red'
                          }`} style={{ fontSize: 9 }}>{t.decision?.split(' ')[0]}</span>
                        </td>
                        <td className="mono text-gold">{t.score}</td>
                        <td className="mono" style={{ color: t.totalProfit >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {fmt.currency(t.totalProfit, 0)}
                        </td>
                        <td className="mono" style={{ color: t.actualProfit >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                          {fmt.currency(t.actualProfit, 0)}
                        </td>
                        <td className="mono text-gold">
                          {t.rr === Infinity ? '∞' : fmt.num(t.rr, 1)}
                        </td>
                        <td>
                          <button onClick={() => deleteTrade(t.id)} style={{
                            background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', fontSize: 14
                          }}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
