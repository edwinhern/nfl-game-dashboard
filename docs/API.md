# 🚀 API Documentation

This document provides detailed information about the endpoints available in our NFL Game Ticket System API.

## 🏈 Game Endpoints

### 📋 GET /api/games

Retrieves a list of games based on specified filters.

#### Query Parameters:

- `startDate`: ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
- `endDate`: ISO 8601 format
- `teamId`: UUID of a team
- `stadiumId`: UUID of a stadium
- `status`: Game status (e.g., 'onsale', 'cancelled')

#### Response:

```json
{
  "success": true,
  "message": "Games retrieved successfully",
  "responseObject": [
    {
      "id": "fbe9c214-c3ac-42e1-af2e-8ddc1a7bac31",
      "name": "Los Angeles Chargers vs. Tennessee Titans",
      "start_date": "2024-11-11T03:05:00.000Z",
      "end_date": "2024-11-11T07:05:00.000Z",
      "status": "onsale",
      "min_price": "59.00",
      "max_price": "615.00",
      "stadium_id": "9963e477-6282-42c7-a4b3-e931cf32ed46",
      "team_names": ["Los Angeles Chargers", "Tennessee Titans"]
    }
    // ... more games
  ],
  "statusCode": 200
}
```

### 👥 GET /api/games/teams

Retrieves a list of all teams in the system.

#### Response:

```json
{
  "success": true,
  "message": "Teams retrieved successfully",
  "responseObject": [
    {
      "id": "cc5b4d24-95a6-4ba9-bb12-82d24779bec9",
      "name": "Tampa Bay Buccaneers",
      "city": "Tampa",
      "state": "FL",
      "country": "US"
    }
    // ... more teams
  ],
  "statusCode": 200
}
```

### 🏟️ GET /api/games/stadiums

Retrieves a list of all stadiums in the system.

#### Response:

```json
{
  "success": true,
  "message": "Stadiums retrieved successfully",
  "responseObject": [
    {
      "id": "69dfdc9b-ed87-466a-a1a1-2d92f90f14ea",
      "name": "Raymond James Stadium",
      "city": "Tampa",
      "state": "FL",
      "country": "US",
      "zipcode": "33607",
      "address": "4201 North Dale Mabry Highway",
      "timezone": "America/New_York",
      "lon": "-82.503474",
      "lat": "27.975976"
    }
    // ... more stadiums
  ],
  "statusCode": 200
}
```

## 🔄 Synchronization Endpoints

### GET /api/sync/testSync

Manually triggers a synchronization with the Ticketmaster API.

#### Response:

```json
{
  "success": true,
  "message": "Game sync completed successfully",
  "responseObject": {
    "totalProcessedEvents": 56,
    "totalSkippedEvents": 11
  },
  "statusCode": 200
}
```

### ⏰ GET /api/sync/nextSync

Retrieves the scheduled time for the next automatic synchronization.

#### Response:

```json
{
  "success": true,
  "message": "Next sync time determined",
  "responseObject": {
    "nextSync": "2024-10-17T12:00:00.000Z"
  },
  "statusCode": 200
}
```

## 🚦 Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "A descriptive error message",
  "responseObject": null,
  "statusCode": 400
}
```
