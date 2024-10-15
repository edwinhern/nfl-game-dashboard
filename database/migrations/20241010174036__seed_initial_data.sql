/*
 * Name: Seed Initial Data
 * Author: Edwin Hernandez
 * Description: Inserts sample data into NFL database
 * Branch: feat-backend-setup
 */

INSERT INTO ticket_vendors (name)
VALUES ('Ticketmaster');

INSERT INTO stadiums (name, city, state, country, zipcode, address, timezone, lon, lat)
VALUES
('Raymond James Stadium', 'Tampa', 'FL', 'US', '33607', '4201 North Dale Mabry Highway', 'America/New_York', -82.503474, 27.975976),
('Allegiant Stadium', 'Las Vegas', 'NV', 'USA', '89118', '3333 Al Davis Way', 'America/Los_Angeles', -115.1833, 36.0909),
('GEHA Field at Arrowhead Stadium', 'Kansas City', 'MO', 'USA', '64129', '1 Arrowhead Dr', 'America/Chicago', -94.48417065, 39.04921048),
('Levis Stadium', 'Santa Clara', 'CA', 'USA', '95054', '4900 Marie P. DeBartolo Way', 'America/Los_Angeles', -121.97034311, 37.40367671),
('Lumen Field', 'Seattle', 'WA', 'USA', '98134', '800 Occidental Ave S', 'America/Los_Angeles', -122.331607, 47.595083),
('Lincoln Financial Field', 'Philadelphia', 'PA', 'USA', '19148', 'One Lincoln Financial Way', 'America/New_York', -75.167406, 39.900706),
('Mercedes-Benz Stadium', 'Atlanta', 'GA', 'USA', '30313', '1 AMB Drive NW', 'America/New_York', -84.400823, 33.755389),
('Highmark Stadium', 'Orchard Park', 'NY', 'USA', '14127', '1 Bills Drive', 'America/New_York', -78.786955, 42.773743),
('MetLife Stadium', 'East Rutherford', 'NJ', 'USA', '07073', 'One MetLife Stadium Drive', 'America/New_York', -74.074493, 40.81359),
('Acrisure Stadium', 'Pittsburgh', 'PA', 'USA', '15212', '100 Art Rooney Avenue', 'America/New_York', -80.015884, 40.446093),
('Soldier Field', 'Chicago', 'IL', 'USA', '60605', '1410 S. Museum Campus Drive', 'America/Chicago', -87.61682143, 41.86205404),
('Lambeau Field', 'Green Bay', 'WI', 'USA', '54304', '1265 Lombardi Avenue', 'America/Chicago', -88.0622376, 44.5012386),
('AT&T Stadium', 'Arlington', 'TX', 'USA', '76011', 'One AT&T Way', 'America/Chicago', -97.09345578, 32.74790427),
('Bank of America Stadium', 'Charlotte', 'NC', 'USA', '28202', '800 South Mint Street', 'America/New_York', -80.852829, 35.225789),
('U.S. Bank Stadium', 'Minneapolis', 'MN', 'USA', '55415', '401 Chicago Avenue', 'America/Chicago', -93.257528, 44.973617),
('Paycor Stadium', 'Cincinnati', 'OH', 'USA', '45202', 'One Paycor Stadium', 'America/New_York', -84.5161111, 39.0955556),
('Huntington Bank Field', 'Cleveland', 'OH', 'USA', '44114', '100 Alfred Lerner Way', 'America/New_York', -81.69956958, 41.50603554),
('SoFi Stadium', 'Inglewood', 'CA', 'USA', '90301', '1001 S. Stadium Dr', 'America/Los_Angeles', -118.343767, 33.950529),
('Lucas Oil Stadium', 'Indianapolis', 'IN', 'USA', '46225', '500 S. Capitol Ave.', 'America/New_York', -86.163821, 39.76007),
('EverBank Stadium', 'Jacksonville', 'FL', 'USA', '32202', '1 EverBank Stadium Drive', 'America/New_York', -81.637357, 30.323887),
('Empower Field At Mile High', 'Denver', 'CO', 'USA', '80204', '1701 Bryant St.', 'America/Denver', -105.020127, 39.743853),
('NRG Stadium', 'Houston', 'TX', 'USA', '77054', 'One NRG Park', 'America/Chicago', -95.410875, 29.684885),
('Hard Rock Stadium', 'Miami', 'FL', 'USA', '33056', '347 Don Shula Drive', 'America/New_York', -80.238866, 25.957928),
('Nissan Stadium', 'Nashville', 'TN', 'USA', '37213', 'One Titans Way', 'America/Chicago', -86.771413, 36.166208),
('Ford Field', 'Detroit', 'MI', 'USA', '48226', '2000 Brush St.', 'America/New_York', -83.045543, 42.339924),
('Caesars Superdome', 'New Orleans', 'LA', 'USA', '70112', '1500 Poydras St', 'America/Chicago', -90.081091, 29.950971),
('State Farm Stadium', 'Glendale', 'AZ', 'USA', '85305', '1 Cardinals Drive', 'America/Phoenix', -112.262258, 33.527308),
('M&T Bank Stadium', 'Baltimore', 'MD', 'USA', '21230', '1101 Russell St', 'America/New_York', -76.622653, 39.277932),
('Gillette Stadium', 'Foxborough', 'MA', 'USA', '02035', '1 Patriot Place', 'America/New_York', -71.264321, 42.090918),
('Northwest Stadium', 'Landover', 'MD', 'USA', '20785', '1600 FedEx Way', 'America/New_York', -76.864433, 38.907729);

INSERT INTO teams (name, city, state, country) 
VALUES
('Tampa Bay Buccaneers', 'Tampa', 'FL', 'US'),
('San Francisco 49ers', 'San Francisco', 'CA', 'US'),
('Kansas City Chiefs', 'Kansas City', 'MO', 'USA'),
('Pittsburgh Steelers', 'Pittsburgh', 'PA', 'USA'),
('Las Vegas Raiders', 'Las Vegas', 'NV', 'USA'),
('Buffalo Bills', 'Buffalo', 'NY', 'USA'),
('Green Bay Packers', 'Green Bay', 'WI', 'USA'),
('Denver Broncos', 'Denver', 'CO', 'USA'),
('Atlanta Falcons', 'Atlanta', 'GA', 'USA'),
('Philadelphia Eagles', 'Philadelphia', 'PA', 'USA'),
('Minnesota Vikings', 'Minneapolis', 'MN', 'USA'),
('Cincinnati Bengals', 'Cincinnati', 'OH', 'USA'),
('Carolina Panthers', 'Charlotte', 'NC', 'USA'),
('Houston Texans', 'Houston', 'TX', 'USA'),
('Miami Dolphins', 'Miami', 'FL', 'USA'),
('Los Angeles Chargers', 'Los Angeles', 'CA', 'USA'),
('Cleveland Browns', 'Cleveland', 'OH', 'USA'),
('Indianapolis Colts', 'Indianapolis', 'IN', 'USA'),
('New York Jets', 'East Rutherford', 'NJ', 'USA'),
('Jacksonville Jaguars', 'Jacksonville', 'FL', 'USA'),
('Baltimore Ravens', 'Baltimore', 'MD', 'USA'),
('Arizona Cardinals', 'Glendale', 'AZ', 'USA'),
('Tennessee Titans', 'Nashville', 'TN', 'USA'),
('New Orleans Saints', 'New Orleans', 'LA', 'USA'),
('Dallas Cowboys', 'Arlington', 'TX', 'USA'),
('Seattle Seahawks', 'Seattle', 'WA', 'USA'),
('Detroit Lions', 'Detroit', 'MI', 'USA'),
('Los Angeles Rams', 'Los Angeles', 'CA', 'USA'),
('New York Giants', 'East Rutherford', 'NJ', 'USA'),
('Chicago Bears', 'Chicago', 'IL', 'USA'),
('New England Patriots', 'Foxborough', 'MA', 'USA'),
('Washington Commanders', 'Landover', 'MD', 'USA');

INSERT INTO games (name, stadium_id, start_date, end_date, onsale_date, offsale_date, status, ticket_vendor_id)
VALUES 
('Tampa Bay Buccaneers vs. San Francisco 49ers', (SELECT id FROM stadiums WHERE name = 'Raymond James Stadium'), 
'2024-11-10T18:00:00Z', '2024-11-10T22:00:00Z', '2024-05-16T00:00:00Z', '2024-11-10T20:00:00Z', 'onsale', (SELECT id FROM ticket_vendors WHERE name = 'Ticketmaster'));

INSERT INTO game_teams (game_id, team_id)
VALUES 
((SELECT id FROM games), (SELECT id FROM teams WHERE name = 'Tampa Bay Buccaneers')),  -- Tampa Bay Buccaneers
((SELECT id FROM games), (SELECT id FROM teams WHERE name = 'San Francisco 49ers'));