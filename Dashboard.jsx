/* ============================================================
   RBO TRADE INTELLIGENCE — Global Styles
   Trading Terminal Aesthetic: Deep Dark + Gold
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* ─── CSS Custom Properties ─── */
:root {
  --bg-0: #020508;
  --bg-1: #050A0E;
  --bg-2: #0A1219;
  --bg-3: #0D1821;
  --bg-card: #0F1B27;
  --bg-card-hover: #132030;
  --bg-input: #0A1520;

  --border: #1A2B3C;
  --border-light: #243547;
  --border-active: #D4A830;

  --text-1: #E8F0FE;
  --text-2: #9BAABB;
  --text-3: #5A6D80;
  --text-4: #3A4D5C;

  --gold: #D4A830;
  --gold-light: #F0C84B;
  --gold-dim: #7A5F1A;
  --gold-bg: rgba(212, 168, 48, 0.08);

  --green: #00E5A0;
  --green-dim: #005C40;
  --green-bg: rgba(0, 229, 160, 0.08);

  --red: #FF4757;
  --red-dim: #6B1E25;
  --red-bg: rgba(255, 71, 87, 0.08);

  --blue: #00B4D8;
  --blue-dim: #004B5C;
  --blue-bg: rgba(0, 180, 216, 0.08);

  --orange: #FF7F3F;
  --orange-bg: rgba(255, 127, 63, 0.08);

  --purple: #9B7BFF;
  --purple-bg: rgba(155, 123, 255, 0.08);

  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --nav-height: 60px;
  --nav-bottom-height: 64px;
  --header-height: 52px;

  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-elevated: 0 8px 48px rgba(0,0,0,0.6);

  --transition: all 0.18s ease;
}

/* ─── Reset ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 14px;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-1);
  color: var(--text-1);
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

/* ─── Scrollbar ─── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-2); }
::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-3); }

/* ─── Typography ─── */
h1, h2, h3 { font-weight: 600; letter-spacing: -0.01em; }
.mono { font-family: var(--font-mono); }

/* ─── Layout ─── */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--bg-1);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  padding-top: env(safe-area-inset-top);
}

.top-bar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-bar-logo {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--gold), var(--gold-dim));
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: var(--bg-1);
  font-family: var(--font-mono);
}

.top-bar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
  letter-spacing: 0.02em;
}

.top-bar-subtitle {
  font-size: 11px;
  color: var(--text-3);
  font-family: var(--font-mono);
}

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: var(--bg-3);
  border: 1px solid var(--border);
  color: var(--text-2);
  border-radius: var(--radius-md);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition);
}

.icon-btn:hover { background: var(--bg-card); color: var(--gold); border-color: var(--gold-dim); }

/* ─── Desktop Side Navigation ─── */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.side-nav {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-2);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.side-nav-group-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-4);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 8px 4px;
  font-family: var(--font-mono);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
  text-decoration: none;
  color: var(--text-2);
  font-size: 13px;
  font-weight: 500;
}

.nav-item:hover { background: var(--bg-card); color: var(--text-1); }

.nav-item.active {
  background: var(--gold-bg);
  border-color: var(--gold-dim);
  color: var(--gold);
}

.nav-item-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.nav-item-badge {
  margin-left: auto;
  background: var(--gold);
  color: var(--bg-1);
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  font-family: var(--font-mono);
}

/* ─── Main Content ─── */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: calc(var(--nav-bottom-height) + 20px + env(safe-area-inset-bottom));
}

@media (min-width: 768px) {
  .main-content {
    padding-bottom: 20px;
  }
}

/* ─── Bottom Nav (Mobile) ─── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(var(--nav-bottom-height) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--bg-2);
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  z-index: 100;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  padding: 6px 2px;
  transition: var(--transition);
  border: none;
  background: none;
  color: var(--text-3);
  font-size: 9px;
  font-weight: 500;
}

.bottom-nav-item.active { color: var(--gold); }
.bottom-nav-item .nav-icon { font-size: 18px; line-height: 1; }

/* ─── Cards ─── */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-card);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: var(--font-mono);
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (min-width: 600px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 900px) {
  .card-grid { grid-template-columns: repeat(4, 1fr); }
}

/* ─── Metric Cards ─── */
.metric-card {
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  transition: var(--transition);
}

.metric-card:hover { border-color: var(--border-light); }
.metric-label { font-size: 11px; color: var(--text-3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
.metric-value { font-size: 20px; font-weight: 700; font-family: var(--font-mono); color: var(--text-1); line-height: 1; }
.metric-value.gold { color: var(--gold); }
.metric-value.green { color: var(--green); }
.metric-value.red { color: var(--red); }
.metric-value.blue { color: var(--blue); }
.metric-value.orange { color: var(--orange); }
.metric-sub { font-size: 11px; color: var(--text-3); margin-top: 4px; font-family: var(--font-mono); }

/* ─── Input Groups ─── */
.section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 0 4px;
  border-bottom: 1px solid var(--gold-dim);
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.input-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-label {
  font-size: 11px;
  color: var(--text-3);
  font-family: var(--font-mono);
  font-weight: 500;
}

.input-field {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-1);
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 8px 10px;
  width: 100%;
  transition: var(--transition);
  -webkit-appearance: none;
}

.input-field:focus {
  outline: none;
  border-color: var(--gold-dim);
  background: var(--bg-3);
  box-shadow: 0 0 0 2px rgba(212, 168, 48, 0.1);
}

.input-field::placeholder { color: var(--text-4); }

/* ─── Buttons ─── */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 18px;
  border-radius: var(--radius-md);
  border: none;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  letter-spacing: 0.01em;
}

.btn-primary {
  background: linear-gradient(135deg, var(--gold), #B8901E);
  color: var(--bg-1);
  box-shadow: 0 4px 16px rgba(212, 168, 48, 0.2);
}

.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(212, 168, 48, 0.35); }
.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  background: var(--bg-3);
  color: var(--text-1);
  border: 1px solid var(--border);
}

.btn-secondary:hover { background: var(--bg-card-hover); border-color: var(--border-light); }

.btn-danger {
  background: var(--red-bg);
  color: var(--red);
  border: 1px solid var(--red-dim);
}

.btn-danger:hover { background: rgba(255, 71, 87, 0.15); }

.btn-success {
  background: var(--green-bg);
  color: var(--green);
  border: 1px solid var(--green-dim);
}

.btn-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.btn-full { width: 100%; margin-top: 14px; }

/* ─── Badges ─── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge-gold { background: var(--gold-bg); color: var(--gold); border: 1px solid var(--gold-dim); }
.badge-green { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-dim); }
.badge-red { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-dim); }
.badge-blue { background: var(--blue-bg); color: var(--blue); border: 1px solid var(--blue-dim); }
.badge-orange { background: var(--orange-bg); color: var(--orange); border: 1px solid #6B3300; }
.badge-grey { background: var(--bg-3); color: var(--text-3); border: 1px solid var(--border); }

/* ─── Result Panel ─── */
.result-panel {
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-top: 16px;
  border: 1px solid;
  animation: fadeSlideIn 0.3s ease-out;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-panel.trade { background: rgba(0, 229, 160, 0.06); border-color: var(--green-dim); }
.result-panel.no-trade { background: rgba(255, 71, 87, 0.06); border-color: var(--red-dim); }
.result-panel.consider { background: rgba(255, 127, 63, 0.06); border-color: #5a3010; }
.result-panel.breakout { background: rgba(0, 180, 216, 0.06); border-color: var(--blue-dim); }
.result-panel.mean-rev { background: rgba(155, 123, 255, 0.06); border-color: #4A3880; }
.result-panel.range-est { background: rgba(212, 168, 48, 0.06); border-color: var(--gold-dim); }

.result-decision {
  font-size: 24px;
  font-weight: 800;
  font-family: var(--font-mono);
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.result-subtitle {
  font-size: 12px;
  color: var(--text-3);
  font-family: var(--font-mono);
  margin-bottom: 16px;
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.result-item-label { font-size: 10px; color: var(--text-3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; }
.result-item-value { font-size: 17px; font-weight: 700; font-family: var(--font-mono); color: var(--text-1); }
.result-item-value.gold { color: var(--gold); }
.result-item-value.green { color: var(--green); }
.result-item-value.red { color: var(--red); }
.result-item-value.blue { color: var(--blue); }

/* ─── Range Bar ─── */
.range-visual {
  background: var(--bg-3);
  border-radius: var(--radius-md);
  padding: 14px;
  margin-top: 12px;
  border: 1px solid var(--border);
}

.range-bar-container {
  position: relative;
  height: 20px;
  background: var(--bg-input);
  border-radius: 10px;
  margin: 10px 0;
  overflow: hidden;
}

.range-bar-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, var(--gold-dim), var(--gold));
  border-radius: 10px;
  transition: width 0.4s ease;
}

.range-bar-mid {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 3px;
  height: 100%;
  background: var(--text-1);
  border-radius: 2px;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 600;
}

/* ─── Warning Panel ─── */
.warnings {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(255, 71, 87, 0.06);
  border: 1px solid var(--red-dim);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: 12px;
  color: var(--red);
  font-family: var(--font-mono);
}

.warning-item.info { background: rgba(0, 180, 216, 0.06); border-color: var(--blue-dim); color: var(--blue); }
.warning-item.success { background: var(--green-bg); border-color: var(--green-dim); color: var(--green); }
.warning-item.warn { background: var(--orange-bg); border-color: #5a3010; color: var(--orange); }

/* ─── Table ─── */
.table-wrap { overflow-x: auto; margin-top: 12px; }

table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 12px;
}

thead th {
  text-align: left;
  padding: 8px 10px;
  color: var(--text-3);
  border-bottom: 1px solid var(--border);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

tbody td {
  padding: 9px 10px;
  border-bottom: 1px solid rgba(26, 43, 60, 0.6);
  color: var(--text-1);
  font-size: 12px;
}

tbody tr:hover td { background: var(--bg-3); }
tbody tr:last-child td { border-bottom: none; }

/* ─── Signal Strip ─── */
.signal-strip {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 12px 0;
}

@media (min-width: 480px) {
  .signal-strip { grid-template-columns: repeat(4, 1fr); }
}

.signal-box {
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px;
  text-align: center;
}

.signal-box-label { font-size: 10px; color: var(--text-3); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 4px; }
.signal-box-val { font-size: 16px; font-weight: 700; font-family: var(--font-mono); }
.signal-box-val.pos { color: var(--green); }
.signal-box-val.neg { color: var(--red); }
.signal-box-val.neu { color: var(--text-2); }
.signal-box-val.gold { color: var(--gold); }

/* ─── Module Header ─── */
.module-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}

.module-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.module-subtitle {
  font-size: 12px;
  color: var(--text-3);
  font-family: var(--font-mono);
  margin-top: 4px;
}

/* ─── Progress / Confidence Bar ─── */
.confidence-bar {
  height: 6px;
  background: var(--bg-3);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 6px;
}

.confidence-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

/* ─── Divider ─── */
.divider { height: 1px; background: var(--border); margin: 16px 0; }

/* ─── Tabs ─── */
.tab-row {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 16px;
  scrollbar-width: none;
}

.tab-row::-webkit-scrollbar { display: none; }

.tab {
  padding: 7px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-3);
  color: var(--text-3);
  transition: var(--transition);
  font-family: var(--font-mono);
}

.tab.active {
  background: var(--gold-bg);
  border-color: var(--gold-dim);
  color: var(--gold);
}

.tab:hover:not(.active) { color: var(--text-1); border-color: var(--border-light); }

/* ─── Toast ─── */
.toast {
  position: fixed;
  top: calc(var(--header-height) + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 500;
  z-index: 9999;
  box-shadow: var(--shadow-elevated);
  animation: toastIn 0.25s ease-out, toastOut 0.25s ease-in 2.5s forwards;
  white-space: nowrap;
  pointer-events: none;
}

@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
@keyframes toastOut { from { opacity: 1; } to { opacity: 0; } }

/* ─── Utility ─── */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.text-sm { font-size: 12px; }
.text-xs { font-size: 11px; }
.text-muted { color: var(--text-3); }
.text-gold { color: var(--gold); }
.text-green { color: var(--green); }
.text-red { color: var(--red); }
.text-blue { color: var(--blue); }
.w-full { width: 100%; }

/* ─── Section Spacing ─── */
.module-section { margin-bottom: 20px; }

/* ─── Charts ─── */
.chart-container {
  width: 100%;
  height: 220px;
  margin-top: 8px;
}

/* ─── Desktop Adjustments ─── */
@media (min-width: 768px) {
  .side-nav { display: flex; }
  .bottom-nav { display: none; }
  .main-content { padding: 24px 28px; }
  .input-row-3 { grid-template-columns: repeat(3, 1fr); }
  .result-grid { grid-template-columns: repeat(3, 1fr); }
  .card-grid { grid-template-columns: repeat(4, 1fr); }
}

@media (max-width: 767px) {
  .side-nav { display: none; }
  .bottom-nav { display: grid; }
}

/* ─── Select ─── */
select.input-field {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235A6D80'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
  appearance: none;
}

/* ─── Textarea ─── */
textarea.input-field {
  resize: vertical;
  min-height: 80px;
  font-size: 12px;
}

/* ─── Recharts overrides ─── */
.recharts-tooltip-wrapper .recharts-default-tooltip {
  background: var(--bg-card) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-md) !important;
  font-family: var(--font-mono) !important;
}

.recharts-cartesian-axis-tick text { fill: var(--text-3) !important; font-size: 11px !important; }
.recharts-label { fill: var(--text-2) !important; }
