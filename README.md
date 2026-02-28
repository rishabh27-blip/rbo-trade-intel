import { useState } from 'react'
import { load, save, KEYS } from '../utils/storage.js'
import { fmt } from '../utils/calculations.js'

const LOT_EMPTY = {
  lotId: '', supplier: '', date: new Date().toISOString().split('T')[0],
  qty: '', buyPrice: '', quality: 'A',
  status: 'IN_STORAGE', location: '', storageStartDate: new Date().toISOString().split('T')[0],
  notes: ''
}

const STATUSES = { IN_STORAGE: '🟡 In Storage', DISPATCHED: '🟢 Dispatched', SOLD: '✅ Sold', EXPIRED: '🔴 Expired' }
const QUALITY = { A: '⭐⭐⭐ Premium', B: '⭐⭐ Standard', C: '⭐ Below Std' }

export default function Operations({ showToast }) {
  const [lots, setLots] = useState(() => load(KEYS.OPERATIONS, []))
  const [form, setForm] = useState(LOT_EMPTY)
  const [showAdd, setShowAdd] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const pf = v => parseFloat(v) || 0

  const addLot = () => {
    if (!form.lotId || !pf(form.qty) || !pf(form.buyPrice)) {
      showToast('Fill Lot ID, Qty, Buy Price', 'error'); return
    }
    const daysStored = form.storageStartDate
      ? Math.floor((Date.now() - new Date(form.storageStartDate)) / 86400000) : 0
    const lot = { ...form, id: Date.now(), qty: pf(form.qty), buyPrice: pf(form.buyPrice), daysStored }
    const updated = [...lots, lot]
    setLots(updated)
    save(KEYS.OPERATIONS, updated)
    setForm(LOT_EMPTY)
    setShowAdd(false)
    showToast('Lot added', 'success')
  }

  const updateStatus = (id, status) => {
    const updated = lots.map(l => l.id === id ? { ...l, status } : l)
    setLots(updated)
    save(KEYS.OPERATIONS, updated)
  }

  const deleteLot = (id) => {
    const updated = lots.filter(l => l.id !== id)
    setLots(updated)
    save(KEYS.OPERATIONS, updated)
  }

  const getDaysColor = (days) => {
    if (days > 10) return 'var(--red)'
    if (days > 5) return 'var(--orange)'
    return 'var(--green)'
  }

  const inStorage = lots.filter(l => l.status === 'IN_STORAGE')
  const totalStorageQty = inStorage.reduce((s, l) => s + l.qty, 0)
  const totalStorageValue = inStorage.reduce((s, l) => s + (l.qty * l.buyPrice), 0)

  return (
    <div>
      <div className="module-header">
        <div>
          <div className="module-title">🚛 Physical Operations</div>
          <div className="module-subtitle">Lot tracking · Storage aging · Dispatch log</div>
        </div>
        <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Lot'}
        </button>
      </div>

      {/* Summary */}
      {lots.length > 0 && (
        <div className="card-grid module-section" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="metric-card">
            <div className="metric-label">In Storage</div>
            <div className="metric-value gold">{inStorage.length}</div>
            <div className="metric-sub">{totalStorageQty.toLocaleString()} kg</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Storage Value</div>
            <div className="metric-value blue">{fmt.currency(totalStorageValue, 0)}</div>
            <div className="metric-sub">Capital deployed</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Lots</div>
            <div className="metric-value">{lots.length}</div>
            <div className="metric-sub">{lots.filter(l => l.status === 'SOLD').length} sold</div>
          </div>
        </div>
      )}

      {/* Add Lot Form */}
      {showAdd && (
        <div className="card module-section">
          <div className="section-label">📦 New Lot</div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Lot ID</label>
              <input className="input-field" type="text" placeholder="e.g. RBO-001-FEB"
                value={form.lotId} onChange={e => set('lotId', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Supplier</label>
              <input className="input-field" type="text" placeholder="Supplier name"
                value={form.supplier} onChange={e => set('supplier', e.target.value)} />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Purchase Date</label>
              <input className="input-field" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Quantity (kg)</label>
              <input className="input-field" type="number" step="100" placeholder="5000"
                value={form.qty} onChange={e => set('qty', e.target.value)} />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Buy Price (₹/kg)</label>
              <input className="input-field" type="number" step="0.25" placeholder="92.50"
                value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Quality Grade</label>
              <select className="input-field" value={form.quality} onChange={e => set('quality', e.target.value)}>
                {Object.entries(QUALITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Storage Location</label>
              <input className="input-field" type="text" placeholder="Warehouse A"
                value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Storage Start Date</label>
              <input className="input-field" type="date" value={form.storageStartDate}
                onChange={e => set('storageStartDate', e.target.value)} />
            </div>
          </div>
          <div className="input-group mb-3">
            <label className="input-label">Notes</label>
            <input className="input-field" type="text" placeholder="Optional notes"
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
          <button className="btn btn-primary btn-full" onClick={addLot}>
            + Add Lot to Inventory
          </button>
        </div>
      )}

      {/* Lot Cards */}
      {lots.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚛</div>
          <div>No lots tracked. Add your first lot above.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...lots].reverse().map(lot => {
            const days = lot.storageStartDate
              ? Math.floor((Date.now() - new Date(lot.storageStartDate)) / 86400000) : lot.daysStored || 0
            return (
              <div key={lot.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{lot.lotId}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                      {lot.supplier} · {lot.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className={`badge ${lot.status === 'SOLD' ? 'badge-green' : lot.status === 'IN_STORAGE' ? 'badge-gold' : lot.status === 'EXPIRED' ? 'badge-red' : 'badge-blue'}`}
                      style={{ fontSize: 9 }}>
                      {STATUSES[lot.status]}
                    </span>
                    <button onClick={() => deleteLot(lot.id)} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}>🗑</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                  <div><div style={{ fontSize: 10, color: 'var(--text-3)' }}>QTY</div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-1)' }}>{lot.qty.toLocaleString()}<span style={{ fontSize: 10, color: 'var(--text-3)' }}>kg</span></div></div>
                  <div><div style={{ fontSize: 10, color: 'var(--text-3)' }}>BUY PRICE</div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>{fmt.currency(lot.buyPrice)}</div></div>
                  <div><div style={{ fontSize: 10, color: 'var(--text-3)' }}>VALUE</div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{fmt.currency(lot.qty * lot.buyPrice, 0)}</div></div>
                </div>

                {lot.status === 'IN_STORAGE' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-3)', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Days in Storage</div>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: getDaysColor(days) }}>{days}</div>
                    </div>
                    <div style={{ fontSize: 11, color: getDaysColor(days), fontFamily: 'var(--font-mono)' }}>
                      {days > 10 ? '⚠️ Aging risk' : days > 5 ? '⏰ Monitor' : '✅ Fresh'}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.entries(STATUSES).filter(([k]) => k !== lot.status).map(([k, v]) => (
                    <button key={k} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: 11 }}
                      onClick={() => updateStatus(lot.id, k)}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
