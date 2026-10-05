import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import PageLayout from '../components/PageLayout'
import { create, getDrivers, getTrips, getVehicles } from '../services/api'
import type { Driver, TripLog, Vehicle } from '../services/api'

const now = new Date()
const localDateTime = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
const initialForm = { driverId: '', vehicleId: '', startedAt: localDateTime(new Date(now.getTime() - 60 * 60 * 1000)), endedAt: localDateTime(now), startOdometer: '', endOdometer: '', fuelUsedLitres: '0', purpose: '', notes: '' }

export default function Trips() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [trips, setTrips] = useState<TripLog[]>([])
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const load = () => Promise.all([getDrivers(), getVehicles(), getTrips()]).then(([d, v, t]) => { setDrivers(d.filter(x => x.status === 'Active')); setVehicles(v.filter(x => x.status === 'Active')); setTrips(t) }).catch(() => setError('Could not load drivers, cars and trip history.'))
  useEffect(() => { void load() }, [])

  const driverName = useMemo(() => drivers.find(d => String(d.id) === form.driverId), [drivers, form.driverId])
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setSaved(false)
    try {
      await create('/trips', { ...form, driverId: Number(form.driverId), vehicleId: Number(form.vehicleId), startOdometer: Number(form.startOdometer), endOdometer: Number(form.endOdometer), fuelUsedLitres: Number(form.fuelUsedLitres) })
      setSaved(true); setForm({ ...initialForm, driverId: form.driverId, vehicleId: form.vehicleId, startOdometer: form.endOdometer })
      await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save this trip.') }
  }

  return <PageLayout title="Driver trip log" subtitle="After each drive, record the car, distance and fuel used.">
    <section className="trip-intro"><span className="trip-intro-icon">↗</span><div><strong>One quick log after every trip</strong><p>Enter the odometer reading when the car leaves and when it returns. FleetX calculates distance, updates the car’s mileage and adds this drive to the owner’s totals.</p></div></section>
    {drivers.length === 0 || vehicles.length === 0 ? <section className="trip-empty"><h2>Set up cars and drivers first</h2><p>Add at least one car and one active driver before a trip can be logged.</p><div><a className="button" href="/vehicles">Add a car</a><a className="button secondary" href="/drivers">Add a driver</a></div></section> : <form className="trip-form" onSubmit={submit}>
      <h2>Log a completed trip</h2>
      <p className="trip-form-hint">The driver fills this in when returning the car.</p>
      <label>Driver<select required value={form.driverId} onChange={e => setForm({ ...form, driverId: e.target.value })}><option value="">Who drove?</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}</select></label>
      <label>Car<select required value={form.vehicleId} onChange={e => { const chosen = vehicles.find(v => String(v.id) === e.target.value); setForm({ ...form, vehicleId: e.target.value, startOdometer: chosen ? String(chosen.mileage) : form.startOdometer }) }}><option value="">Which car?</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} · {v.vehicleModel.make} {v.vehicleModel.model}</option>)}</select></label>
      <label>Left at<input required type="datetime-local" value={form.startedAt} onChange={e => setForm({ ...form, startedAt: e.target.value })}/></label>
      <label>Returned at<input required type="datetime-local" value={form.endedAt} onChange={e => setForm({ ...form, endedAt: e.target.value })}/></label>
      <label>Odometer when leaving (km)<input required type="number" min="0" value={form.startOdometer} onChange={e => setForm({ ...form, startOdometer: e.target.value })} placeholder="e.g. 45200"/></label>
      <label>Odometer when returning (km)<input required type="number" min={form.startOdometer || 0} value={form.endOdometer} onChange={e => setForm({ ...form, endOdometer: e.target.value })} placeholder="e.g. 45328"/></label>
      <label>Fuel used on this trip (litres)<input required type="number" min="0" step="0.1" value={form.fuelUsedLitres} onChange={e => setForm({ ...form, fuelUsedLitres: e.target.value })}/></label>
      <label>Reason for trip<input required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="Delivery, site visit, commute…"/></label>
      <div className="trip-distance"><span>Distance for this trip</span><strong>{Number(form.endOdometer) >= Number(form.startOdometer) && form.endOdometer ? (Number(form.endOdometer) - Number(form.startOdometer)).toLocaleString() : '—'} km</strong></div>
      {error && <p className="error trip-error">{error}</p>}{saved && <p className="trip-success">Trip saved. The car’s mileage and owner overview have been updated.</p>}
      <button className="button" type="submit" disabled={!driverName || !form.vehicleId}>Save trip log</button>
    </form>}
    <section className="trip-history"><div className="activity-heading"><div><p className="eyebrow">RECENT RECORDS</p><h2>Latest trips</h2></div></div>{trips.slice(0, 12).length ? <div className="report-table"><table><thead><tr><th>Returned</th><th>Driver</th><th>Car</th><th>Distance</th><th>Fuel used</th><th>Reason</th></tr></thead><tbody>{trips.slice(0, 12).map(t => <tr key={t.id}><td>{new Date(t.endedAt).toLocaleString()}</td><td>{t.driverName}</td><td>{t.registrationNumber}</td><td>{t.distanceKm.toLocaleString()} km</td><td>{t.fuelUsedLitres} L</td><td>{t.purpose || '—'}</td></tr>)}</tbody></table></div> : <p className="trip-history-empty">No trips logged yet. Each completed drive will appear here.</p>}</section>
  </PageLayout>
}
