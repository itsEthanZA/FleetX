# FleetX 🚗

A modern full-stack fleet management system built to help businesses manage vehicles, drivers, maintenance, fuel usage and fleet operations from a single dashboard.

FleetX combines a C#/.NET REST API with a React frontend and an interactive 3D vehicle viewer.

---

## 🚀 Features

### Fleet Dashboard
- Real-time fleet overview
- Total vehicle statistics
- Active vehicle tracking
- Driver statistics
- Maintenance alerts
- Fleet health overview

### 🚘 Vehicle Management
- Add and manage fleet vehicles
- Vehicle registration numbers
- VIN tracking
- Mileage tracking
- Vehicle status
- Vehicle specifications
- Vehicle model management

### 🛠 Maintenance Management
- Track vehicle maintenance
- Service types
- Service providers
- Service dates
- Due dates
- Maintenance costs
- Maintenance status
- Maintenance notes

### ⛽ Fuel Management
- Track fuel logs
- Fuel spending
- Vehicle fuel history
- Fuel usage information

### 👤 Driver Management
- Driver profiles
- Driver assignments
- Licence information
- Vehicle-driver relationships

### 🚗 Interactive 3D Vehicles
FleetX includes an interactive 3D vehicle viewer using GLB models.

Users can:
- Rotate vehicles
- Inspect vehicles in 3D
- View different vehicle models
- Explore the fleet visually

---

## 🧰 Tech Stack

### Backend

- C#
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger / OpenAPI

### Frontend

- React
- TypeScript
- Vite
- React Router
- Three.js
- React Three Fiber
- React Three Drei
- CSS

### Architecture

```text
React + TypeScript
        │
        │ REST API
        ▼
ASP.NET Core Web API
        │
        │ Entity Framework Core
        ▼
     SQL Server