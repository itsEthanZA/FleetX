import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CarViewer from '../components/CarViewer'
import PageLayout from '../components/PageLayout'
import { getDashboard, getTrips } from '../services/api'
import { getMaintenance } from '../services/api'
import type { Maintenance, TripLog, Vehicle } from '../services/api'

export default function Home() {
  const [data, setData] = useState<any>()
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [trips, setTrips] = useState<TripLog[]>([])

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setData(null))
    getMaintenance().then(setMaintenance).catch(() => setMaintenance([]))
    getTrips().then(setTrips).catch(() => setTrips([]))
  }, [])

  const vehicle: Vehicle | undefined = data?.featuredVehicle

  const currentDate = new Date()
  const monthlyTrips = trips.filter(t => { const d = new Date(t.endedAt); return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear() })
  const kmThisMonth = monthlyTrips.reduce((total, t) => total + t.distanceKm, 0)
  const fuelThisMonth = monthlyTrips.reduce((total, t) => total + t.fuelUsedLitres, 0)
  const driverUsage = Object.values(monthlyTrips.reduce<Record<string, { name: string; trips: number; km: number; litres: number }>>((groups, trip) => {
    const key = String(trip.driverId)
    const row = groups[key] ?? (groups[key] = { name: trip.driverName, trips: 0, km: 0, litres: 0 })
    row.trips += 1; row.km += trip.distanceKm; row.litres += trip.fuelUsedLitres
    return groups
  }, {})).sort((a, b) => b.km - a.km)
  const carUsage = Object.values(monthlyTrips.reduce<Record<string, { registration: string; trips: number; km: number; litres: number }>>((groups, trip) => {
    const key = String(trip.vehicleId)
    const row = groups[key] ?? (groups[key] = { registration: trip.registrationNumber, trips: 0, km: 0, litres: 0 })
    row.trips += 1; row.km += trip.distanceKm; row.litres += trip.fuelUsedLitres
    return groups
  }, {})).sort((a, b) => b.km - a.km)
  const serviceDue = maintenance.filter(item => item.status !== 'Completed' && ((item.dueDate && new Date(item.dueDate) < currentDate) || (item.dueMileage != null && item.vehicle && item.vehicle.mileage >= item.dueMileage)))
  const dueCarCount = new Set(serviceDue.map(item => item.vehicleId)).size
  const metrics = [
    ["Cars owned", data?.totalVehicles, "▰", "Registered company cars", "/vehicles"],
    ["Drivers", data?.drivers, "♙", "People assigned to your cars", "/drivers"],
    ["Distance this month", kmThisMonth.toLocaleString(), "↗", `${monthlyTrips.length} trip logs`, "/trips"],
    ["Fuel used this month", `${fuelThisMonth.toFixed(1)} L`, "◉", "Reported by drivers", "/trips"]
  ]

  return (
    <PageLayout title="Owner overview" subtitle="See how your cars are being used, what they cost and which need service.">

      {!data?.totalVehicles && data && <section className="garage-welcome">
        <div className="garage-welcome-copy"><p className="eyebrow">OWNER SETUP</p><h2>Start by adding your cars</h2><p>Then add your drivers. They can record each trip, and you’ll see the distance and fuel they report here.</p><Link className="button" to="/vehicles?add=1">＋ Add your first car</Link></div>
        <div className="garage-steps"><div><span>1</span><p><strong>Add company cars</strong><small>Registration, model and odometer</small></p></div><div><span>2</span><p><strong>Add drivers</strong><small>People who are allowed to use a car</small></p></div><div><span>3</span><p><strong>Review trip logs</strong><small>Distance and fuel after every drive</small></p></div></div>
      </section>}

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

              <p className="eyebrow">YOUR CAR</p>

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

        <section className="owner-usage-grid">
          <article className="owner-usage-panel"><div className="activity-heading"><div><p className="eyebrow">THIS MONTH</p><h2>Use by driver</h2></div><Link to="/trips" className="text-link">All trip logs →</Link></div>
            {driverUsage.length ? <div className="usage-list">{driverUsage.slice(0, 5).map(row => <div className="usage-row" key={row.name}><strong>{row.name}</strong><span>{row.trips} trips</span><b>{row.km.toLocaleString()} km</b><span>{row.litres.toFixed(1)} L fuel</span></div>)}</div> : <p className="usage-empty">Driver totals will appear after trips are logged.</p>}
          </article>
          <article className="owner-usage-panel"><div className="activity-heading"><div><p className="eyebrow">THIS MONTH</p><h2>Use by car</h2></div><Link to="/vehicles" className="text-link">All cars →</Link></div>
            {carUsage.length ? <div className="usage-list">{carUsage.slice(0, 5).map(row => <div className="usage-row" key={row.registration}><strong>{row.registration}</strong><span>{row.trips} trips</span><b>{row.km.toLocaleString()} km</b><span>{row.litres.toFixed(1)} L fuel</span></div>)}</div> : <p className="usage-empty">Car totals will appear after trips are logged.</p>}
          </article>
        </section>

        <div className="fleet-health">

          <div>
            <p className="eyebrow">SERVICE WATCH</p>

            <h2>
          {dueCarCount || data?.unassignedVehicles
                ? 'Some cars need your attention'
                : 'No urgent items reported'}
            </h2>

            <p className="muted">
              {dueCarCount || data?.unassignedVehicles
                ? `${dueCarCount} car(s) due for service · ${data?.unassignedVehicles ?? 0} car(s) without an assigned driver.`
                : 'No service dates or mileage limits have been reached.'}
            </p>
          </div>

            <Link to={data?.unassignedVehicles ? '/drivers' : '/maintenance'} className="text-link">
            Review fleet →
          </Link>

        </div>

        <section className="dashboard-activity">
          <div className="activity-heading"><div><p className="eyebrow">SERVICE WATCH</p><h2>Cars approaching service</h2></div><Link to="/maintenance" className="text-link">Service schedule →</Link></div>
          {maintenance.filter(item => item.status !== 'Completed').length ? maintenance.filter(item => item.status !== 'Completed').slice(0, 3).map(item => (
            <div className="schedule-row" key={item.id}>
              <span className={`schedule-mark ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status === 'Overdue' ? '!' : '✓'}</span>
              <div className="schedule-copy"><strong>{item.vehicle?.registrationNumber || 'Car'} · {item.serviceType}</strong><span>{item.dueMileage ? `Due at ${item.dueMileage.toLocaleString()} km` : item.dueDate ? `Due ${new Date(item.dueDate).toLocaleDateString()}` : `Last recorded ${new Date(item.serviceDate).toLocaleDateString()}`}</span></div>
              <span className="schedule-date">{item.vehicle?.mileage.toLocaleString()} km</span>
              <span className={`schedule-status ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span>
            </div>
          )) : <div className="schedule-empty">No service due records. <Link to="/maintenance">Set a service date or mileage limit →</Link></div>}
        </section>

        <section className="quick-grid">

          {[
            ["Cars", "/vehicles", "Add and assign company cars", "▰"],
            ["Drivers", "/drivers", "Manage who drives each car", "♙"],
            ["Driver trip log", "/trips", "Review trips, distance and fuel used", "↗"],
            ["Service schedule", "/maintenance", "Set the next service date or mileage", "⌁"]
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
