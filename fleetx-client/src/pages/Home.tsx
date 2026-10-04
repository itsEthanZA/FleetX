import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CarViewer from '../components/CarViewer'
import PageLayout from '../components/PageLayout'
import { getDashboard } from '../services/api'
import { getMaintenance } from '../services/api'
import type { Maintenance, Vehicle } from '../services/api'

export default function Home() {
  const [data, setData] = useState<any>()
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setData({}))
    getMaintenance().then(setMaintenance).catch(() => setMaintenance([]))
  }, [])

  const vehicle: Vehicle | undefined = data?.featuredVehicle

  const metrics = [
    ["Total vehicles", data?.totalVehicles, "▰", "Registered fleet assets", "/vehicles"],
    ["Active vehicles", data?.activeVehicles, "✓", "Currently ready for service", "/vehicles"],
    ["Drivers", data?.drivers, "♙", "Driver profiles", "/drivers"],
    ["Needs attention", (data?.overdueMaintenance ?? 0) + (data?.unassignedVehicles ?? 0), "!", "Service due or vehicle unassigned", "/maintenance"]
  ]

  return (
    <PageLayout title="Dashboard" subtitle="A real-time view of your fleet operations.">

      <section className="stats-grid dashboard-metrics">
        {metrics.map(([label, value, icon, detail, to]) => (
          <Link className="stat-card" key={String(label)} to={String(to)}>
            <div className="stat-icon">{icon}</div>

            <div>
              <span>{label}</span>
              <h3>{value ?? '—'}</h3>
              <small>{detail}</small>
            </div>
          </Link>
        ))}
      </section>

      {vehicle && (
        <section className="featured dashboard-featured">

          <div className="featured-copy">

            <p className="eyebrow">FEATURED VEHICLE</p>

            <h2>
              {vehicle.vehicleModel.make} {vehicle.vehicleModel.model}
            </h2>

            <p className="muted">
              {vehicle.vehicleModel.variant} · {vehicle.mileage.toLocaleString()} km
            </p>

            <div className="inline-stats">

              <span>
                <small>POWER</small>
                {Math.round(vehicle.vehicleModel.horsepower * 0.7457)} kW
              </span>

              <span>
                <small>TORQUE</small>
                {vehicle.vehicleModel.torque} Nm
              </span>

              <span className="badge">
                ● {vehicle.status}
              </span>

            </div>

            <Link
              className="button"
              to={`/vehicles/${vehicle.id}`}
            >
              View vehicle <span>→</span>
            </Link>

          </div>

          <div className="hero-model">
            <CarViewer modelUrl={vehicle.vehicleModel.threeDModelUrl} />
          </div>

        </section>
      )}

      <section className="dashboard-bottom">

        <div className="fleet-health">

          <div>
            <p className="eyebrow">FLEET HEALTH</p>

            <h2>
          {(data?.overdueMaintenance || data?.unassignedVehicles)
                ? 'A few items need your attention'
                : 'Fleet operating normally'}
            </h2>

            <p className="muted">
              {data?.overdueMaintenance || data?.unassignedVehicles
                ? `${data?.overdueMaintenance ?? 0} service item(s) overdue · ${data?.unassignedVehicles ?? 0} vehicle(s) without a driver.`
                : 'Your vehicles are assigned and there are no overdue service items.'}
            </p>
          </div>

            <Link to={data?.unassignedVehicles ? '/drivers' : '/maintenance'} className="text-link">
            Review actions →
          </Link>

        </div>

        <section className="dashboard-activity">
          <div className="activity-heading"><div><p className="eyebrow">UP NEXT</p><h2>Maintenance schedule</h2></div><Link to="/maintenance" className="text-link">View all →</Link></div>
          {maintenance.filter(item => item.status !== 'Completed').length ? maintenance.filter(item => item.status !== 'Completed').slice(0, 3).map(item => (
            <div className="schedule-row" key={item.id}>
              <span className={`schedule-mark ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status === 'Overdue' ? '!' : '✓'}</span>
              <div className="schedule-copy"><strong>{item.serviceType}</strong><span>{item.vehicle?.registrationNumber || 'Vehicle'} · {item.vendor || 'Vendor not set'}</span></div>
              <span className="schedule-date">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : new Date(item.serviceDate).toLocaleDateString()}</span>
              <span className={`schedule-status ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span>
            </div>
          )) : <div className="schedule-empty">No maintenance entries yet. <Link to="/maintenance">Schedule the first service →</Link></div>}
        </section>

        <section className="quick-grid">

          {[
            ["Vehicles", "/vehicles", "Manage vehicles and models", "▰"],
            ["Drivers", "/drivers", "Assign drivers and licences", "♙"],
            ["Maintenance", "/maintenance", "Schedule and track service", "⌁"],
            ["Fuel", "/fuel", "Track fuel spending", "◉"]
          ].map(([name, to, description, icon]) => (

            <Link
              className="quick-card"
              to={to}
              key={name}
            >
              <span className="quick-icon">{icon}</span>

              <strong>{name}</strong>

              <p>{description}</p>

              <em>Open →</em>
            </Link>

          ))}

        </section>

      </section>

    </PageLayout>
  )
}
