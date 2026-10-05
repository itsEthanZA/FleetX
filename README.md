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

### 🧾 Driver trip logs
- Drivers record a completed trip with the car, start and end time, odometer readings, reason and fuel used
- FleetX calculates the distance and updates the car's latest odometer reading
- The owner overview summarizes distance and fuel by driver and car for the current month
- Service records can include a next service date or mileage limit, which the owner can monitor

### Typical day
1. The owner adds cars and driver profiles.
2. After each use, the driver opens **Driver trip log**, selects their name and car, and records the return odometer and fuel used.
3. The owner checks **Owner overview** for monthly usage and service items, and **Owner reports** for all-time totals by car and driver.

Trip logs record fuel **used while driving**. The **Fuel purchases** page separately records fuel bought and its cost.

To create the new trip log table and service mileage field in your configured SQL Server database, run this from `FleetX/FleetX.Api`:

```sh
dotnet ef database update
```

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
