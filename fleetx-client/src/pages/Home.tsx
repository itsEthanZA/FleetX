import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CarViewer from '../components/CarViewer'
import PageLayout from '../components/PageLayout'
import { getDashboard } from '../services/api'
import type { Vehicle } from '../services/api'

export default function Home() {
  const [data, setData] = useState<any>()

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setData({}))
  }, [])

  const vehicle: Vehicle | undefined = data?.featuredVehicle

  const metrics = [
    ["Total vehicles", data?.totalVehicles, "🚗", "All registered fleet assets"],
    ["Active vehicles", data?.activeVehicles, "✓", "Ready for service"],
    ["Drivers", data?.drivers, "👤", "Active driver profiles"],
    ["Overdue service", data?.overdueMaintenance, "⚠", "Requires your attention"]
  ]

  return (
    <PageLayout title="Dashboard" subtitle="A real-time view of your fleet operations.">

      <section className="stats-grid dashboard-metrics">
        {metrics.map(([label, value, icon, detail]) => (
          <div className="stat-card" key={String(label)}>
            <div className="stat-icon">{icon}</div>

            <div>
              <span>{label}</span>
              <h3>{value ?? '—'}</h3>
              <small>{detail}</small>
            </div>
          </div>
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
              {data?.overdueMaintenance
                ? 'Service attention needed'
                : 'Fleet operating normally'}
            </h2>

            <p className="muted">
              {data?.overdueMaintenance
                ? `${data.overdueMaintenance} service item(s) need review.`
                : 'There are no overdue maintenance items in your fleet.'}
            </p>
          </div>

          <Link to="/maintenance" className="text-link">
            Review maintenance →
          </Link>

        </div>

        <section className="quick-grid">

          {[
            ["Vehicles", "/vehicles", "Manage vehicles and models", "🚗"],
            ["Drivers", "/drivers", "Assign drivers and licences", "👤"],
            ["Maintenance", "/maintenance", "Schedule and track service", "🔧"],
            ["Fuel", "/fuel", "Track fuel spending", "⛽"]
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