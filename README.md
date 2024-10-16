# 🏈 Parkhub NFL Game Dashboard - Coding Challenge

[![Build CI](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-ci.yml)[![Backend Code Quality](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-code-quality.yml/badge.svg?branch=main)](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-code-quality.yml)
## 📋 Overview

This project implements a robust data layer for an NFL game dashboard, providing comprehensive game information synchronized with Ticketmaster's Discovery API. It consists of two primary services:

1. 🔄 Data Synchronization and Importing Service
2. 🚀 API for Retrieving Game Data

## 🌟 Key Features

- 🔥 RESTful API for efficient querying of NFL game data
- ⏰ Automated synchronization with Ticketmaster API (every 12 hours)
- 🐘 PostgreSQL database with Flyway migrations for version control
- 🐳 Dockerized development environment for consistent setup and testing
- 🚦 Comprehensive error handling and logging
- 🧪 Unit tests demonstrating system functionality

## 🗂️ Project Structure

```
.
├── backend/             # Node.js backend application
├── database/            # Database migrations and configuration
├── docs/                # Additional documentation
├── .github/             # GitHub Actions workflows
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # This file
```

## 🛠️ Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/edwinhern/nfl-game-dashboard.git
   cd nfl-game-dashboard
   ```

2. Set up environment variables:
   Copy the `.env.template` file in the `backend` directory to `.env` and populate it with the required values, including your Ticketmaster API key.

3. Start the application using Docker Compose:
   ```
   docker-compose up --build
   ```

This command initializes the PostgreSQL database, executes Flyway migrations, and launches the backend server.

## 🎮 API Usage

The system offers several endpoints for querying game data. Key examples include:

- 🏉 `GET /api/games`: Retrieve a list of games with optional filters
- 👥 `GET /api/games/teams`: Get all teams
- 🏟️ `GET /api/games/stadiums`: Get all stadiums
- 🔄 `GET /api/sync/testSync`: Manually trigger a sync with Ticketmaster API

For a comprehensive list of endpoints and their usage, please consult the [API documentation](docs/API.md).

## 👩‍💻 Development

To run the backend in development mode with hot reloading:

```
cd backend
pnpm install
pnpm run dev
```

## 🧪 Testing

Execute the unit tests to verify system functionality:

```
cd backend
pnpm test
```

## 🔄 Data Synchronization

The system automatically synchronizes with Ticketmaster every 12 hours. This process ensures that:

- New games are added to the database
- Existing game information is updated
- Game statuses are kept current

For manual synchronization, use the `/api/sync/testSync` endpoint.

## 📊 Data Modeling

Our database schema includes tables for:

- Games
- Teams
- Stadiums
- Ticket Vendors

Relationships between these entities are carefully managed to maintain data integrity and enable efficient querying.

## 🔐 Error Handling and Logging

The system implements robust error handling and logging mechanisms to ensure:

- Detailed error messages for debugging
- Consistent error responses in the API
- Comprehensive logging of system activities and issues

## 🚀 Potential Improvements

1. Implement caching for frequently accessed data
2. Add rate limiting to protect the API
3. Expand test coverage for edge cases
4. Implement a more granular permissions system

## 📚 Documentation

For more detailed information about the system components, please refer to:

- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Backend Architecture](docs/BACKEND.md)

This project aims to provide a scalable, maintainable solution for managing NFL game data, with a focus on code quality, performance, and user experience.