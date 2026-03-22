# 🇮🇳 SchemeMatch — Welfare Discovery Made Simple

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

**SchemeMatch** is a premium, full-stack platform designed to help Indian citizens discover government welfare schemes they qualify for in seconds. By answering a few simple questions, users get a personalized list of state and central benefits tailored to their unique profile.

---

## 🚀 [LIVE DEMO](https://schemematch.onrender.com)
*(Note: Replace this with your actual Render URL once deployment is finished)*

---

## ✨ Key Features

- 🌍 **Multilingual Support:** Available in **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- 🎯 **Smart Matching Engine:** Instantly evaluates eligibility based on age, occupation, income, and category.
- 📱 **Premium UI/UX:** A smooth, interactive quiz interface built with **Framer Motion** for cinematic transitions.
- 📄 **Detailed Guidance:** Provides document checklists and "How to Apply" steps for every scheme.
- 🖨️ **Printable Results:** One-click printing for offline reference.
- 🔒 **Privacy First:** No login required. Your data stays in your browser's local storage.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4 (Modern Design Tokens)
- **Animations:** Framer Motion (Glassmorphism & Micro-interactions)
- **Internationalization:** i18next

### Backend
- **Server:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Security:** Helmet.js, Express-Rate-Limit

---

## 📸 Screenshots

| Landing Page | Smart Quiz | Eligibility Results |
| :--- | :--- | :--- |
| ![Landing Placeholder](https://via.placeholder.com/800x450?text=SchemeMatch+Landing+Page) | ![Quiz Placeholder](https://via.placeholder.com/800x450?text=Interactive+Quiz+Flow) | ![Results Placeholder](https://via.placeholder.com/800x450?text=Personalized+Scheme+List) |

---

## 💻 Local Setup

### 1. Unified Setup (Recommended)
You can set up everything from the root directory:
```bash
# Install all dependencies
npm run install-all

# Seed the database
npm run seed --prefix server

# Build the frontend
npm run build

# Start the app
npm start
```

### 2. Manual Setup
If you prefer running them separately:

**Backend:**
```bash
cd server
npm install
node data/seedSchemes.js
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file in the `server` directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/schemematch
NODE_ENV=development
```

---

## 🚢 Deployment (Render.com)

This project is optimized for **Render**'s free tier using a unified build process.

1.  Connect your GitHub repo to a **New Web Service**.
2.  **Build Command:** `npm run install-all && npm run build`
3.  **Start Command:** `npm start`
4.  **Env Vars:** Set `NODE_ENV` to `production` and add your `MONGO_URI`.
5.  **Whitelist IP:** Ensure `0.0.0.0/0` is whitelisted in your MongoDB Atlas settings.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Developed with ❤️ for a better India.**

