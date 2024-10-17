# NFL Game Ticket System Backend

## 📋 Overview

This project is a robust backend system for an NFL Game Ticket System. It provides APIs for game data retrieval and manages synchronization with external ticketing services. Built with Node.js and TypeScript, it offers a scalable and maintainable solution for handling NFL game ticket information.

## 🌟 Main Features

- RESTful API for querying NFL game data
- Automated synchronization with Ticketmaster API
- Flexible filtering options for game queries
- Scalable database architecture using Kysely ORM
- Scheduled tasks for data updates using node-cron
- Comprehensive error handling and logging
- Containerized deployment using Docker

## 🛠️ Technology Stack

- **Node.js** (v22.9.0): JavaScript runtime
- **TypeScript**: Typed superset of JavaScript
- **Express**: Web application framework
- **Kysely**: Type-safe SQL query builder
- **PostgreSQL**: Relational database
- **node-cron**: Task scheduler for periodic data synchronization
- **Winston**: Logging library
- **Vitest**: Testing framework
- **Docker**: Containerization for consistent environments

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.9.0)
- pnpm (Package manager) (https://pnpm.io/installation)

### Setup Instructions

#### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone https://github.com/edwinhern/nfl-game-dashboard.git`
- Navigate: `cd express-typescript-2024`
- Install dependencies: `pnpm i`

#### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

#### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `pnpm run dev`
- Building: `pnpm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `pnpm run build && pnpm run start`

## 🧪 Testing

The project uses Vitest for unit and integration testing. Test files are located alongside the source files with a `.test.ts` extension.

## 📈 Logging

Winston is used for logging. Logs are output to the console and can be configured for additional transports as needed.
