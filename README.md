# 🏠 House Help Connect

## 📌 Overview

**House Help Connect** is a production-oriented marketplace web application connecting households with verified domestic workers and local service professionals (cleaning, cooking, plumbing, electrical work, babysitting, and elderly care).

Engineered as a modern full-stack MERN platform, it features persistent profile settings, end-to-end booking coordination, dynamic multi-skill categorization, and role-based access control.

# 🚀 Current Features

- 🔐 **Authentication & Security**: Secure JWT authentication, cookie/bearer validation, protected route gates, and bcrypt password hashing.
- 👥 **Role-Based Portals**: Dedicated dashboard views, action feeds, and management consoles tailored for **Clients** and **Workers**.
- 🛠️ **Multi-Skill Worker Settings**: Helpers can configure and persist multiple service tags, custom hourly rates, experience levels, and bios.
- 📱 **Interactive Profile Controls**: View-only and interactive modify modes in user settings with strict 10-digit phone number sanitation and MongoDB persistence.
- 🔎 **Discovery & Infinite Scroll**: Fast, paginated worker discovery filtered by city, rating, and service category using intersection observers.
- 👁️ **Worker Profile Previews**: Quick-glance modal overlays showing detailed worker credentials, hourly pricing, service tags, and bios before booking.
- 📅 **Direct Booking Workflow**: Instant service request modal linking verified workers to client booking management pipelines.
- 🌱 **Built-In Database Seeding**: Pre-configured seeder script generating fully populated, realistic worker accounts and profiles across major service hubs.

# 📌 Problem Statement

Finding dependable domestic assistance often relies on unverified word-of-mouth recommendations, irregular pricing, and fragmented scheduling. Simultaneously, independent domestic workers struggle to showcase multi-domain skills and manage local service requests systematically.

# 💡 Solution

House Help Connect delivers a centralized marketplace platform where:

- **Service Workers** manage multi-skill offerings, configure standard hourly rates, maintain bios, and receive booking requests.
- **Clients** discover verified professionals nearby, inspect transparent pricing and qualifications, and initiate service bookings directly.
- **Data Integrity** is preserved through strict schema validation, decoupled profile collections, and reliable persistent settings.

# 👤 User Roles

## 1️⃣ Client (Household / Employer)

- Search and discover workers via category chips and city filters.
- Preview detailed worker profiles in dedicated modal overlays.
- Initiate direct service bookings.
- Manage personal profile settings and location coordinates.

## 2️⃣ Worker (Service Provider)

- Toggle multi-skill categories (Deep Cleaning, Cooking, Plumbing, Electrician, Babysitting, etc.).
- Update hourly rates, years of experience, and professional bios.
- Maintain persistent public card details across page sessions.
- Review dispatch requests and incoming client bookings.

# 🛠️ Tech Stack

| **Layer** | **Technologies** |
| --- | --- |
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Tooling & Setup** | Seed automation, Postman, Git, GitHub, VS Code |

# 🧱 Project Structure

```text
house-help-connect/
│
├── BACKEND/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── paymentController.js
│   │   ├── profileController.js
│   │   └── reviewController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── EmployerProfile.js
│   │   ├── HelperProfile.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── profileRoutes.js
│   │   └── reviewRoutes.js
│   ├── seeder.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── FRONTEND/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── BookingModal.jsx
    │   │   │   ├── BookingsView.jsx
    │   │   │   ├── HomeFeed.jsx
    │   │   │   ├── ProfessionalsView.jsx
    │   │   │   ├── SettingsView.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── WorkerClientsView.jsx
    │   │   │   ├── WorkerHomeFeed.jsx
    │   │   │   ├── WorkerSidebar.jsx
    │   │   │   └── WorkerVerificationTab.jsx
    │   │   ├── AuthHeader.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── data/
    │   │   └── mockData.js
    │   ├── pages/
    │   │   ├── ClientDashboard.jsx
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── RoleSelection.jsx
    │   │   └── WorkerDashboard.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── auth.service.js
    │   │   ├── booking.service.js
    │   │   └── profile.service.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json

# 🗄️ Database Architecture

The data tier uses a normalized design separating user identities from role-specific metadata:

- **Users Collection**: Stores primary account credentials (`name`, `email`, `password`, `role`, `phoneNumber`, and nested `location.city`).
- **HelperProfiles Collection**: Stores worker metadata (`services` string array, legacy `serviceCategory`, `hourlyRate`, `experience`, `bio`, `rating`, `reviewsCount`, and `isAvailable`), indexed to User via `userId`.
- **EmployerProfiles Collection**: Stores client account metadata (`savedProfessionals` references, booking preferences, and bio).
- **Bookings Collection**: Manages contract lifecycles between clients and workers (`serviceDate`, `totalAmount`, `status`, and `paymentStatus`).

# ⚙️ Getting Started Locally

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/its-vishnu-nitp/house-help-connect.git
cd house-help-connect
```

## 2. Backend Configuration & Seeding

Navigate to the backend folder:

```bash
cd BACKEND
npm install
```

Create a `.env` file inside the `BACKEND` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/house-help-connect
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

Populate the database with pre-configured worker profiles:

```bash
npm run seed
```

Start the backend development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## 3. Frontend Configuration

Open a separate terminal window and navigate to the frontend folder:

```bash
cd FRONTEND
npm install
npm run dev
```

The frontend client runs on:

```text
http://localhost:5173
```

# 🧪 Seeded Demo Accounts

You can test the application immediately using the generated test accounts.

**Default Password for all seed accounts:** `Password@123`

| **Name** | **Role** | **Email** | **City** | **Assigned Services** |
| --- | --- | --- | --- | --- |
| **Sunita Sharma** | Worker | `sunita.sharma@example.com` | Mumbai | Deep Cleaning, Cooking |
| **Ramesh Verma** | Worker | `ramesh.verma@example.com` | Delhi | Plumbing, Electrician |
| **Pooja Devi** | Worker | `pooja.devi@example.com` | Mumbai | Babysitting, Elderly Care |
| **Anil Kumar** | Worker | `anil.kumar@example.com` | Patna | Carpentry, Deep Cleaning |

# 📡 API Overview

## Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register` | Register a new account (Client or Worker). |
| POST | `/login` | Authenticate credentials and return JWT. |

## Profile Routes (`/api/profiles`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/search` | Search active workers with pagination, category matching, and city filtering. |
| GET | `/worker/:id` | Retrieve a worker's public profile and service specifications. |
| GET | `/me` | Fetch the authenticated user's account details and role profile. |
| PUT | `/update` | Save and persist profile changes, phone sanitization, and multi-skill tags. |
| POST | `/save-worker` | Toggle saving a professional to a client's favorites list. |

## Booking Routes (`/api/bookings`)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/` | Submit a new service booking request. |
| GET | `/my-bookings` | Fetch user-specific bookings. |
| PATCH | `/:id/status` | Accept, decline, or complete bookings. |

# ✨ Roadmap & Version 2

- 💳 **Production Payment Gateway**: Stripe / Razorpay checkout integration with webhook verification.
- ⭐ **Client Reviews & Ratings Engine**: Post-service rating submission updating worker profile averages.
- 💬 **Direct Messaging**: In-app chat via Socket.io for confirmed bookings.
- 🔔 **Notification Center**: Real-time push alerts for booking confirmations and schedule changes.

# 🤝 Contributing

1. Fork the Project.
2. Create your Feature Branch:

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit your Changes:

   ```bash
   git commit -m "feat: Add AmazingFeature"
   ```

4. Push to the branch:

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Open a Pull Request.

# ⭐ Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!
