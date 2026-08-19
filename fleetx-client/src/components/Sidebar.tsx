import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo"><span>F</span>FleetX</div>

      <nav>
        <NavLink to="/" end className="nav-item">Dashboard</NavLink>
        <NavLink to="/vehicles" className="nav-item">Vehicles</NavLink>
        <NavLink to="/drivers" className="nav-item">Drivers</NavLink>
        <NavLink to="/maintenance" className="nav-item">Maintenance</NavLink>
        <NavLink to="/fuel" className="nav-item">Fuel</NavLink>
        <NavLink to="/reports" className="nav-item">Reports</NavLink>
      </nav>
      <div className="sidebar-bottom"><p>FleetX</p><span>Fleet Management</span></div></aside>
  )
}

export default Sidebar
