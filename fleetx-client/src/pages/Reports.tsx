import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import { getReport, reportCsvUrl } from '../services/api'

type CarReport = { vehicleId: number; name: string; registration: string; mileage: number; maintenanceCost: number; fuelCost: number; distanceDrivenKm?: number; fuelUsedLitres?: number }
type DriverReport = { driverId: number; driverName: string; tripCount: number; distanceDrivenKm: number; fuelUsedLitres: number }
type Report = { totalVehicles?: number; distanceDrivenKm?: number; fuelBoughtLitres?: number; fuelUsedLitres?: number; byVehicle?: CarReport[]; byDriver?: DriverReport[] }

export default function Reports() {
  const [report, setReport] = useState<Report>()
  const [error, setError] = useState('')
  const load = () => getReport().then(setReport).catch(() => setError('Could not load cost and trip totals. Check that the FleetX API is running, then try again.'))
  useEffect(() => { void load() }, [])
  const cars = report?.byVehicle ?? []
  const drivers = report?.byDriver ?? []

  return <PageLayout title="Owner reports" subtitle="Review how much each car and driver has been using the fleet." actions={<a className="button" href={reportCsvUrl}>Download car list</a>}>
    {error ? <section className="report-message"><strong>Reports are unavailable</strong><p>{error}</p><button className="button" onClick={() => { setError(''); void load() }}>Try again</button></section> : !report ? <p>Loading fleet totals…</p> : <>
      <section className="stats-grid">
        {[["Cars", report.totalVehicles ?? 0], ["Distance driven", `${(report.distanceDrivenKm ?? 0).toLocaleString()} km`], ["Fuel used", `${(report.fuelUsedLitres ?? 0).toFixed(1)} L`], ["Fuel purchased", `${(report.fuelBoughtLitres ?? 0).toFixed(1)} L`]].map(([label, value]) => <div className="stat-card" key={String(label)}><span>{label}</span><h3>{value}</h3></div>)}
      </section>
      <section className="report-table"><h2>Use by car</h2><table><thead><tr><th>Car</th><th>Number plate</th><th>Current mileage</th><th>Distance logged</th><th>Fuel used</th><th>Service cost</th><th>Fuel cost</th></tr></thead><tbody>{cars.map(car => <tr key={car.vehicleId}><td>{car.name}</td><td>{car.registration}</td><td>{car.mileage.toLocaleString()} km</td><td>{(car.distanceDrivenKm ?? 0).toLocaleString()} km</td><td>{(car.fuelUsedLitres ?? 0).toFixed(1)} L</td><td>R{car.maintenanceCost.toFixed(2)}</td><td>R{car.fuelCost.toFixed(2)}</td></tr>)}</tbody></table>{cars.length === 0 && <p className="usage-empty">Add a car to start tracking costs.</p>}</section>
      <section className="report-table owner-driver-report"><h2>Use by driver</h2><table><thead><tr><th>Driver</th><th>Trips logged</th><th>Distance driven</th><th>Fuel used</th></tr></thead><tbody>{drivers.map(driver => <tr key={driver.driverId}><td>{driver.driverName}</td><td>{driver.tripCount}</td><td>{driver.distanceDrivenKm.toLocaleString()} km</td><td>{driver.fuelUsedLitres.toFixed(1)} L</td></tr>)}</tbody></table>{drivers.length === 0 && <p className="usage-empty">Driver usage will appear after trips have been logged.</p>}</section>
      <p className="report-note">Fuel purchased is entered under Fuel purchases. Fuel used is reported by drivers after each trip.</p>
    </>}
  </PageLayout>
}
