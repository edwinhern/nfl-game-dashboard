/*
 * Name: Update Game Table
 * Author: Edwin Hernandez
 * Description: Modifies price columns in games table to handle cent values
 * Example: 12.99
 * Branch: feat-connect-ticketmaster-api
 */

ALTER TABLE games
ADD COLUMN min_price_decimal DECIMAL(10,2),
ADD COLUMN max_price_decimal DECIMAL(10,2);

UPDATE games
SET min_price_decimal = min_price::DECIMAL(10,2),
    max_price_decimal = max_price::DECIMAL(10,2);

ALTER TABLE games
DROP COLUMN min_price,
DROP COLUMN max_price;

ALTER TABLE games
RENAME COLUMN min_price_decimal TO min_price;
ALTER TABLE games
RENAME COLUMN max_price_decimal TO max_price;