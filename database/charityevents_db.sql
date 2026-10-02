-- ============================================================
-- PROG2002 Assignment 2 - Charity Events Website
-- Database: charityevents_db
-- Schema + sample data (MySQL 8.x)
-- ============================================================

DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- ------------------------------------------------------------
-- Table: organisations
-- Stores the charitable organisations that host events.
-- ------------------------------------------------------------
CREATE TABLE organisations (
    organisation_id   INT AUTO_INCREMENT PRIMARY KEY,
    org_name          VARCHAR(150) NOT NULL,
    org_description   TEXT,
    contact_email     VARCHAR(120),
    contact_phone     VARCHAR(30),
    website           VARCHAR(200)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Table: categories
-- Stores event categories (e.g. Fun Run, Gala Dinner).
-- ------------------------------------------------------------
CREATE TABLE categories (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(80) NOT NULL UNIQUE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Table: events
-- Stores the charity events.
-- event_status: 'active' = visible, 'suspended' = hidden (policy violation)
-- ------------------------------------------------------------
CREATE TABLE events (
    event_id         INT AUTO_INCREMENT PRIMARY KEY,
    event_name       VARCHAR(200) NOT NULL,
    event_date       DATE NOT NULL,
    event_time       TIME,
    location_venue   VARCHAR(150),
    location_city    VARCHAR(80),
    event_description TEXT,
    purpose          TEXT,
    ticket_price     DECIMAL(8, 2) DEFAULT 0.00,
    goal_amount      DECIMAL(12, 2) DEFAULT 0.00,
    progress_amount  DECIMAL(12, 2) DEFAULT 0.00,
    event_status     ENUM('active', 'suspended') DEFAULT 'active',
    organisation_id  INT,
    category_id      INT,
    FOREIGN KEY (organisation_id) REFERENCES organisations (organisation_id),
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Sample data: organisations
-- ------------------------------------------------------------
INSERT INTO organisations (org_name, org_description, contact_email, contact_phone, website) VALUES
('Hope Community Charity', 'Hope Community Charity is a non-profit organisation dedicated to supporting disadvantaged families, homeless youth and local community health programs across the city. Every dollar raised goes directly to the people who need it most.', 'info@hopecommunity.org.au', '(02) 9123 4567', 'https://www.hopecommunity.org.au'),
('Bright Futures Foundation', 'Bright Futures Foundation funds education and mentoring programs for children in need.', 'contact@brightfutures.org.au', '(02) 9876 5432', 'https://www.brightfutures.org.au');

-- ------------------------------------------------------------
-- Sample data: categories
-- ------------------------------------------------------------
INSERT INTO categories (category_name) VALUES
('Fun Run'),
('Gala Dinner'),
('Silent Auction'),
('Concert'),
('Charity Walk'),
('Bake Sale'),
('Trivia Night'),
('Workshop');

-- ------------------------------------------------------------
-- Sample data: events (11 events: upcoming, past and suspended)
-- ------------------------------------------------------------
INSERT INTO events
(event_name, event_date, event_time, location_venue, location_city, event_description, purpose, ticket_price, goal_amount, progress_amount, event_status, organisation_id, category_id)
VALUES
('Sunset Charity Gala Dinner',
 '2026-10-18', '18:30:00', 'Grand Ballroom, Harbourview Hotel', 'Sydney',
 'An elegant three-course gala dinner with live music, guest speakers and a charity pledge ceremony overlooking the harbour.',
 'Raise funds for emergency accommodation for homeless youth.',
 120.00, 50000.00, 32500.00, 'active', 1, 2),

('City Fun Run 5K',
 '2026-10-25', '07:00:00', 'Centennial Parklands', 'Sydney',
 'A family-friendly 5 km fun run through Centennial Park. Every runner receives a medal and a race pack. Walkers are welcome too!',
 'Support local community health and wellbeing programs.',
 35.00, 20000.00, 8600.00, 'active', 1, 1),

('Voices of Hope Charity Concert',
 '2026-11-07', '19:00:00', 'Concert Hall, Sydney Opera House', 'Sydney',
 'An unforgettable night of live performances by local choirs and artists, all volunteering their talent for a good cause.',
 'Fund music therapy programs for children with disabilities.',
 65.00, 40000.00, 21000.00, 'active', 1, 4),

('Autumn Silent Auction',
 '2026-11-15', '12:00:00', 'Riverside Art Gallery', 'Sydney',
 'Bid on artwork, weekend getaways and exclusive experiences donated by local businesses. All proceeds go to charity.',
 'Raise funds for food relief programs for disadvantaged families.',
 25.00, 30000.00, 12400.00, 'active', 1, 3),

('Festive Bake Sale',
 '2026-12-05', '09:00:00', 'Town Hall Square', 'Sydney',
 'Sweet treats, festive cakes and pastries baked and donated by volunteers and local bakeries. Free entry for everyone.',
 'Support Christmas hampers for families in need.',
 0.00, 8000.00, 3100.00, 'active', 1, 6),

('New Year Charity Trivia Night',
 '2027-01-16', '19:30:00', 'The Star Room', 'Sydney',
 'Gather your friends and test your knowledge across eight rounds of trivia. Prizes for the winning table and raffle draws all night.',
 'Fund school supplies and mentoring for children in need.',
 20.00, 15000.00, 5200.00, 'active', 2, 7),

('Coastal Charity Walk 10km',
 '2027-02-14', '08:00:00', 'Bondi to Coogee Coastal Path', 'Sydney',
 'Enjoy one of the most beautiful coastal walks in the world while raising money for mental health support services.',
 'Support free counselling and mental health services.',
 0.00, 25000.00, 7800.00, 'active', 1, 5),

('Spring Garden Workshop',
 '2027-03-06', '10:00:00', 'Botanic Garden Pavilion', 'Sydney',
 'A hands-on sustainable gardening workshop led by expert horticulturists. Tools and morning tea provided.',
 'Fund community gardens and urban green spaces.',
 45.00, 12000.00, 3400.00, 'active', 2, 8),

('Winter Warmer Fun Run',
 '2026-08-16', '07:30:00', 'Bicentennial Park', 'Sydney',
 'A chilly but cheerful 10 km run to warm up the winter. Hot drinks and breakfast rolls for all finishers.',
 'Raise funds for blankets and winter essentials for the homeless.',
 30.00, 18000.00, 18000.00, 'active', 1, 1),

('Community Trivia Afternoon',
 '2026-09-12', '14:00:00', 'Newtown Community Centre', 'Sydney',
 'A relaxed afternoon of trivia, friendship and fundraising for local seniors programs.',
 'Support social programs for isolated seniors.',
 15.00, 6000.00, 6000.00, 'active', 2, 7),

('Midnight Charity Auction (Suspended)',
 '2026-11-20', '20:00:00', 'Harbourview Hotel', 'Sydney',
 'A late-night auction event (currently suspended pending policy review).',
 'Fundraising for youth scholarships.',
 40.00, 20000.00, 1500.00, 'suspended', 2, 3);
