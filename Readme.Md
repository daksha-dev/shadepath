# ArkaWay

ArkaWay is a frontend-only hackathon proof-of-concept that demonstrates UV-dose-aware route ranking for two-wheeler commuters in Bengaluru.

Instead of showing only city-level UV Index, ArkaWay estimates route-level UV dose by combining:

- UV Index from Open-Meteo, with demo fallback data
- Route travel time
- Simulated shade fraction by segment
- Activity mode
- User protection profile
- Departure time

The prototype compares multiple route alternatives and recommends the lowest UV-exposure route, which is not always the fastest route.

## Demo Features

- React + Vite + TypeScript frontend
- Leaflet and OpenStreetMap map tiles, with no paid API keys
- Hardcoded Bengaluru demo routes
- Segment-level green, yellow, and red UV exposure styling
- Deterministic UV dose calculation
- Departure-time optimization
- Gear recommendation card
- Exposure saved tracker
- Mock institutional city risk heatmap
- Mock fleet dashboard for B2B storytelling

## Demo Routes

- Koramangala to MG Road
- Indiranagar to Cubbon Park
- Jayanagar to Bengaluru City Center

## UV Dose Model

The frontend uses a simple deterministic scoring function:

```ts
dose = uvIndex * cloudFactor * (1 - shadeFraction) * bodyExposureFactor * segmentMinutes
```

Grades:

- A: `< 80 UVI-min`
- B: `80-160 UVI-min`
- C: `160-240 UVI-min`
- D: `240-320 UVI-min`
- F: `> 320 UVI-min`

This model is for demo storytelling only and is not a validated medical or environmental exposure model.

## Live UV Source

The app makes one optional API call to Open-Meteo:

```txt
https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&hourly=uv_index,uv_index_clear_sky,cloud_cover&timezone=Asia%2FKolkata&forecast_days=2
```

If the API fails, the app uses fallback demo UV values.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually:

```txt
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

## Project Structure

```txt
src/
  components/
    MapView.tsx
    RouteCard.tsx
    ProfileControls.tsx
    GearRecommendation.tsx
    ExposureTracker.tsx
    CityRiskMap.tsx
    FleetDashboard.tsx
  data/
    bangaloreRoutes.ts
    mockHeatmap.ts
  utils/
    uvDose.ts
    openMeteo.ts
    routeScoring.ts
  App.tsx
  main.tsx
  index.css
```

## Disclaimer

Prototype uses simulated route shade data for demonstration. Production version will integrate route APIs, OSM canopy/building data, and validated UV exposure models.
