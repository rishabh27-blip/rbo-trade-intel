import { useState, useEffect, useRef } from 'react'
import { estimatePriceRange, fmt } from '../utils/calculations.js'
import { load, save, KEYS } from '../utils/storage.js'

const DEFAULT = {
  fcpoClose: '', fcpoPrevClose: '',
  zlClose: '', zlPrevClose: '',
  localYesterday: '',
  local5dHigh: '', local5dLow: '',
  fcpo5dHigh: '', fcpo5dLow: '',
  zl5dHigh: '', zl5dLow: '',
  brokerKLCE: '', exchangeKLCE: '',
  brokerCBOT: '', exchangeCBOT: ''
}

export default function PriceEstimator({ showToast }) {
  const [inputs, setInputs] = useState(() => load(KEYS.ESTIMATOR, DEFAULT))
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }))

  const parse = (obj) => {
    const out = {}
    for (const k in obj) out[k] = parseFloat(obj[k]) || 0
    return out
  }

  const calculate = () => {
    const p = parse(inputs)
    if (!p.fcpoClose || !p.fcpoPrevClose || !p.zlClose || !p.zlPrevClose || !p.localYesterday) {
      showToast('Fill required fields (FCPO, ZL closes + yesterday local)', 'error')
      return
    }
    const r = estimatePriceRange(p)
    setResult(r)
    save(KEYS.ESTIMATOR, inputs)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const reset = () => {
    setInputs(DEFAULT)
    setResult(null)
  }

  const ConfidenceColor = (c) => c >= 65 ? 'var(--green)' : c >= 55 ? 'var(--gold)' : 'var(--red)'

  const inp = (label, key, placeholder, hint) => (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        className="input-field"
        type="number"
        step="0.01"
        placeholder={placeholder}
        value={inputs[key]}
        onChange={e => set(key, e.target.value)}
      />
      {hint && <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{hint}</span>}
    </div>
  )

  return (
    <div>
      <div className="module-header">
        <div>
          <div className="module-title">📊 Price Range Estimator</div>
          <div className="module-subtitle">Lead-Lag Model: FCPO + CBOT ZL → RBO Containment Zone</div>
        </div>
      </div>

      {/* ── A: External Market ── */}
      <div className="card module-section">
        <div className="section-label">🌐 A — External Market Inputs</div>
        <div className="input-row">
          {inp('FCPO Close (MYR/ton)', 'fcpoClose', 'e.g. 4250')}
          {inp('FCPO Prev Close', 'fcpoPrevClose', 'e.g. 4190')}
        </div>
        <div className="input-row">
          {inp('ZL Close (¢/lb)', 'zlClose', 'e.g. 48.50')}
          {inp('ZL Prev Close', 'zlPrevClose', 'e.g. 47.80')}
        </div>
      </div>

      {/* ── B: Broker vs Exchange ── */}
      <div className="card module-section">
        <div className="section-label">🏦 B — Broker vs Exchange Spread</div>
        <div className="input-row">
          {inp('Broker KLCE (₹)', 'brokerKLCE', 'e.g. 8450', '₹/ton')}
          {inp('Exchange KLCE (₹)', 'exchangeKLCE', 'e.g. 8380', '₹/ton')}
        </div>
        <div className="input-row">
          {inp('Broker CBOT (₹)', 'brokerCBOT', 'e.g. 890', '₹/10kg')}
          {inp('Exchange CBOT (₹)', 'exchangeCBOT', 'e.g. 870', '₹/10kg')}
        </div>
      </div>

      {/* ── C: Local Market ── */}
      <div className="card module-section">
        <div className="section-label">🌾 C — Local RBO Market</div>
        <div className="input-row">
          {inp('Yesterday RBO (₹/kg)', 'localYesterday', 'e.g. 96.50', 'Required')}
          {inp('Today RBO (₹/kg)', 'localToday', 'e.g. 97.20', 'Optional')}
        </div>
      </div>

      {/* ── D: 5-Day Ranges ── */}
      <div className="card module-section">
        <div className="section-label">📅 D — 5-Day Volatility Ranges</div>
        <div className="input-row">
          {inp('RBO 5D High (₹/kg)', 'local5dHigh', 'e.g. 99.00')}
          {inp('RBO 5D Low (₹/kg)', 'local5dLow', 'e.g. 94.50')}
        </div>
        <div className="input-row">
          {inp('FCPO 5D High (MYR)', 'fcpo5dHigh', 'e.g. 4350')}
          {inp('FCPO 5D Low (MYR)', 'fcpo5dLow', 'e.g. 4100')}
        </div>
        <div className="input-row">
          {inp('ZL 5D High (¢/lb)', 'zl5dHigh', 'e.g. 50.20')}
          {inp('ZL 5D Low (¢/lb)', 'zl5dLow', 'e.g. 46.80')}
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" onClick={calculate}>
          ⚡ Estimate Range
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          🔄 Reset
        </button>
      </div>

      {/* ── Results ── */}
      {result && (
        <div ref={resultRef}>
          {/* Signal Strip */}
          <div className="card mt-4">
            <div className="card-title mb-3">📡 Derived Signals</div>
            <div className="signal-strip">
              <div className="signal-box">
                <div className="signal-box-label">FCPO %</div>
                <div className={`signal-box-val ${result.fcpoPct >= 0 ? 'pos' : 'neg'}`}>
                  {fmt.signPct(result.fcpoPct)}
                </div>
              </div>
              <div className="signal-box">
                <div className="signal-box-label">ZL %</div>
                <div className={`signal-box-val ${result.zlPct >= 0 ? 'pos' : 'neg'}`}>
                  {fmt.signPct(result.zlPct)}
                </div>
              </div>
              <div className="signal-box">
                <div className="signal-box-label">Combined</div>
                <div className={`signal-box-val ${result.combinedSignal >= 0 ? 'gold' : 'neg'}`}>
                  {fmt.signPct(result.combinedSignal)}
                </div>
              </div>
              <div className="signal-box">
                <div className="signal-box-label">Volatility</div>
                <div className={`signal-box-val ${
                  result.volatilityLevel === 'HIGH' ? 'neg' :
                  result.volatilityLevel === 'LOW' ? 'pos' : 'gold'
                }`}>
                  {result.volatilityLevel}
                </div>
              </div>
            </div>

            {(result.klceSpread !== null || result.cbotSpread !== null) && (
              <div className="signal-strip mt-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {result.klceSpread !== null && (
                  <div className="signal-box">
                    <div className="signal-box-label">KLCE Broker Spread</div>
                    <div className={`signal-box-val ${Math.abs(result.klceSpread) > 80 ? 'neg' : 'neu'}`}>
                      {fmt.sign(result.klceSpread)}
                    </div>
                  </div>
                )}
                {result.cbotSpread !== null && (
                  <div className="signal-box">
                    <div className="signal-box-label">CBOT Broker Spread</div>
                    <div className={`signal-box-val ${Math.abs(result.cbotSpread) > 50 ? 'neg' : 'neu'}`}>
                      {fmt.sign(result.cbotSpread)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className={`result-panel range-est mt-4`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className="result-decision" style={{ color: 'var(--gold)', fontSize: 20 }}>
                  Price Containment Zone
                </div>
                <div className="result-subtitle">{fmt.datetime()} · Multiplier {result.multiplier}×</div>
              </div>
              <div>
                <span className={`badge ${
                  result.signalClass === 'breakout' ? 'badge-blue' :
                  result.signalClass === 'mean-rev' ? 'badge-gold' : 'badge-red'
                }`}>{result.tradeSignal}</span>
              </div>
            </div>

            {/* Range Visual */}
            <div className="range-visual">
              <div className="range-labels" style={{ marginBottom: 4 }}>
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>LOW {fmt.currency(result.lower)}</span>
                <span style={{ color: 'var(--text-2)' }}>MID {fmt.currency(result.midPrice)}</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>HIGH {fmt.currency(result.upper)}</span>
              </div>
              <div className="range-bar-container">
                <div className="range-bar-fill" style={{ width: '100%' }} />
                <div className="range-bar-mid" style={{
                  left: `${((result.midPrice - result.lower) / result.rangeWidth) * 100}%`
                }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                  Range Width: <strong style={{ color: 'var(--text-1)' }}>₹{result.rangeWidth.toFixed(2)}/kg</strong>
                </span>
              </div>
            </div>

            <div className="result-grid mt-3">
              <div className="result-item">
                <div className="result-item-label">Lower Bound</div>
                <div className="result-item-value red">{fmt.currency(result.lower)}</div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Mid Price</div>
                <div className="result-item-value gold">{fmt.currency(result.midPrice)}</div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Upper Bound</div>
                <div className="result-item-value green">{fmt.currency(result.upper)}</div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Expected Move</div>
                <div className={`result-item-value ${result.expectedMove >= 0 ? 'green' : 'red'}`}>
                  {fmt.sign(result.expectedMove)}/kg
                </div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Confidence</div>
                <div className="result-item-value" style={{ color: ConfidenceColor(result.confidence) }}>
                  {result.confidence}%
                </div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Vol Regime</div>
                <div className={`result-item-value ${
                  result.volatilityLevel === 'HIGH' ? 'red' :
                  result.volatilityLevel === 'LOW' ? 'green' : 'gold'
                }`}>{result.volatilityLevel}</div>
              </div>
            </div>

            {/* Confidence bar */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                <span>Model Confidence</span>
                <span style={{ color: ConfidenceColor(result.confidence) }}>{result.confidence}%</span>
              </div>
              <div className="confidence-bar">
                <div className="confidence-bar-fill" style={{
                  width: `${result.confidence}%`,
                  background: ConfidenceColor(result.confidence)
                }} />
              </div>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="warnings mt-3">
              {result.warnings.map((w, i) => (
                <div key={i} className={`warning-item ${w.type === 'info' ? 'info' : w.type === 'danger' ? '' : 'warn'}`}>
                  {w.type === 'danger' ? '⛔' : w.type === 'warn' ? '⚠️' : 'ℹ️'} {w.msg}
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          {result.insights?.length > 0 && (
            <div className="warnings mt-2">
              {result.insights.map((ins, i) => (
                <div key={i} className="warning-item success">
                  💡 {ins}
                </div>
              ))}
            </div>
          )}

          {/* Model Breakdown */}
          <div className="card mt-4">
            <div className="card-title mb-3">🔬 Model Breakdown</div>
            <div className="table-wrap">
              <table>
                <tbody>
                  <tr><td className="text-muted">Combined Signal</td><td className="mono" style={{ color: result.combinedSignal >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt.signPct(result.combinedSignal)}</td></tr>
                  <tr><td className="text-muted">5D Avg Half-Range</td><td className="mono">₹{result.local5dAvgRange.toFixed(3)}/kg</td></tr>
                  <tr><td className="text-muted">Vol Multiplier</td><td className="mono text-gold">{result.multiplier}×</td></tr>
                  <tr><td className="text-muted">Expected Move</td><td className="mono" style={{ color: result.expectedMove >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt.sign(result.expectedMove)}/kg</td></tr>
                  <tr><td className="text-muted">FCPO 5D Vol</td><td className="mono">{fmt.pct(result.fcpoVol)}</td></tr>
                  <tr><td className="text-muted">ZL 5D Vol</td><td className="mono">{fmt.pct(result.zlVol)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
