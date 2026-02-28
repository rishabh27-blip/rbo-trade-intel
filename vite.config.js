import { useMemo } from 'react'
import { load, KEYS } from '../utils/storage.js'
import { calcPerformanceStats, fmt } from '../utils/calculations.js'

export default function Reports() {
  const trades = load(KEYS.TRADES, [])
  const financials = load(KEYS.FINANCIALS, [])
  const operations = load(KEYS.OPERATIONS, [])
  const capital = load(KEYS.CAPITAL, 500000)
  const stats = useMemo(() => calcPerformanceStats(trades), [trades])

  const print = () => window.print()

  const exportCSV = () => {
    if (!trades.length && !financials.length) { alert('No data to export'); return }
    let csv = 'Type,Date,Decision,Score,Predicted P&L,Actual P&L,Win/Loss\n'
    trades.forEach(t => {
      csv += `Trade,${t.timestamp},${t.decision},${t.score},${t.totalProfit?.toFixed(0)},${t.actualProfit},${t.actualProfit >= 0 ? 'WIN' : 'LOSS'}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rbo-trades-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const Section = ({ title, children }) => (
    <div className="card module-section" style={{ pageBreakInside: 'avoid' }}>
      <div className="section-label">{title}</div>
      {children}
    </div>
  )

  const Row = ({ label, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)', color: color || 'var(--text-1)' }}>{value}</span>
    </div>
  )

  return (
    <div>
      <div className="module-header">
        <div>
          <div className="module-title">📄 Executive Report</div>
          <div className="module-subtitle">Full performance summary · Print & export ready</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: 12 }} onClick={exportCSV}>
            📤 CSV
          </button>
          <button className="btn btn-primary" style={{ padding: '7px 12px', fontSize: 12 }} onClick={print}>
            🖨 Print
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="card module-section" style={{ textAlign: 'center', padding: 32, background: 'linear-gradient(135deg, var(--bg-card), var(--bg-3))' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.02em', marginBottom: 4 }}>
          🌾 RBO Trade Intelligence
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
          Rice Bran Crude Oil — Trading Performance Report
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          Generated: {new Date().toLocaleString('en-IN')} · Capital: {fmt.currency(capital, 0)}
        </div>
      </div>

      {/* Performance Summary */}
      {stats.totalTrades > 0 ? (
        <>
          <Section title="📊 Performance Summary">
            <Row label="Total Trades Logged" value={stats.totalTrades} />
            <Row label="Win / Loss" value={`${stats.wins} W / ${stats.losses} L`} />
            <Row label="Win Rate" value={fmt.pct(stats.winRate, 1)}
              color={stats.winRate >= 55 ? 'var(--green)' : stats.winRate >= 45 ? 'var(--gold)' : 'var(--red)'} />
            <Row label="Total Net P&L" value={fmt.currency(stats.totalPnL, 0)}
              color={stats.totalPnL >= 0 ? 'var(--green)' : 'var(--red)'} />
            <Row label="Average Win" value={fmt.currency(stats.avgWin, 0)} color="var(--green)" />
            <Row label="Average Loss" value={`-${fmt.currency(stats.avgLoss, 0)}`} color="var(--red)" />
            <Row label="Profit Factor" value={stats.profitFactor === Infinity ? '∞' : fmt.num(stats.profitFactor, 2)}
              color={stats.profitFactor >= 1.5 ? 'var(--green)' : stats.profitFactor >= 1 ? 'var(--gold)' : 'var(--red)'} />
            <Row label="Sharpe Ratio (Ann.)" value={fmt.num(stats.sharpe, 2)}
              color={stats.sharpe >= 1 ? 'var(--green)' : stats.sharpe >= 0 ? 'var(--gold)' : 'var(--red)'} />
            <Row label="Max Drawdown" value={fmt.pct(stats.maxDDPct, 1)} color="var(--red)" />
          </Section>

          <Section title="🎯 Score Bucket Analysis">
            {[
              { label: 'HIGH (70+)', data: stats.buckets?.high },
              { label: 'MID (50–69)', data: stats.buckets?.mid },
              { label: 'LOW (<50)', data: stats.buckets?.low },
            ].map((b, i) => b.data && (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{b.data.count} trades · Win {fmt.pct(b.data.winRate, 1)}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: b.data.avg >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {fmt.currency(b.data.avg, 0)} avg
                </div>
              </div>
            ))}
          </Section>
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)' }}>
          <div>No trade data available. Start logging trades in the Trade Engine.</div>
        </div>
      )}

      {/* Financial Summary */}
      {financials.length > 0 && (
        <Section title="💼 Financial Ledger Summary">
          <Row label="Total Entries" value={financials.length} />
          <Row label="Total Revenue" value={fmt.currency(financials.reduce((s, e) => s + e.revenue, 0), 0)} color="var(--gold)" />
          <Row label="Total COGS" value={fmt.currency(financials.reduce((s, e) => s + e.cogs, 0), 0)} color="var(--red)" />
          <Row label="Total Net Profit" value={fmt.currency(financials.reduce((s, e) => s + e.netProfit, 0), 0)}
            color={financials.reduce((s, e) => s + e.netProfit, 0) >= 0 ? 'var(--green)' : 'var(--red)'} />
          <Row label="Total Volume" value={`${financials.reduce((s, e) => s + e.qty, 0).toLocaleString()} kg`} />
        </Section>
      )}

      {/* Operations Summary */}
      {operations.length > 0 && (
        <Section title="🚛 Operations Summary">
          <Row label="Total Lots Tracked" value={operations.length} />
          <Row label="In Storage" value={operations.filter(l => l.status === 'IN_STORAGE').length} color="var(--gold)" />
          <Row label="Sold" value={operations.filter(l => l.status === 'SOLD').length} color="var(--green)" />
          <Row label="Dispatched" value={operations.filter(l => l.status === 'DISPATCHED').length} color="var(--blue)" />
          <Row label="Total Storage Value" value={fmt.currency(
            operations.filter(l => l.status === 'IN_STORAGE').reduce((s, l) => s + l.qty * l.buyPrice, 0), 0
          )} color="var(--blue)" />
        </Section>
      )}

      {/* System Health */}
      <Section title="⚙️ System Health">
        {[
          { check: 'Trade logs available', ok: trades.length > 0 },
          { check: 'Win rate ≥ 45%', ok: !stats.totalTrades || stats.winRate >= 45 },
          { check: 'Profit factor ≥ 1.0', ok: !stats.totalTrades || stats.profitFactor >= 1 },
          { check: 'Max drawdown < 15%', ok: !stats.totalTrades || stats.maxDDPct < 15 },
          { check: 'Financial entries logged', ok: financials.length > 0 },
          { check: 'Lot tracking active', ok: operations.length > 0 },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(26,43,60,0.6)' }}>
            <span style={{ fontSize: 14 }}>{c.ok ? '✅' : '⚠️'}</span>
            <span style={{ fontSize: 12, color: c.ok ? 'var(--text-2)' : 'var(--orange)' }}>{c.check}</span>
          </div>
        ))}
      </Section>

      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', padding: '16px 0 40px' }}>
        RBO Trade Intelligence v2.0 · All data stored locally · {new Date().getFullYear()}
      </div>
    </div>
  )
}
