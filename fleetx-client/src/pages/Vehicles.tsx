import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import CarViewer from '../components/CarViewer'
import PageLayout from '../components/PageLayout'
import { create, getVehicleModels, getVehicles, remove } from '../services/api'
import type { Vehicle, VehicleModel } from '../services/api'

const blank = { registrationNumber: '', vin: '', mileage: 0, status: 'Active', vehicleModelId: '' };
export default function Vehicles() {
  const navigate = useNavigate(); const [vehicles, setVehicles] = useState<Vehicle[]>([]); const [models, setModels] = useState<VehicleModel[]>([]); const [query, setQuery] = useState(''); const [form, setForm] = useState<any>(); const [error, setError] = useState('');
  const load = () => Promise.all([getVehicles(), getVehicleModels()]).then(([v, m]) => { setVehicles(v); setModels(m) }).catch(() => setError('Could not load fleet data.'));
  useEffect(() => { load() }, []); const shown = useMemo(() => vehicles.filter(v => `${v.registrationNumber} ${v.vehicleModel.make} ${v.vehicleModel.model}`.toLowerCase().includes(query.toLowerCase())), [vehicles, query]);
  async function submit(e: FormEvent) { e.preventDefault(); try { await create('/vehicles', { ...form, mileage: Number(form.mileage), vehicleModelId: Number(form.vehicleModelId) }); setForm(undefined); load() } catch (e) { setError(e instanceof Error ? e.message : 'Could not save vehicle') } }
  return <PageLayout title="Vehicles" subtitle="View and manage your fleet." actions={<button className="button" onClick={() => setForm(blank)}>+ Add vehicle</button>}>
    {form && <form className="form-card" onSubmit={submit}><h2>Add vehicle</h2><input required placeholder="Registration number" value={form.registrationNumber} onChange={e => setForm({...form, registrationNumber:e.target.value})}/><input required placeholder="VIN" value={form.vin} onChange={e => setForm({...form, vin:e.target.value})}/><input required type="number" placeholder="Mileage" value={form.mileage} onChange={e => setForm({...form, mileage:e.target.value})}/><select required value={form.vehicleModelId} onChange={e => setForm({...form, vehicleModelId:e.target.value})}><option value="">Choose vehicle model</option>{models.map(m => <option key={m.id} value={m.id}>{m.make} {m.model} {m.year}</option>)}</select><select value={form.status} onChange={e => setForm({...form,status:e.target.value})}>{['Active','In Service','Under Maintenance','Retired'].map(s=><option key={s}>{s}</option>)}</select><button className="button">Save vehicle</button><button type="button" className="button secondary" onClick={()=>setForm(undefined)}>Cancel</button></form>}
    <input className="search" placeholder="Search registration or vehicle…" value={query} onChange={e => setQuery(e.target.value)} />{error && <p className="error">{error}</p>}
    <div className="vehicles-grid">{shown.map(v => <article className="vehicle-card" key={v.id}><div className="vehicle-3d"><CarViewer modelUrl={v.vehicleModel.threeDModelUrl}/></div><div className="vehicle-card-body"><div className="vehicle-card-heading"><span className="badge">{v.status}</span><h2>{v.vehicleModel.make} {v.vehicleModel.model}</h2></div><div className="vehicle-card-specs"><p><small>REGISTRATION</small>{v.registrationNumber}</p><p><small>MILEAGE</small>{v.mileage.toLocaleString()} km</p><p><small>POWER</small>{v.vehicleModel.horsepower} kW</p><p><small>FUEL</small>{v.vehicleModel.fuelType}</p></div><div className="vehicle-card-actions"><button className="button" onClick={()=>navigate(`/vehicles/${v.id}`)}>View vehicle →</button><button className="text-button" onClick={async()=>{if(confirm('Delete this vehicle?')) { await remove(`/vehicles/${v.id}`); load() }}}>Delete</button></div></div></article>)}</div>
  </PageLayout>
}
