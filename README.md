# FleetX

FleetX helps a company owner manage its cars and drivers. Drivers log each completed trip. The owner can review distance travelled, fuel used, recorded costs, and service reminders.

## What FleetX does

- Store company cars, registration numbers, VINs, current mileage, and vehicle details.
- Store driver profiles and optionally assign a regular car to each driver.
- Record each completed trip with driver, car, start and return times, odometer readings, fuel used, and trip purpose.
- Calculate trip distance from the odometer readings and update the car's current mileage.
- Record service work and its cost, and set the next service date, odometer reading, or both.
- Record fuel purchases separately from fuel used during trips.
- Show monthly distance and fuel use by driver and car, plus all-time totals and costs.
- View vehicle models in an interactive 3D viewer.

## How to use it

### Owner setup

1. Open **Cars** and add each company car. Include its current odometer reading.
2. Open **Drivers** and add each person who uses a car.
3. When a car is serviced, use **Service schedule** to record the work and set its next service date or mileage limit.

### Driver trip logging

After each completed drive, open **Driver trip log** and enter:

- The driver and car
- The time the trip started and ended
- The odometer reading before and after the trip
- The fuel used and the reason for the trip

FleetX calculates the distance travelled and updates the car's current mileage. The driver trip log records fuel used. **Fuel purchases** records fuel bought and its cost; these are separate records.

### Owner review

- **Owner overview** shows current-month distance and fuel use by driver and car, and highlights service items approaching their date or mileage limit.
- **Owner reports** shows all-time distance, fuel use, and recorded costs by car and driver.
- **Service schedule** shows service records and the next service limit entered by the owner.

## Requirements

- .NET 8 SDK
- Node.js and npm
- SQL Server

## Configure the database

The API reads its SQL Server connection string from the `DefaultConnection` setting. Configure it in your local development settings or through the `ConnectionStrings__DefaultConnection` environment variable. Keep local credentials out of GitHub.

For local development, put your own connection string in `FleetX/FleetX.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=FleetXDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

From the API project directory, create or update the database schema:

```bash
cd FleetX/FleetX.Api
dotnet ef database update
```

If the `dotnet ef` command is unavailable, install the matching Entity Framework tool once:

```bash
dotnet tool install --global dotnet-ef --version 8.0.13
```

The database update applies the checked-in migrations, including the trip log table and service mileage limit.

## Run FleetX locally

Open two terminals from the repository root.

**Terminal 1: run the API**

```bash
cd FleetX/FleetX.Api
ASPNETCORE_ENVIRONMENT=Development dotnet run --no-launch-profile
```

The API listens at `http://localhost:5249`. Its Swagger page is available at `http://localhost:5249/swagger` when running in Development.

**Terminal 2: run the frontend**

```bash
cd fleetx-client
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

The frontend uses `http://localhost:5249/api` by default. To use a different API address, set `VITE_API_URL` for the frontend.

## Technology

- **Frontend:** React, TypeScript, Vite, React Router, Three.js
- **API:** ASP.NET Core Web API on .NET 8
- **Database:** SQL Server and Entity Framework Core

## Project layout

```text
FleetX/
├── FleetX/                 # .NET API, models, controllers, migrations
│   └── FleetX.Api/
└── fleetx-client/          # React and TypeScript frontend
```

## Current limitations

- Trip details and fuel use are entered manually. FleetX does not track location by GPS or measure fuel automatically.
- There are no individual user accounts or role permissions yet. A driver selects their name in the trip form, so the app does not verify the submitter or limit drivers to their own records.
- Service reminders are based on the date or mileage limit entered in a service record.
