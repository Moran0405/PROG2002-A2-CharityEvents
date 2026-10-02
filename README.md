# PROG2002 - Assignment 2: Charity Events Dynamic Website

A dynamic website for managing and promoting local charity events, built for the
PROG2002 Web Development II Assignment 2 case study.

The website allows the public to browse upcoming charity events, search for events
by date / location / category, and view full event details including ticket
information and fundraising goal progress.

## Tech Stack

- **Backend:** Node.js + ExpressJS (RESTful API)
- **Database:** MySQL (`charityevents_db`)
- **Frontend:** HTML, CSS, JavaScript (DOM, Fetch API, Promises)

## Project Structure

```
PROG2002-A2/
├── api/                  # Express RESTful API (server-side)
│   ├── event_db.js       # MySQL database connection module
│   ├── server.js         # Express server + API endpoints
│   └── package.json
├── clientside/           # Client-side website (static)
│   ├── index.html        # Home page
│   ├── search.html       # Search events page
│   ├── event-detail.html # Event details page
│   ├── css/style.css
│   └── js/               # Client-side JavaScript
└── database/
    └── charityevents_db.sql  # Database schema + sample data export
```

## Setup Instructions

### 1. Set up the database

1. Open **MySQL Workbench** (or any MySQL client).
2. Import the SQL file: `database/charityevents_db.sql`
   (File > Open SQL Script > Run, or use the command line:
   `mysql -u root -p < database/charityevents_db.sql`).
3. This creates the `charityevents_db` database with all tables and sample data.

### 2. Configure the database connection

Open `api/event_db.js` and update the `user` and `password` fields to match your
local MySQL installation.

### 3. Install dependencies and start the API server

```bash
cd api
npm install
npm start
```

The server runs at **http://localhost:3000**.

### 4. Open the website

Open your browser and visit: **http://localhost:3000**

(The Express server also serves the `clientside` folder, so no extra web server is
required. Alternatively the client pages can be opened with any static file server
such as VS Code Live Server.)

## RESTful API Endpoints

| Method | Endpoint              | Description                                        |
|--------|-----------------------|----------------------------------------------------|
| GET    | `/api/events`         | All active, upcoming charity events (home page)    |
| GET    | `/api/categories`     | All event categories (search page filter dropdown) |
| GET    | `/api/events/search`  | Search events by date, location and/or category    |
| GET    | `/api/events/:id`     | Full details of a single event (event detail page) |

## Author

- Student: Moran0405
- Unit: PROG2002 Web Development II - Assignment 2
