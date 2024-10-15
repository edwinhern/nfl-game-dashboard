/*
 * Name: Create Initial Schema
 * Author: Edwin Hernandez
 * Description: Creates tables for NFL ticket system
 * Branch: feat-backend-setup
 */
 
CREATE TABLE ticket_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE stadiums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    timezone VARCHAR(20) NOT NULL,
    lon DECIMAL(10, 6) NOT NULL,
    lat DECIMAL(10, 6) NOT NULL
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

CREATE TYPE game_status AS ENUM ('onsale', 'presale', 'active', 'inactive', 'cancelled', 'rescheduled', 'offsale');

CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    stadium_id UUID REFERENCES stadiums(id) NOT NULL,
    ticket_vendor_id UUID REFERENCES ticket_vendors(id) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    presale_date TIMESTAMP,
    onsale_date TIMESTAMP,
    offsale_date TIMESTAMP,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    status game_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_teams (
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, team_id)
);