# 🏈 Parkhub NFL Game Dashboard - Coding Challenge

[![Build CI](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-ci.yml)[![Backend Code Quality](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-code-quality.yml/badge.svg?branch=main)](https://github.com/edwinhern/nfl-game-dashboard/actions/workflows/backend-code-quality.yml)

A robust backend system providing NFL game information synchronized with Ticketmaster's Discovery API.

## 📋 Overview

The NFL Game Dashboard is a robust backend system that provides comprehensive game information synchronized with Ticketmaster's Discovery API. It offers a RESTful API for querying NFL game data and manages automated synchronization with external ticketing services.

## 🎥 Project Demo

To see an example of the project in action, you can view the demo video:
[View Project Demo](https://photos.onedrive.com/share/814EB5940A8CC8AF!149046?cid=814EB5940A8CC8AF&resId=814EB5940A8CC8AF!149046&authkey=!AGSJl13Mt-p0s1Q&ithint=video&e=9kS8H1)

## 🌟 Key Features

- 🚀 RESTful API for efficient querying of NFL game data
- 🔄 Automated synchronization with Ticketmaster API (every 12 hours)
- 🔍 Flexible filtering options for game queries
- 🐘 Scalable database architecture using PostgreSQL and Kysely ORM
- ⏰ Scheduled tasks for data updates using node-cron
- 🚦 Comprehensive error handling and logging
- 🐳 Dockerized development environment for consistent setup and testing

## 🛠️ Technology Stack

- 🟢 **Node.js** (v22.9.0): JavaScript runtime
- 🔷 **TypeScript**: Typed superset of JavaScript
- 🚂 **Express**: Web application framework
- 🐘 **PostgreSQL**: Relational database
- 🔑 **Kysely**: Type-safe SQL query builder
- 🦋 **Flyway**: Database migration tool
- ⏲️ **node-cron**: Task scheduler for periodic data synchronization
- 📝 **Winston**: Logging library
- 🧪 **Vitest**: Testing framework
- 🐳 **Docker**: Containerization for consistent environments

## 🚀 Getting Started

### Prerequisites

- 🐳 Docker and Docker Compose

## 🛠️ Setup Instructions

1. 📥 Clone the repository:

   ```
   git clone https://github.com/edwinhern/nfl-game-dashboard.git
   cd nfl-game-dashboard
   ```

2. 🔑 Set up environment variables:

   - Copy `.env.template` to `.env`
   - Update `.env` with necessary values, including your Ticketmaster API key

3. 🚀 Start the application using Docker Compose:

   - This command initializes the PostgreSQL database, executes Flyway migrations, and launches the backend server.

   ```
   docker-compose up --build
   ```

### 🖥️ Running Without Docker

If you prefer to run the project without Docker:

1. 🐘 Ensure you have a PostgreSQL instance running and accessible
2. 🔗 Update the `DATABASE_URL` in `.env` to point to your PostgreSQL instance
3. 📂 Navigate to the backend directory: `cd backend`
4. 📦 Install dependencies: `pnpm install`
5. 🏃‍♂️ Run the development server: `pnpm run dev`

## 🎮 API Usage

The system offers several endpoints for querying game data. Key examples include:

- 🏉 `GET /api/games`: Retrieve a list of games with optional filters
- 👥 `GET /api/games/teams`: Get all teams
- 🏟️ `GET /api/games/stadiums`: Get all stadiums
- 🔄 `GET /api/sync/testSync`: Manually trigger a sync with Ticketmaster API

For a comprehensive list of endpoints and their usage, please consult the [API documentation](docs/API.md).

## 👩‍💻 Development

For more information on the backend development, see the [Backend documentation](docs/BACKEND.md).

For more information on api endpoint response format, see the [API documentation](docs/API.md).

## 🗄️ Database

The project uses PostgreSQL with Flyway for database migrations. Key details:

- 📊 Database name: `nfldb`
- 👤 Default username: `postgres`
- 🔑 Default password: `postgres`

For more information on the database schema and management, see the [Database documentation](docs/DATABASE.md).

## 🔄 Data Synchronization

The system automatically synchronizes with Ticketmaster every 12 hours. This process ensures that:

- 🆕 New games are added to the database
- 🔄 Existing game information is updated
- 🚦 Game statuses are kept current

For manual synchronization, use the `/api/sync/testSync` endpoint.

## 🚀 Potential Improvements

1. 🚀 Implement caching for frequently accessed data
2. 🛑 Add rate limiting to protect the API
3. 🧪 Expand test coverage for edge cases
4. 🔐 Implement auth permissions system
5. 🔍 Add parameter validation for `api/games/` requests
6. 📄 Implement pagination for `api/games/` endpoint

## 📚 Additional Documentation

For more detailed information about the system components, please refer to:

- 📘 [API Documentation](docs/API.md)
- 📘 [API Curls Documentation](docs/API_CURLS.md)
- 🗄️ [Database Schema](docs/DATABASE.md)
- 🏗️ [Backend Architecture](docs/BACKEND.md)
