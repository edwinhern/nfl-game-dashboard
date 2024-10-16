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
[
  {
    "id": "uuid",
    "name": "Tampa Bay Buccaneers vs. San Francisco 49ers",
    "start_date": "2024-11-10T18:00:00Z",
    "end_date": "2024-11-10T22:00:00Z",
    "status": "onsale",
    "min_price": 50.00,
    "max_price": 500.00,
    "team_names": ["Tampa Bay Buccaneers", "San Francisco 49ers"]
  }
]
```

### 👥 GET /api/games/teams

Retrieves a list of all teams in the system.

#### Response:
```json
[
  {
    "id": "uuid",
    "name": "Tampa Bay Buccaneers",
    "city": "Tampa",
    "state": "FL",
    "country": "US"
  }
]
```

### 🏟️ GET /api/games/stadiums

Retrieves a list of all stadiums in the system.

#### Response:
```json
[
  {
    "id": "uuid",
    "name": "Raymond James Stadium",
    "city": "Tampa",
    "state": "FL",
    "country": "US",
    "zipcode": "33607",
    "address": "4201 North Dale Mabry Highway",
    "timezone": "America/New_York",
    "lon": -82.503474,
    "lat": 27.975976
  }
]
```

## 🔄 Synchronization Endpoints

### GET /api/sync/testSync

Manually triggers a synchronization with the Ticketmaster API.

#### Response:
```json
{
  "status": "Manual sync completed",
  "gamesAdded": 5,
  "gamesUpdated": 10
}
```

### ⏰ GET /api/sync/nextSync

Retrieves the scheduled time for the next automatic synchronization.

#### Response:
```json
{
  "nextSync": "2024-10-16T18:00:00Z"
}
```

## 🚦 Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "A descriptive error message"
  }
}
```

Common error codes include:
- `INVALID_PARAMETER`: When a query parameter is invalid or missing
- `NOT_FOUND`: When a requested resource is not found
- `INTERNAL_ERROR`: For unexpected server errors

## 🔐 Authentication

Currently, this API does not require authentication. However, rate limiting is applied to prevent abuse.

## 📊 Pagination

For endpoints that may return large datasets (e.g., `/api/games`), pagination is supported using the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 20, max: 100)

The response will include metadata about the pagination:

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100
  }
}
```