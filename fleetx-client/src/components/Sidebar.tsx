import { NavLink } from 'react-router-dom'

function Sidebar() {
  const links = [
    ['/', 'Owner overview', '▦'],
    ['/vehicles', 'Cars', '▰'],
    ['/drivers', 'Drivers', '♙'],
    ['/trips', 'Driver trip log', '↗'],
    ['/maintenance', 'Service schedule', '⌁'],
    ['/fuel', 'Fuel purchases', '◉'],
    ['/reports', 'Costs', '▤'],
  ] as const

  return (
    <aside className="sidebar">
      <div className="logo"><span>F</span>FleetX</div>
      <div className="sidebar-org"><span className="org-mark">FX</span><div><strong>Owner workspace</strong><small>Fleet operations</small></div></div>
      <p className="nav-section-label">Manage your fleet</p>
      <nav>
        {links.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/'} className="nav-item"><span className="nav-icon" aria-hidden="true">{icon}</span>{label}</NavLink>)}
      </nav>
      <div className="sidebar-bottom"><p>FleetX Platform</p><span>Fleet operations suite</span></div>
    </aside>
  )
}

export default Sidebar
