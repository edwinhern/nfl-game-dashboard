# 🗄️ Database Documentation

## 📊 Overview

This document outlines the database structure and management for the NFL Game Ticket System. We use PostgreSQL as our relational database management system, with Flyway for version-controlled database migrations. The database schema is designed to store comprehensive information about NFL games, teams, stadiums, and ticket vendors.

## 🛠️ Technology Stack

- **PostgreSQL 13**: Our primary database system
- **Flyway**: For managing database migrations
- **Docker**: For containerization and consistent environments

## 📋 Database Schema

The database consists of the following main tables:

- `ticket_vendors`: Stores information about ticket selling platforms
- `stadiums`: Contains details about NFL stadiums, including geographical data
- `teams`: Stores NFL team information
- `games`: Holds data for individual NFL games
- `game_teams`: A junction table linking games to participating teams

Key features of the schema:

- Use of UUIDs as primary keys for enhanced security and scalability
- Enumerated type `game_status` for precise game state management
- Comprehensive stadium and team data, including geographical information
- Flexible game schema supporting various ticket sale states and price ranges

## 🔄 Migration Strategy

We use Flyway for database migrations, following these conventions:

1. Migration files are named: `YYYYMMDDHHMMSS__description.sql`
2. Migrations are version-controlled alongside the application code
3. Both schema changes and data migrations are managed through Flyway

Example migration files:
- `20241010174001__create_initial_schema.sql`: Creates the initial database schema
- `20241010174036__seed_initial_data.sql`: Seeds the database with initial data

## 🔐 Data Integrity

We maintain data integrity through:

1. Foreign key constraints to ensure referential integrity
2. NOT NULL constraints on essential fields
3. UNIQUE constraints where applicable (e.g., `games.event_id`)
4. Check constraints for enum-like fields (e.g., `games.status`)

## 🔄 Synchronization Support

The schema is designed to support efficient synchronization with Ticketmaster:

1. The `event_id` field in the `games` table corresponds to Ticketmaster's event ID
2. The `updated_at` timestamp allows for tracking of last-updated times

## 🚀 Scalability Considerations

As the dataset grows, consider:

1. Partitioning the `games` table by date range
2. Implementing a caching layer for frequently accessed data

## 🐳 Docker Configuration

The `Dockerfile` sets up a PostgreSQL 13 instance with the following default configurations:

- Database name: `nfldb`
- Username: `postgres`
- Password: `postgres`

## 🛠️ Flyway Configuration

The `flyway.conf` file contains the Flyway settings:

- Uses the filesystem for migration scripts
- Configures migration naming conventions
- Enables baseline on migrate and disables clean for safety

## 📝 Usage Examples

### Connecting to the Database

Connect to the database using any PostgreSQL client with these credentials:

- Host: `localhost` (or your Docker host IP)
- Port: `5432` (default PostgreSQL port)
- Database: `nfldb`
- Username: `postgres`
- Password: `postgres`

### Running a Query

Example queries:

```sql
-- Get all games with their teams
SELECT g.name AS game_name, t.name AS team_name
FROM games g
JOIN game_teams gt ON g.id = gt.game_id
JOIN teams t ON gt.team_id = t.id;

-- Get all stadiums in a specific state
SELECT name, city
FROM stadiums
WHERE state = 'FL';
```

## 🤝 Contributing

To add a new migration:

1. Create a new SQL file in the `migrations/` directory
2. Name it using the format: `YYYYMMDDHHMMSS__descriptive_name.sql`
3. Write your SQL statements in the file
4. Run Flyway migrate to apply the new migration

### Generate Timestamp for Migration Files (MacOS)

Use this script to generate the timestamp prefix for new migration files.

```bash
date +%Y%m%d%H%M%S
```