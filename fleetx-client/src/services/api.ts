const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5249/api'

export interface VehicleModel { id: number; make: string; model: string; variant: string; year: number; fuelType: string; horsepower: number; torque: number; transmission: string; threeDModelUrl: string }
export interface Vehicle { id: number; registrationNumber: string; vin: string; mileage: number; status: string; vehicleModelId: number; vehicleModel: VehicleModel }
export interface Driver { id: number; firstName: string; lastName: string; licenseNumber: string; phoneNumber: string; status: string; vehicleId?: number | null; licenseExpiryDate?: string | null; vehicle?: Vehicle }
export interface Maintenance { id: number; vehicleId: number; serviceType: string; vendor: string; serviceDate: string; dueDate?: string | null; mileage: number; cost: number; notes: string; status: string; vehicle?: Vehicle }
export interface FuelLog { id: number; vehicleId: number; filledAt: string; litres: number; cost: number; odometer: number; station: string; notes: string; vehicle?: Vehicle }

async function request<T>(path: string, options?: RequestInit): Promise<T> { const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }, ...options }); if (!response.ok) throw new Error((await response.text()) || 'Request failed'); return response.status === 204 ? undefined as T : response.json() }

export const getVehicles = () => request<Vehicle[]>('/vehicles')

export const getVehicle = (id: number) => request<Vehicle>(`/vehicles/${id}`)
export const getVehicleModels = () => request<VehicleModel[]>('/vehiclemodels')
export const getDrivers = () => request<Driver[]>('/drivers')
export const getMaintenance = () => request<Maintenance[]>('/maintenance')
export const getFuelLogs = () => request<FuelLog[]>('/fuel')
export const getDashboard = () => request<any>('/dashboard')
export const getReport = () => request<any>('/reports/summary')
export const create = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) })
export const update = (path: string, body: unknown) => request<void>(path, { method: 'PUT', body: JSON.stringify(body) })
export const remove = (path: string) => request<void>(path, { method: 'DELETE' })
export const reportCsvUrl = `${API_URL}/reports/vehicles.csv`
