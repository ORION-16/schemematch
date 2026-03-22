# SchemeMatch

SchemeMatch is a fast, responsive, and seamless platform that helps Indian citizens discover state and central government welfare schemes they qualify for.

## Features
- **Dynamic Quiz Interface:** Step-by-step form with beautiful UI components to collect user demographics.
- **Matching Engine:** Evaluates eligibility based on age, category, income, occupation, and extra traits.
- **Detailed Scheme Cards:** Shows what each scheme offers and precisely what documents are required.
- **Offline & Online Guidance:** Tells the user exactly where to go if an online application isn't available.
- **Secure & Private:** No login required. User data is saved locally on their device, not tracked on the server.

## Tech Stack
- **Frontend:** React + Vite, Tailwind CSS v4, Framer Motion
- **Backend:** Node.js, Express
- **Database:** MongoDB via Mongoose

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
npm install dotenv # (if needed)

# Create a .env file based on .env.example
cp .env.example .env

# Seed the database with the initial 25 schemes
node data/seedSchemes.js

# Start the server (runs on port 5001)
npm run dev
# or
node server.js
```

### 2. Frontend Setup
```bash
cd client
npm install

# Start the Vite development server
npm run dev
```

### Environment Setup
Create a `.env` in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

## Deployment (Recommended: Render.com)

This application is configured for a **Unified Deployment**, meaning both the React frontend and Node.js backend run on a single server instance. This is highly recommended for free hosting on platforms like **Render.com**.

### Steps to Deploy on Render
1. Push this repository to your GitHub account.
2. Sign up on [Render](https://render.com) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Use the following configuration:
   - **Environment:** `Node`
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
5. Click **Advanced** and add the following Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: (Your production MongoDB connection string from MongoDB Atlas)
6. Click **Create Web Service**.

> [!NOTE]
> **Why Render?** Unlike Vercel, Render supports long-running Node.js processes on their free tier, which is essential for our persistent Express server and Mongoose connection.

Render will automatically install all dependencies, build the React App, and start the unified server!

## Environment Variables
**Server (`server/.env`):**
- `PORT`: (default 5001)
- `MONGO_URI`: (default mongodb://localhost:27017/schemematch)
- `CLIENT_URL`: (default http://localhost:5173)

**Client (`client/.env`):**
- `VITE_API_URL`: (default http://localhost:5001)

## License
MIT
