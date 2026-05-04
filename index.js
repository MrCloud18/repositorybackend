require('dotenv').config()
const http = require('http')

const PORT = process.env.PORT || 3000

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderShell({ title, content, activePath }) {
  const safeTitle = escapeHtml(title)
  const nav =
    activePath == null
      ? ''
      : `
        <aside class="sidebar">
          <div class="brand">
            <div class="logo" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6.5C6.7 12.9 10.4 20.6 14 22.5C17.6 20.6 21.3 12.9 24 6.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 22.5V6.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="brand-text">
              <div class="brand-name">Vittal</div>
              <div class="brand-sub">Institutional</div>
            </div>
          </div>

          <nav class="nav">
            <a class="nav-item ${activePath === '/dashboard' ? 'active' : ''}" href="/dashboard">
              <span class="nav-ic" aria-hidden="true">▦</span>
              <span>Dashboard</span>
            </a>
            <a class="nav-item ${activePath === '/patient' ? 'active' : ''}" href="/patient">
              <span class="nav-ic" aria-hidden="true">☰</span>
              <span>Patient List</span>
            </a>
            <a class="nav-item ${activePath === '/reports' ? 'active' : ''}" href="/reports">
              <span class="nav-ic" aria-hidden="true">🗎</span>
              <span>Clinician Reports</span>
            </a>
            <a class="nav-item" href="/dashboard">
              <span class="nav-ic" aria-hidden="true">📈</span>
              <span>Real-time Charts</span>
            </a>
            <a class="nav-item" href="/dashboard">
              <span class="nav-ic" aria-hidden="true">⚙</span>
              <span>Admin</span>
            </a>
            <a class="nav-item" href="/">
              <span class="nav-ic" aria-hidden="true">⟵</span>
              <span>Logout</span>
            </a>
          </nav>
        </aside>
      `

  const topbar =
    activePath == null
      ? ''
      : `
        <header class="topbar">
          <div class="topbar-left">
            <div class="topbar-title">Central Monitoring</div>
          </div>
          <div class="topbar-right">
            <div class="top-search">
              <span class="top-search-ic" aria-hidden="true">⌕</span>
              <input class="top-search-input" placeholder="Search" />
            </div>
            <button class="icon-btn" type="button" aria-label="Notifications">🔔</button>
            <button class="icon-btn" type="button" aria-label="Help">?</button>
            <div class="avatar" aria-label="Profile">RC</div>
          </div>
        </header>
      `

  return `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${safeTitle}</title>
      <style>
        :root{
          --bg-0:#f3f7fa;
          --bg-1:#e8f1f6;
          --card:#ffffff;
          --text:#0f1f24;
          --muted:#5d6b70;
          --line:rgba(15,31,36,.12);
          --shadow:0 10px 24px rgba(15,31,36,.10);
          --teal:#0f8f92;
          --teal-2:#0aa1a5;
          --good:#2aa66a;
          --warn:#d23c3c;
          --chip:#eef3f5;
        }
        *{box-sizing:border-box}
        html,body{height:100%}
        body{
          margin:0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          color:var(--text);
          background: radial-gradient(1100px 600px at 20% 20%, #ffffff 0%, var(--bg-0) 55%, var(--bg-1) 100%);
          overflow-x:hidden;
        }
        .bg{
          position:fixed; inset:0; z-index:-1;
          background:
            radial-gradient(280px 220px at 80% 32%, rgba(15,143,146,.18), transparent 70%),
            radial-gradient(380px 260px at 18% 70%, rgba(10,161,165,.14), transparent 70%),
            radial-gradient(520px 360px at 70% 78%, rgba(15,31,36,.10), transparent 65%);
          filter: blur(0.2px);
        }
        .mesh{
          position:fixed; inset:-120px; z-index:-2;
          opacity:.28;
          background-image:
            radial-gradient(circle at 25% 35%, rgba(15,143,146,.35) 0 2px, transparent 3px),
            radial-gradient(circle at 55% 25%, rgba(15,31,36,.35) 0 2px, transparent 3px),
            radial-gradient(circle at 78% 55%, rgba(15,143,146,.35) 0 2px, transparent 3px);
          background-size: 180px 180px;
          transform: rotate(6deg);
          filter: blur(1.4px);
        }

        a{color:inherit}
        .page{
          min-height:100vh;
          display:flex;
        }
        .sidebar{
          width:240px;
          padding:18px 14px;
          border-right:1px solid var(--line);
          background:rgba(255,255,255,.55);
          backdrop-filter: blur(10px);
        }
        .brand{display:flex; align-items:center; gap:10px; padding:8px 10px 16px}
        .logo{
          width:42px; height:42px; border-radius:12px;
          display:grid; place-items:center;
          color:var(--teal);
          background: linear-gradient(180deg, rgba(15,143,146,.14), rgba(15,143,146,.06));
          border:1px solid rgba(15,143,146,.22);
        }
        .brand-text{line-height:1.05}
        .brand-name{font-weight:800; letter-spacing:.2px}
        .brand-sub{font-size:12px; color:var(--muted); margin-top:2px}
        .nav{display:flex; flex-direction:column; gap:6px; padding:6px}
        .nav-item{
          display:flex; align-items:center; gap:10px;
          padding:10px 10px;
          border-radius:10px;
          text-decoration:none;
          color:rgba(15,31,36,.86);
          border:1px solid transparent;
        }
        .nav-item:hover{
          background:rgba(15,143,146,.08);
          border-color:rgba(15,143,146,.18);
        }
        .nav-item.active{
          background: linear-gradient(180deg, rgba(15,143,146,.18), rgba(15,143,146,.10));
          border-color:rgba(15,143,146,.26);
        }
        .nav-ic{width:18px; text-align:center; opacity:.85}

        .main{flex:1; min-width:0; display:flex; flex-direction:column}
        .topbar{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:14px 18px;
          border-bottom:1px solid var(--line);
          background:rgba(255,255,255,.55);
          backdrop-filter: blur(10px);
        }
        .topbar-title{font-weight:750}
        .topbar-right{display:flex; align-items:center; gap:10px}
        .top-search{
          display:flex; align-items:center; gap:8px;
          padding:8px 10px;
          border-radius:12px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.75);
          min-width:260px;
        }
        .top-search-ic{opacity:.7}
        .top-search-input{
          width:100%;
          border:0;
          outline:none;
          background:transparent;
          font-size:14px;
        }
        .icon-btn{
          width:36px; height:36px;
          border-radius:10px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.75);
          cursor:pointer;
        }
        .icon-btn:hover{background:#fff}
        .avatar{
          width:36px; height:36px;
          border-radius:999px;
          display:grid; place-items:center;
          border:1px solid var(--line);
          background: linear-gradient(180deg, rgba(15,143,146,.18), rgba(15,143,146,.08));
          color:rgba(15,31,36,.85);
          font-weight:800;
          letter-spacing:.3px;
          font-size:12px;
        }

        .content{
          padding:18px;
        }
        .panel{
          border:1px solid var(--line);
          background:rgba(255,255,255,.75);
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow);
          border-radius:16px;
        }

        .login-wrap{
          min-height:100vh;
          display:grid;
          place-items:center;
          padding:32px 16px;
        }
        .login-top{
          display:flex; align-items:center; gap:12px;
          margin-bottom:16px;
          justify-content:center;
          color:rgba(15,31,36,.86);
        }
        .login-top .logo{width:46px; height:46px}
        .login-card{
          width:min(420px, 92vw);
          padding:20px;
        }
        .login-title{
          display:flex; align-items:center; justify-content:center; gap:10px;
          font-weight:800; font-size:18px;
          margin:6px 0 14px;
        }
        .field{
          display:flex; align-items:center; gap:10px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.9);
          padding:10px 12px;
          border-radius:12px;
          margin:10px 0;
        }
        .field input{
          border:0; outline:none; width:100%;
          font-size:14px;
          background:transparent;
        }
        .muted{color:var(--muted)}
        .link{
          color:var(--teal);
          text-decoration:none;
          font-weight:650;
          font-size:13px;
        }
        .link:hover{text-decoration:underline}
        .btn{
          width:100%;
          border:0;
          border-radius:12px;
          padding:12px 14px;
          font-weight:800;
          letter-spacing:.4px;
          color:white;
          background: linear-gradient(180deg, var(--teal), #0b7b7d);
          cursor:pointer;
          margin-top:8px;
          box-shadow: 0 10px 18px rgba(15,143,146,.24);
        }
        .btn:hover{filter:brightness(1.02)}
        .divider{
          display:flex; align-items:center; gap:10px;
          margin:12px 0 6px;
          color:rgba(93,107,112,.9);
          font-size:12px;
        }
        .divider::before,.divider::after{
          content:""; height:1px; flex:1; background:rgba(15,31,36,.12);
        }
        .footer{
          text-align:center;
          margin-top:16px;
          font-size:12px;
          color:rgba(93,107,112,.92);
        }

        .kicker{
          font-weight:850;
          letter-spacing:.6px;
          color:rgba(15,143,146,.78);
        }
        .h1{
          font-size:18px;
          font-weight:900;
          margin:6px 0 12px;
        }
        .toolbar{
          display:flex;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
          margin-bottom:12px;
        }
        .input{
          display:flex; align-items:center; gap:8px;
          padding:10px 12px;
          border-radius:12px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.9);
          flex:1;
          min-width:220px;
        }
        .input input{border:0; outline:0; width:100%; background:transparent}
        .select{
          padding:10px 12px;
          border-radius:12px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.9);
          color:rgba(15,31,36,.85);
          min-width:120px;
        }
        .right{margin-left:auto; display:flex; align-items:center; gap:10px}
        .pill{
          display:inline-flex; align-items:center; gap:8px;
          padding:8px 10px;
          border-radius:999px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.85);
          font-weight:750;
          font-size:13px;
        }
        .dot{width:8px; height:8px; border-radius:999px; background:var(--good)}
        .dot.alert{background:var(--warn)}
        .btn-sm{
          padding:10px 12px;
          border-radius:12px;
          border:1px solid rgba(15,143,146,.26);
          background: linear-gradient(180deg, rgba(15,143,146,.18), rgba(15,143,146,.10));
          cursor:pointer;
          font-weight:850;
          color:rgba(15,31,36,.9);
          white-space:nowrap;
        }
        .grid{
          display:grid;
          grid-template-columns: repeat(3, minmax(220px, 1fr));
          gap:14px;
        }
        @media (max-width: 1120px){
          .grid{grid-template-columns: repeat(2, minmax(220px, 1fr));}
        }
        @media (max-width: 860px){
          .sidebar{display:none}
          .grid{grid-template-columns: 1fr}
          .top-search{min-width:170px}
        }
        .card{
          border-radius:14px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.9);
          box-shadow: 0 10px 18px rgba(15,31,36,.08);
          padding:14px;
        }
        .card.alert{
          background: rgba(210,60,60,.10);
          border:2px dashed rgba(210,60,60,.55);
        }
        .card-head{
          display:flex; align-items:center; justify-content:space-between;
          gap:10px;
          margin-bottom:10px;
        }
        .card-title{
          font-weight:850;
          line-height:1.2;
        }
        .badge{
          display:inline-flex;
          padding:5px 10px;
          border-radius:999px;
          font-weight:900;
          font-size:12px;
          letter-spacing:.4px;
          background: rgba(42,166,106,.14);
          color: rgba(24,119,73,.95);
          border: 1px solid rgba(42,166,106,.22);
        }
        .badge.alert{
          background: rgba(210,60,60,.14);
          color: rgba(170,20,20,.95);
          border: 1px solid rgba(210,60,60,.22);
        }
        .person{
          width:34px; height:34px;
          border-radius:999px;
          display:grid; place-items:center;
          font-weight:900; font-size:12px;
          color:rgba(15,31,36,.86);
          border:1px solid var(--line);
          background: linear-gradient(180deg, rgba(15,143,146,.16), rgba(15,143,146,.06));
        }
        .metrics{
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap:10px;
          margin:10px 0 12px;
        }
        .metric{
          border-left:1px solid rgba(15,31,36,.12);
          padding-left:10px;
        }
        .metric:first-child{border-left:0; padding-left:0}
        .metric-value{
          font-size:20px;
          font-weight:950;
          letter-spacing:.2px;
        }
        .metric-label{
          font-size:12px;
          color:rgba(93,107,112,.95);
          margin-top:2px;
          font-weight:750;
        }
        .cta{
          width:100%;
          padding:10px 12px;
          border-radius:12px;
          border:0;
          cursor:pointer;
          background: linear-gradient(180deg, var(--teal-2), #0b7b7d);
          color:white;
          font-weight:900;
          letter-spacing:.3px;
        }
        .cta:hover{filter:brightness(1.02)}

        .row{display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap}
        .chips{display:flex; gap:8px; align-items:center; flex-wrap:wrap}
        .chip{
          display:inline-flex; align-items:center; gap:8px;
          padding:7px 10px;
          border-radius:10px;
          border:1px solid var(--line);
          background: rgba(255,255,255,.85);
          font-weight:800;
          font-size:12px;
          color:rgba(15,31,36,.85);
        }

        .details-top{
          display:flex; align-items:center; justify-content:space-between;
          gap:12px;
          padding:14px;
          margin-bottom:14px;
        }
        .details-left{display:flex; align-items:center; gap:12px}
        .details-name{font-weight:950}
        .details-meta{color:rgba(93,107,112,.95); font-weight:750; font-size:13px; margin-top:4px}
        .btn-outline{
          padding:10px 12px;
          border-radius:12px;
          border:1px solid rgba(15,143,146,.40);
          background:rgba(255,255,255,.85);
          cursor:pointer;
          font-weight:900;
          color:rgba(15,31,36,.9);
        }
        .btn-outline:hover{background:#fff}
        .two{
          display:grid;
          grid-template-columns: 2fr 1fr;
          gap:14px;
          margin-bottom:14px;
        }
        .three{
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap:14px;
        }
        @media (max-width: 1120px){
          .two{grid-template-columns: 1fr}
          .three{grid-template-columns: 1fr}
        }
        .box{padding:14px}
        .box-title{display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px}
        .box-title h3{margin:0; font-size:14px; font-weight:950}
        .tag{
          display:inline-flex; align-items:center; gap:8px;
          padding:6px 10px;
          border-radius:999px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.9);
          font-weight:850;
          font-size:12px;
          color:rgba(15,31,36,.85);
        }
        .chart{
          width:100%;
          height:140px;
          border-radius:12px;
          border:1px solid rgba(15,31,36,.12);
          background: linear-gradient(180deg, rgba(15,143,146,.06), rgba(15,143,146,.02));
          overflow:hidden;
          position:relative;
        }
        .chart svg{position:absolute; inset:0}
        .table{
          width:100%;
          border-collapse:collapse;
          border-radius:12px;
          overflow:hidden;
          border:1px solid rgba(15,31,36,.12);
          background:rgba(255,255,255,.9);
        }
        .table th, .table td{
          padding:10px 12px;
          border-bottom:1px solid rgba(15,31,36,.10);
          font-size:13px;
          text-align:left;
        }
        .table th{background:rgba(15,143,146,.10); font-weight:950}
        .ok{display:inline-flex; align-items:center; gap:8px; font-weight:900; color:rgba(24,119,73,.95)}
        .ok .check{
          width:18px; height:18px; border-radius:999px;
          background:rgba(42,166,106,.16);
          border:1px solid rgba(42,166,106,.28);
          display:grid; place-items:center;
          font-size:12px;
        }
      </style>
    </head>
    <body>
      <div class="mesh" aria-hidden="true"></div>
      <div class="bg" aria-hidden="true"></div>
      <div class="page">
        ${nav}
        <div class="main">
          ${topbar}
          ${activePath == null ? content : `<div class="content">${content}</div>`}
        </div>
      </div>
    </body>
  </html>`
}

function renderLogin() {
  return renderShell({
    title: 'Vittal Institutional - Sign In',
    content: `
      <div class="login-wrap">
        <div>
          <div class="login-top">
            <div class="logo" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6.5C6.7 12.9 10.4 20.6 14 22.5C17.6 20.6 21.3 12.9 24 6.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 22.5V6.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="brand-text">
              <div class="brand-name" style="font-size:22px">Vittal</div>
              <div class="brand-sub" style="font-size:13px">Institutional</div>
            </div>
          </div>

          <div class="panel login-card">
            <div class="login-title">
              <span aria-hidden="true">👤</span>
              <span>Sign In</span>
            </div>
            <form action="/dashboard" method="get">
              <div class="field">
                <span aria-hidden="true">👤</span>
                <input name="username" placeholder="Username" autocomplete="username" />
              </div>
              <div class="field">
                <span aria-hidden="true">🔒</span>
                <input name="password" placeholder="Password" type="password" autocomplete="current-password" />
                <span class="muted" aria-hidden="true">👁</span>
              </div>
              <div style="display:flex; justify-content:flex-end; margin-top:6px">
                <a class="link" href="/dashboard">Forgot Password?</a>
              </div>
              <button class="btn" type="submit">SIGN IN</button>
              <div class="divider">Institutional SSO</div>
            </form>
          </div>

          <div class="footer">Vittal Inc. © 2026 — All rights reserved.</div>
        </div>
      </div>
    `,
    activePath: null,
  })
}

function renderDashboard() {
  const patients = [
    { name: 'Patient Name', age: 87, bpm: 87, spo2: 98, temp: 12, status: 'STABLE', alert: false },
    { name: 'Patient Petrova', age: 87, bpm: 87, spo2: 98, temp: 12, status: 'STABLE', alert: false },
    { name: 'Patient ALERT Elena Petrova', age: 89, bpm: 89, spo2: 88, temp: 17, status: 'ALERT', alert: true },
    { name: 'Patient ALERT Elena Petrova', age: 89, bpm: 89, spo2: 88, temp: 17, status: 'ALERT', alert: true },
    { name: 'Patient ALERT Elena Petrova', age: 89, bpm: 89, spo2: 88, temp: 17, status: 'ALERT', alert: true },
    { name: 'Patient Name', age: 87, bpm: 87, spo2: 98, temp: 12, status: 'STABLE', alert: false },
  ]

  const cards = patients
    .map((p) => {
      const initials = p.name
        .replaceAll('ALERT', '')
        .trim()
        .split(/\s+/)
        .slice(-2)
        .map((x) => x[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2)

      return `
        <div class="card ${p.alert ? 'alert' : ''}">
          <div class="card-head">
            <div>
              <div class="card-title">${escapeHtml(p.name)}</div>
              <div class="muted" style="font-size:13px; font-weight:750; margin-top:4px">Age</div>
            </div>
            <div class="person" aria-hidden="true">${escapeHtml(initials || 'PT')}</div>
          </div>
          <div style="display:flex; align-items:baseline; gap:10px">
            <div class="metric-value" style="font-size:32px">${escapeHtml(p.age)}</div>
          </div>
          <div class="metrics">
            <div class="metric">
              <div class="metric-value">${escapeHtml(p.bpm)}</div>
              <div class="metric-label">BPM</div>
            </div>
            <div class="metric">
              <div class="metric-value">${escapeHtml(p.spo2)}%</div>
              <div class="metric-label">SPO2</div>
            </div>
            <div class="metric">
              <div class="metric-value">${escapeHtml(p.temp)}°C</div>
              <div class="metric-label">TEMP</div>
            </div>
          </div>
          <div style="display:flex; justify-content:center; margin-bottom:10px">
            <span class="badge ${p.alert ? 'alert' : ''}">${escapeHtml(p.status)}</span>
          </div>
          <a class="cta" href="/patient">${p.alert ? 'EMERGENCY VIEW' : 'VIEW DETAILS'}</a>
        </div>
      `
    })
    .join('')

  return renderShell({
    title: 'Institutional Dashboard - Clinical Overview',
    activePath: '/dashboard',
    content: `
      <div class="kicker">INSTITUTIONAL DASHBOARD - Clinical Overview</div>
      <div class="toolbar">
        <div class="input" style="flex:1.2">
          <span class="muted" aria-hidden="true">⌕</span>
          <input placeholder="Search Patients..." />
        </div>
        <div class="chips">
          <span class="muted" style="font-weight:850">Filters</span>
          <select class="select" aria-label="Ward"><option>Ward</option><option>Ward 3B</option><option>Ward 2A</option></select>
          <select class="select" aria-label="Status"><option>Status</option><option>Stable</option><option>Alert</option></select>
        </div>
        <div class="right">
          <div class="pill"><span class="muted">Status:</span> <span class="dot"></span> <span>Stable</span></div>
          <div class="pill"><span class="dot alert"></span> <span>Alert</span></div>
          <button class="btn-sm" type="button">New Patient</button>
        </div>
      </div>

      <div class="grid">
        ${cards}
      </div>
    `,
  })
}

function svgWave({ stroke }) {
  return `
    <svg viewBox="0 0 600 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="${stroke}" stop-opacity="0.35"/>
          <stop offset="1" stop-color="${stroke}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0 122 C 40 120, 45 96, 80 98 C 110 100, 110 140, 138 130 C 156 124, 160 56, 180 56 C 200 56, 206 144, 240 136 C 272 128, 274 106, 306 106 C 332 106, 336 130, 362 126 C 390 122, 392 76, 418 76 C 448 76, 448 148, 482 138 C 516 128, 516 94, 544 96 C 566 98, 576 110, 600 108"
        fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
      <path d="M0 160 L0 124 C 40 122, 45 96, 80 98 C 110 100, 110 140, 138 130 C 156 124, 160 56, 180 56 C 200 56, 206 144, 240 136 C 272 128, 274 106, 306 106 C 332 106, 336 130, 362 126 C 390 122, 392 76, 418 76 C 448 76, 448 148, 482 138 C 516 128, 516 94, 544 96 C 566 98, 576 110, 600 108 L600 160 Z"
        fill="url(#g)"/>
    </svg>
  `
}

function renderPatientDetails() {
  return renderShell({
    title: 'Patient Details - Elena Petrova',
    activePath: '/patient',
    content: `
      <div class="panel details-top">
        <div class="details-left">
          <div class="person" style="width:46px;height:46px;font-size:14px">EP</div>
          <div>
            <div class="details-name">PATIENT DETAILS - Elena Petrova</div>
            <div class="details-meta">Age: 67 &nbsp; | &nbsp; Ward <span class="chip" style="padding:4px 10px; border-radius:999px; margin-left:8px">Stable</span></div>
          </div>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
          <button class="btn-sm" type="button">Request Intervention</button>
          <a class="btn-outline" href="/dashboard">Back to Dashboard</a>
        </div>
      </div>

      <div class="two">
        <div class="panel box">
          <div class="box-title">
            <h3>Continuous ECG waveform</h3>
            <div style="display:flex; gap:8px; align-items:center">
              <span class="tag">1.3 BPM</span>
              <span class="tag"><span class="dot" style="background:rgba(15,143,146,.9)"></span> Timeline</span>
            </div>
          </div>
          <div class="chart">
            ${svgWave({ stroke: 'rgba(15,143,146,.95)' })}
          </div>
          <div class="row muted" style="margin-top:8px; font-size:12px; font-weight:750">
            <span>Timeline</span>
            <span>Timeline</span>
          </div>
        </div>

        <div class="panel box">
          <div class="box-title">
            <h3>SPO2 trend</h3>
            <span class="tag"><span class="dot alert"></span> 98%</span>
          </div>
          <div class="chart">
            <svg viewBox="0 0 600 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 110 L100 108 L170 106 L250 104 L320 100 L410 90 L500 92 L580 86" fill="none" stroke="rgba(15,31,36,.78)" stroke-width="3" stroke-linecap="round"/>
              <circle cx="580" cy="86" r="8" fill="rgba(15,143,146,.95)"/>
              <rect x="430" y="28" rx="10" ry="10" width="92" height="34" fill="rgba(15,31,36,.78)"/>
              <text x="476" y="50" text-anchor="middle" fill="#fff" font-size="16" font-weight="900">98%</text>
            </svg>
          </div>
          <div class="row muted" style="margin-top:8px; font-size:12px; font-weight:750">
            <span>Time</span>
            <span>Timeline</span>
          </div>
        </div>
      </div>

      <div class="three">
        <div class="panel box">
          <div class="box-title">
            <h3>TEMP history</h3>
            <span class="tag"><span class="dot" style="background:rgba(42,166,106,.95)"></span> Hable</span>
          </div>
          <div class="chart">
            <svg viewBox="0 0 600 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 120 C 110 90, 180 120, 260 86 S 430 70, 580 90" fill="none" stroke="rgba(15,143,146,.95)" stroke-width="3" stroke-linecap="round"/>
              <circle cx="430" cy="70" r="8" fill="rgba(42,166,106,.95)"/>
            </svg>
          </div>
          <div class="row muted" style="margin-top:8px; font-size:12px; font-weight:750">
            <span>Todar</span>
            <span>Timeline</span>
          </div>
        </div>

        <div class="panel box">
          <div class="box-title">
            <h3>Blood Pressure</h3>
            <span class="tag"><span class="dot alert"></span> 120/80</span>
          </div>
          <div class="chart">
            <svg viewBox="0 0 600 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 128 C 130 120, 190 70, 260 60 C 320 52, 360 110, 420 120 C 480 130, 520 98, 580 90" fill="none" stroke="rgba(15,31,36,.78)" stroke-width="3" stroke-linecap="round"/>
              <circle cx="260" cy="60" r="8" fill="rgba(15,143,146,.95)"/>
              <circle cx="420" cy="120" r="8" fill="rgba(210,60,60,.92)"/>
            </svg>
          </div>
          <div class="row muted" style="margin-top:8px; font-size:12px; font-weight:750">
            <span>0</span>
            <span>Timeline</span>
          </div>
        </div>

        <div class="panel box">
          <div class="box-title">
            <h3>Medication Schedule</h3>
          </div>
          <table class="table">
            <thead>
              <tr><th>Time</th><th>Dose</th><th>Next dose</th></tr>
            </thead>
            <tbody>
              <tr><td>10:00</td><td>500mg</td><td>Actions</td></tr>
              <tr><td>14:00</td><td><span class="ok"><span class="check">✓</span> taken</span></td><td>Actions</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
  })
}

function renderReports() {
  return renderShell({
    title: "Clinician's Workbench",
    activePath: '/reports',
    content: `
      <div class="panel details-top">
        <div class="details-left">
          <div class="person" style="width:46px;height:46px;font-size:14px">DC</div>
          <div>
            <div class="details-name">Dr. David Chen - Clinician's Workbench</div>
            <div class="details-meta">Senior Cardiologist &nbsp; | &nbsp; Primary Ward &nbsp; | &nbsp; Ward 3B &nbsp; <span class="chip" style="padding:4px 10px; border-radius:999px; margin-left:8px"><span class="dot" style="background:rgba(42,166,106,.95)"></span> Online</span></div>
          </div>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
          <button class="btn-outline" type="button">Edit Profile</button>
        </div>
      </div>

      <div class="panel box" style="margin-bottom:14px">
        <div class="h1" style="margin:0 0 12px">GENERATE CLINICAL REPORTS</div>
        <div class="toolbar">
          <div class="input" style="max-width:420px">
            <span class="muted" aria-hidden="true">⌕</span>
            <input placeholder="Search Patients..." />
          </div>
          <select class="select" aria-label="Filter"><option>Filter</option><option>Ward</option><option>Status</option></select>
        </div>

        <div class="grid" style="grid-template-columns: repeat(3, minmax(220px, 1fr))">
          <div class="card">
            <div class="card-title">Daily Vital Signs Summary (PDF)</div>
            <div class="muted" style="margin-top:10px; font-weight:750">Date range - 31 Sep 2023</div>
            <div style="margin-top:14px"><button class="cta" type="button">Generate</button></div>
          </div>
          <div class="card">
            <div class="card-title">Patient Adherence and Alerts (PDF)</div>
            <div class="muted" style="margin-top:10px; font-weight:750">Details: Warning &nbsp; | &nbsp; Ward: Ward 3B</div>
            <div style="margin-top:14px"><button class="cta" type="button">Generate</button></div>
          </div>
          <div class="card">
            <div class="card-title">Advanced Month-over-Month Trend Analysis (Advanced PDF)</div>
            <div class="muted" style="margin-top:10px; font-weight:750">Filtering: Comparison &nbsp; | &nbsp; Data/Proteins</div>
            <div style="margin-top:14px"><button class="cta" type="button">Generate</button></div>
          </div>
        </div>

        <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap">
          <div class="muted" style="font-size:12px; font-weight:800">Powered by Google Cloud Run processing</div>
          <a class="link" href="/dashboard">Go to Dashboard</a>
        </div>
      </div>
    `,
  })
}

function requestController(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Method Not Allowed\n')
    return
  }

  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(renderLogin())
    return
  }

  if (url.pathname === '/dashboard') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(renderDashboard())
    return
  }

  if (url.pathname === '/patient') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(renderPatientDetails())
    return
  }

  if (url.pathname === '/reports') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(renderReports())
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Ruta no encontrada\n')
}

const server = http.createServer(requestController)

server.listen(PORT, function () {
  console.log('Aplicacion corriendo en: ' + PORT)
})
