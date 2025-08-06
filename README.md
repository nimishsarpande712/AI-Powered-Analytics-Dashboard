# AI-Powered Analytics Dashboard
Live demo link : - https://ai-powered-analytics-dashboard-1-ulx7.onrender.com/
## ADmyBRAND Insights - Full-Stack Analytics Dashboard

ADmyBRAND Insights is a modern, full-stack analytics dashboard designed for marketing professionals. It provides a visually stunning and highly interactive interface to analyze customer marketing data, track key performance indicators, and derive actionable insights. The application features a Node.js/Express backend powered by a MySQL database and a dynamic React frontend built with Chakra UI and animated with Anime.js.

## ✨ Features

- **Interactive Dashboard**: A central hub displaying key metrics, data visualizations, and an advanced data table.
- **Key Performance Indicators**: At-a-glance metric cards showing aggregated stats like Average Customer Income, Total Wine Sales, and Campaign Conversion Rate.
- **Advanced Data Visualizations**: Interactive charts powered by recharts to visualize trends and distributions in the data.
- **Server-Side Data Table**: A powerful, custom-built data table with server-side sorting, pagination, and filtering to handle large datasets with high performance.
- **Advanced Filtering**: Filter data by customer ID, education level, marital status, and a specific date range (Dt_Customer).
- **Premium UI/UX**: A beautiful and responsive interface built with Chakra UI, featuring a dark/light mode toggle and enhanced with subtle, professional animations from Anime.js and React-Bits.
- **CSV Export**: Export the currently filtered data from the table into a downloadable CSV file.

## 🛠️ Tech Stack

| Category | Technology |
| -------- | ---------- |
| Frontend | React, Chakra UI, Anime.js, React-Bits, Recharts, Axios |
| Backend | Node.js, Express.js, Sequelize (ORM) |
| Database | MySQL |
| Dev Tools | Nodemon (for backend auto-reload), CORS, Dotenv (for environment variables) |

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Node.js (v14 or later)
- npm
- A running MySQL server

### 1. Backend Setup

First, set up the server which will connect to your database and serve the API.

```bash
# 1. Clone the repository
git clone https://github.com/nimishsarpande712/AI-Powered-Analytics-Dashboard.git
cd AI-Powered-Analytics-Dashboard/Backend

# 2. Install backend dependencies
npm install

# 3. Set up environment variables
# Create a .env file in the Backend root and add your database credentials:
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=analytics_db

# 4. Seed the database
# This script will populate your 'analytics_db' with data from the marketing_campaign.csv file.
npm run seed

# 5. Start the backend server
# The server will run on http://localhost:5000
npm start
```

### 2. Frontend Setup

Next, set up the React client which will consume the API.

```bash
# 1. Navigate to the frontend directory
cd ../Frontend/analytics-dashboard

# 2. Install frontend dependencies
npm install

# 3. Set up environment variables
# Create a .env file in the frontend/analytics-dashboard directory and add the API URL:
REACT_APP_API_URL=http://localhost:5000/api

# 4. Start the frontend development server
# The React app will open and run on http://localhost:3000
npm start
```

Once both servers are running, open your browser to http://localhost:3000 to see the application in action.

## 🌐 API Endpoints

The backend server provides the following REST API endpoints:

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /api/health | Health check endpoint to verify if the API is running. |
| GET | /api/campaigns | Fetches all marketing campaigns data. |
| POST | /api/campaigns | Creates a new marketing campaign. |
| PUT | /api/campaigns/:id | Updates an existing marketing campaign. |
| DELETE | /api/campaigns/:id | Deletes a marketing campaign. |
| GET | /api/marketing-data | Fetches paginated, sorted, and filtered customer marketing data. |
| GET | /api/dashboard-analytics | Fetches consolidated data for the dashboard. |
| GET | /api/data | Fetches general data for analytics purposes. |
