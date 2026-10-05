import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Vehicles from './pages/Vehicles'
import VehicleDetails from './pages/VehicleDetails'
import Drivers from './pages/Drivers'
import Maintenance from './pages/Maintenance'
import Fuel from './pages/Fuel'
import Reports from './pages/Reports'
import Trips from './pages/Trips'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/vehicles" element={<Vehicles />} />

        <Route
          path="/vehicles/:id"
          element={<VehicleDetails />}
        />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/trips" element={<Trips />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
