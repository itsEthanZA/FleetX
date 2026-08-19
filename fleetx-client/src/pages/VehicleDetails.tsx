import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CarViewer from '../components/CarViewer'
import PageLayout from '../components/PageLayout'
import { getFuelLogs, getMaintenance, getVehicle } from '../services/api'
import type { FuelLog, Maintenance, Vehicle } from '../services/api'
import './VehicleDetails.css'

export default function VehicleDetails() {
  const { id } = useParams(); const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null); const [maintenance, setMaintenance] = useState<Maintenance[]>([]); const [fuel, setFuel] = useState<FuelLog[]>([]); const [error, setError] = useState('')
  useEffect(() => { if (!id) return; Promise.all([getVehicle(Number(id)), getMaintenance(), getFuelLogs()]).then(([v, m, f]) => { setVehicle(v); setMaintenance(m.filter(x => x.vehicleId === v.id)); setFuel(f.filter(x => x.vehicleId === v.id)) }).catch(() => setError('Could not load this vehicle record.')) }, [id])
  if (error) return <PageLayout title="Vehicle record"><p className="error">{error}</p></PageLayout>
  if (!vehicle) return <PageLayout title="Vehicle record"><p>Loading vehicle record…</p></PageLayout>
  const v = vehicle; const latestService = maintenance.sort((a,b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())[0]; const latestFuel = fuel.sort((a,b) => new Date(b.filledAt).getTime() - new Date(a.filledAt).getTime())[0]
  return <PageLayout title={`${v.vehicleModel.make} ${v.vehicleModel.model}`} subtitle={`${v.vehicleModel.variant} · ${v.vehicleModel.year} · ${v.registrationNumber}`} actions={<button className="button secondary" onClick={() => navigate('/vehicles')}>← Back to vehicles</button>}>
    <section className="vehicle-record-hero"><div className="record-visual"><CarViewer modelUrl={v.vehicleModel.threeDModelUrl}/><span className="record-status">● {v.status}</span></div><div className="record-summary"><p className="eyebrow">VEHICLE PROFILE</p><h2>{v.vehicleModel.make} {v.vehicleModel.model}</h2><p className="record-variant">{v.vehicleModel.variant} <span>•</span> {v.vehicleModel.year}</p><div className="record-kpis"><div><small>POWER</small><strong>{v.vehicleModel.horsepower} <em>kW</em></strong></div><div><small>TORQUE</small><strong>{v.vehicleModel.torque} <em>Nm</em></strong></div><div><small>ODOMETER</small><strong>{v.mileage.toLocaleString()} <em>km</em></strong></div></div><div className="record-registration"><small>REGISTRATION NUMBER</small><strong>{v.registrationNumber}</strong></div></div></section>
    <section className="record-grid"><article className="record-panel"><p className="eyebrow">VEHICLE DETAILS</p><h2>Identity & specification</h2><dl className="detail-list"><div><dt>Registration</dt><dd>{v.registrationNumber}</dd></div><div><dt>VIN</dt><dd className="vin-value">{v.vin}</dd></div><div><dt>Fuel type</dt><dd>{v.vehicleModel.fuelType}</dd></div><div><dt>Transmission</dt><dd>{v.vehicleModel.transmission}</dd></div></dl></article><article className="record-panel"><p className="eyebrow">OPERATIONS</p><h2>Recent activity</h2><div className="activity-item"><span className="activity-icon">🔧</span><div><strong>{latestService ? latestService.serviceType : 'No maintenance logged'}</strong><p>{latestService ? `${new Date(latestService.serviceDate).toLocaleDateString()} · ${latestService.status}` : 'Log a service from the Maintenance page.'}</p></div></div><div className="activity-item"><span className="activity-icon">⛽</span><div><strong>{latestFuel ? `${latestFuel.litres} L fuel entry` : 'No fuel logged'}</strong><p>{latestFuel ? `${new Date(latestFuel.filledAt).toLocaleDateString()} · R${latestFuel.cost.toFixed(2)}` : 'Log a fill-up from the Fuel page.'}</p></div></div></article></section>
  </PageLayout>
}
