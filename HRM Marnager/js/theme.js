// ═══════════════════════════════════════════════════════════
// theme.js — Design System & Styling
// GehaltsManager — SieuVuong
// ═══════════════════════════════════════════════════════════

// ── Color Palette ──
export const colors = {
  bg:   '#f0f2f5',      // Background
  sf:   '#ffffff',      // Surface
  sf2:  '#f7f8fa',      // Surface secondary
  bd:   '#e2e4e9',      // Border
  tx:   '#1a1d26',      // Text primary
  tx2:  '#6b7280',      // Text secondary
  tx3:  '#9ca3af',      // Text tertiary
  ac:   '#3b7ddd',      // Accent (blue)
  acG:  'rgba(59,125,221,0.1)',   // Accent ghost
  ok:   '#10b981',      // Success (green)
  okB:  'rgba(16,185,129,0.08)',  // Success background
  wn:   '#d97706',      // Warning (amber)
  wnB:  'rgba(217,119,6,0.08)',   // Warning background
  no:   '#ef4444',      // Error (red)
  noB:  'rgba(239,68,68,0.08)',   // Error background
};

// ── Typography ──
export const fontMain = "'DM Sans',system-ui,sans-serif";
export const fontMono = "'JetBrains Mono',monospace";

// ── Shared Styles ──
export const styles = {
  // App Container
  app: {
    display: 'flex',
    height: '100vh',
    fontFamily: fontMain,
    background: colors.bg,
    color: colors.tx,
    fontSize: 13,
    overflow: 'hidden',
    position: 'relative',
  },

  // Sidebar (Desktop)
  side: {
    width: 220,
    background: colors.sf,
    borderRight: `1px solid ${colors.bd}`,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100vh',
    overflow: 'hidden',
    zIndex: 90,
  },

  // Sidebar (Mobile)
  sideM: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 260,
    background: colors.sf,
    borderRight: `1px solid ${colors.bd}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 100,
    boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
  },

  // Mobile Overlay
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 99,
  },

  // Main Area
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Header
  head: {
    padding: '12px 20px',
    borderBottom: `1px solid ${colors.bd}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: colors.sf,
  },

  // Body
  body: {
    flex: 1,
    padding: 18,
    overflow: 'auto',
  },

  // Card
  card: {
    background: colors.sf,
    border: `1px solid ${colors.bd}`,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  // Section Title
  title: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.tx2,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 10,
  },

  // Row Layout
  row: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },

  // KPI Card (dynamic border-left color)
  kpi: (color) => ({
    flex: '1 1 140px',
    background: colors.sf,
    border: `1px solid ${colors.bd}`,
    borderRadius: 8,
    padding: '12px 14px',
    borderLeft: `3px solid ${color}`,
  }),

  // KPI Label
  kL: {
    fontSize: 9,
    color: colors.tx2,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  // KPI Value
  kV: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 2,
    fontFamily: fontMono,
  },

  // KPI Subtitle
  kS: {
    fontSize: 9,
    color: colors.tx3,
    marginTop: 1,
  },

  // Table
  tbl: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11.5,
  },

  // Table Header
  th: {
    padding: '7px 9px',
    textAlign: 'left',
    borderBottom: `1px solid ${colors.bd}`,
    color: colors.tx2,
    fontWeight: 600,
    fontSize: 9.5,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    position: 'sticky',
    top: 0,
    background: colors.sf,
    whiteSpace: 'nowrap',
    zIndex: 1,
  },

  // Table Cell
  td: {
    padding: '6px 9px',
    borderBottom: `1px solid ${colors.bd}`,
    whiteSpace: 'nowrap',
  },

  // Badge (dynamic)
  badge: (bg, color) => ({
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 9.5,
    fontWeight: 600,
    background: bg,
    color: color,
  }),

  // Select Input
  sel: {
    background: colors.sf2,
    border: `1px solid ${colors.bd}`,
    color: colors.tx,
    padding: '5px 9px',
    borderRadius: 5,
    fontSize: 11.5,
    fontFamily: fontMain,
    cursor: 'pointer',
    outline: 'none',
  },

  // Text Input
  inp: {
    background: colors.sf2,
    border: `1px solid ${colors.bd}`,
    color: colors.tx,
    padding: '5px 9px',
    borderRadius: 5,
    fontSize: 11.5,
    fontFamily: fontMain,
    outline: 'none',
  },

  // Editable Input (inline)
  eInp: {
    background: 'rgba(79,143,247,0.06)',
    border: '1px solid rgba(79,143,247,0.25)',
    color: colors.tx,
    padding: '3px 6px',
    borderRadius: 4,
    fontSize: 11,
    fontFamily: fontMono,
    width: 72,
    outline: 'none',
    textAlign: 'right',
  },

  // Button (variant: 'p'=primary, 'ok'=success, 'no'=danger, default=ghost)
  btn: (variant) => ({
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 11.5,
    fontWeight: 600,
    fontFamily: fontMain,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.12s',
    ...(variant === 'p'
      ? { background: colors.ac, color: '#fff' }
      : variant === 'ok'
      ? { background: colors.ok, color: '#000' }
      : variant === 'no'
      ? { background: colors.no, color: '#fff' }
      : { background: 'transparent', border: `1px solid ${colors.bd}`, color: colors.tx2 }),
  }),

  // Navigation Item
  nav: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    background: active ? colors.acG : 'transparent',
    color: active ? colors.ac : colors.tx2,
    fontWeight: active ? 600 : 400,
    fontSize: 12,
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: fontMain,
    transition: 'all 0.12s',
  }),

  // Tooltip
  tip: {
    background: colors.sf2,
    border: `1px solid ${colors.bd}`,
    borderRadius: 6,
    fontSize: 10,
    color: colors.tx,
  },

  // 2-Column Grid
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },

  // Chart Wrapper
  chW: { height: 220 },

  // Pill Button (dynamic)
  pill: (bg, color) => ({
    padding: '3px 7px',
    borderRadius: 5,
    fontSize: 9,
    fontWeight: 600,
    background: bg,
    color: color,
    cursor: 'pointer',
    border: 'none',
    fontFamily: fontMain,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
  }),

  // Modal Overlay
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  // Modal Box
  mBox: {
    background: colors.sf,
    border: `1px solid ${colors.bd}`,
    borderRadius: 14,
    width: '100%',
    maxWidth: 700,
    maxHeight: '85vh',
    overflow: 'auto',
    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
  },

  // Hamburger Menu Button
  hamburger: {
    display: 'none',
    padding: '8px 12px',
    border: 'none',
    background: 'transparent',
    color: colors.tx,
    fontSize: 22,
    cursor: 'pointer',
    fontFamily: fontMain,
  },
};
