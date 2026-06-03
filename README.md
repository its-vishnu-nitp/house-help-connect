# 🏠 House Help Connect

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📌 Overview

**House Help Connect** is a full-stack web application that connects **house owners** with **house helps** (maids, cooks, drivers, babysitters, etc.) based on location, category, and availability.

The project is designed as a **resume-ready MERN stack application** that follows clean architecture, RESTful API practices, and scalable backend structure.

---

# 🚀 Live Features

- 🔐 JWT Authentication
- 👥 Role-based Access (Owner / House Help)
- 🛡️ Protected Routes
- 🧑‍💼 Profile Creation & Management
- 🔎 Search by Category & Location
- ⚡ Modern UI using Tailwind CSS
- 🌐 RESTful API Architecture

---

# 📌 Problem Statement

Finding reliable house help is difficult for house owners, while house helps struggle to find nearby and trustworthy work opportunities.

There is no simple centralized platform that efficiently connects both parties locally.

---

# 💡 Solution

House Help Connect provides a marketplace platform where:

- House Helps can create profiles with skills, rates, and availability.
- House Owners can search and connect with suitable workers nearby.
- Both users get secure role-based access and personalized dashboards.

---

# 🚀 Version 1 (Current MVP)

## 🔑 Features Included

- 🔐 JWT Authentication & Authorization
- 👥 Role-Based Access (House Owner / House Help)
- 🛡️ Protected Routes
- 🧑‍💼 Profile Creation & Management
- 🔎 Search by Category & Location
- ⚡ Modern Responsive UI
- 🌐 RESTful API Architecture
- 🔒 Password Hashing using bcrypt.js

---
# ✨ Planned Features (Version 2)

- 💬 Real-time Chat using Socket.io
- ⭐ Ratings & Reviews
- 🪪 Aadhaar Verification Badge
- 💳 Online Payment Integration
- 📅 Booking Management
- 🛠️ Admin Dashboard

---

# 👤 User Roles

## 1️⃣ House Owner

- Search house helps
- View profiles
- Contact workers

## 2️⃣ House Help

- Create profile
- Manage availability
- Receive work requests

## 3️⃣ Admin *(Future Scope)*

- User moderation
- Verification management
- Platform monitoring

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt.js |
| Tools | Git, GitHub, VS Code, Postman |

---

# 🧱 Project Structure

```text
house-help-connect/
│
├── BACKEND/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── profileController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── HelperProfile.js
│   │   └── EmployerProfile.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── profileRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── FRONTEND/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── AuthHeader.jsx
    │   │
    │   ├── layouts/
    │   │   ├── AuthLayout.jsx
    │   │   └── PublicLayout.jsx
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Profile.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── utils/
    │   │   ├── auth.js
    │   │   └── api.js
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

# 🗄️ Database Design

The project follows a **Base User + Linked Profiles** architecture.

## Users Collection

Stores:
- Email
- Password
- Role
- Authentication details

## HelperProfiles Collection

Stores:
- Skills
- Rates
- Availability
- Work category
- Bio
- Location

## EmployerProfiles Collection

Stores:
- Family size
- Address
- Requirements

---

# 🔐 Authentication Flow

```text
User Registers/Login
        ↓
JWT Token Generated
        ↓
Token Stored on Client
        ↓
Protected Routes Verified
        ↓
Access Based on User Role
```

---

# ⚙️ How to Run Locally

## 📋 Prerequisites

Make sure you have installed:

- Node.js
- MongoDB
- Git

---

# 1️⃣ Clone Repository

```bash
git clone https://github.com/its-vishnu-nitp/house-help-connect.git
```

---

# 2️⃣ Backend Setup

## Navigate to Backend

```bash
cd house-help-connect/BACKEND
```

## Install Dependencies

```bash
npm install
```

## Create `.env` File

Create a `.env` file inside BACKEND folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Run Backend Server

```bash
npm run dev
```

Backend server runs on:

```text
http://localhost:5000
```

---

# 3️⃣ Frontend Setup

## Navigate to Frontend

```bash
cd ../FRONTEND
```

## Install Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 📡 API Endpoints (Sample)

## Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

## Profile Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile |
| POST | `/api/profile/create` | Create profile |
| PUT | `/api/profile/update` | Update profile |

---

# 📈 Future Improvements

- 📱 Fully Responsive Mobile UI
- 🌍 Location-based Recommendations
- 💬 Real-time Notifications
- ⭐ Reviews & Ratings
- 📅 Booking System
- 🧾 Payment Tracking

---

# 🤝 Contributing

Contributions are welcome.

## Steps to Contribute

1. Fork the project
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open Pull Request

---
# ⭐ Support

If you like this project, give it a ⭐ on GitHub.