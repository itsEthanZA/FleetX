import { NavLink } from 'react-router-dom'

function Sidebar() {
  const links = [
    ['/', 'Dashboard', '▦'],
    ['/vehicles', 'Vehicles', '▰'],
    ['/drivers', 'Drivers', '♙'],
    ['/maintenance', 'Maintenance', '⌁'],
    ['/fuel', 'Fuel', '◉'],
    ['/reports', 'Reports', '▤'],
  ] as const

  return (
    <aside className="sidebar">
      <div className="logo"><span>F</span>FleetX</div>
      <div className="sidebar-org"><span className="org-mark">FX</span><div><strong>FleetX workspace</strong><small>Fleet operations</small></div></div>
      <p className="nav-section-label">Workspace</p>
      <nav>
        {links.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/'} className="nav-item"><span className="nav-icon" aria-hidden="true">{icon}</span>{label}</NavLink>)}
      </nav>
      <div className="sidebar-bottom"><p>FleetX Platform</p><span>Fleet operations suite</span></div>
    </aside>
  )
}

export default Sidebar
