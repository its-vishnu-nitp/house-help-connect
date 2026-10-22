# House Help Connect

**A marketplace that connects households with verified, local home-service professionals** — cleaning, cooking, childcare, plumbing, electrical work, elderly care and more.

**Live demo:** https://house-help-connect-one.vercel.app/

---

## Features

- **JWT authentication with role-based access** — separate experiences for clients and workers; tokens via `Authorization` header with an httpOnly cookie fallback, bcrypt-hashed passwords. Registration is restricted to client/worker roles with a password minimum.
- **Worker discovery** — paginated search by service category and city, with ratings, hourly rates and experience shown upfront; load-more pagination. Only Aadhaar-verified, available workers appear in search.
- **Rich profiles** — workers manage multiple service tags, hourly rate, experience, bio and an availability toggle; clients can save favourite professionals and view them on a dedicated Saved page.
- **End-to-end bookings with a real state machine** — request → confirmed → in progress → completed / cancelled, enforced on the server: only the worker can start and complete a job, only the party a decision is pending on can confirm it, and the price is always derived from the worker's hourly rate on the server (never trusted from the client). Bookings can be rescheduled (the other party re-confirms).
- **In-app messaging** — clients and workers chat per booking, with a conversation list, unread badges and read receipts.
- **Reviews & ratings** — clients review completed bookings; worker ratings aggregate onto their profiles.
- **Notifications** — booking and payment events notify the other party in-app, with per-item and mark-all read.
- **Worker verification flow** — workers verify their Aadhaar number before they can take jobs or appear in search.
- **Simulated payments** — checkout-style payment flow with service charge, tip and GST breakdown; the payment is persisted on the server (receipt + payment history survive refresh). Demo only — no real money moves.
- **API hardening** — Helmet headers, gzip compression, rate limiting (stricter on auth), a 50 KB JSON body limit, a consistent `{ success, message }` error contract, and database indexes on the booking/notification/message/review hot paths.
- **Cold-start friendly UX** — the frontend detects slow first requests and shows a "waking up the server" banner, with one automatic retry for failed first GETs.
- **Responsive design system** — deep-teal + warm-amber palette, Plus Jakarta Sans / Inter typography, skeleton loading states and toast notifications. Pages are code-split (landing and dashboards load as separate chunks).

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 3, React Router 7, Axios |
| Backend | Node.js, Express 5, Mongoose 9, JSON Web Tokens, bcryptjs |
| Database | MongoDB (Atlas in production) |
| Deployment | Frontend on Vercel · Backend on a free-tier host · MongoDB Atlas |

## Architecture

The frontend and backend are **deployed separately** and communicate over HTTP:

```
Browser ──► React SPA (Vercel) ──► REST API (Express) ──► MongoDB Atlas
                 ▲                        ▲
        VITE_API_URL                FRONTEND_URL (CORS)
```

- The SPA reads the API base URL from the `VITE_API_URL` environment variable — no URLs are hardcoded.
- The API whitelists the deployed frontend origin for CORS (`FRONTEND_URL`) and accepts the JWT from the `Authorization: Bearer` header or a cookie.
- **Cold-start note:** the backend runs on a free tier that sleeps when idle, so the first request after a quiet period can take several seconds. The UI handles this gracefully (banner + automatic retry) rather than failing.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A MongoDB instance (local, or a free Atlas cluster)

### 1. Backend

```bash
cd BACKEND
npm install
cp .env.example .env   # then fill in your values
npm run dev            # nodemon, http://localhost:5500
# or: npm start
```

Optional — seed the database with demo workers and clients:

```bash
npm run seed
```

Backend environment variables (see `BACKEND/.env.example`):

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | API port (default `5500`) |
| `FRONTEND_URL` | Allowed CORS origin (your frontend URL) |
| `NODE_ENV` | `development` / `production` |

### 2. Frontend

```bash
cd FRONTEND
npm install
cp .env.example .env   # set VITE_API_URL to your backend, e.g. http://localhost:5500/api
npm run dev            # http://localhost:5173
```

Frontend environment variables (see `FRONTEND/.env.example`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (must end with `/api`). Defaults to `http://localhost:5500/api` if unset. |

## API Reference

Base path: `/api`. Protected routes require a valid JWT.

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create an account (client or worker) | — |
| POST | `/login` | Log in, returns a JWT | — |
| POST | `/logout` | Log out (clears the auth cookie) | — |
| GET | `/` | Health check | — |

### Profiles — `/api/profiles`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/search?category=&city=&page=&limit=` | Paginated worker search | Public |
| GET | `/worker/:id` | Public worker profile by user ID | Public |
| GET | `/` or `/me` | Current user's profile (creates role profile on first access) | Required |
| PUT | `/update` | Update profile (name, phone, city, services, rate, bio, …) | Required |
| PUT | `/availability` | Toggle a worker's availability for search/bookings | Required (worker) |
| POST | `/save-worker` | Save / unsave a professional (clients) | Required |
| POST | `/verify-aadhaar` | Verify the worker's Aadhaar number | Required |

### Bookings — `/api/bookings`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create a booking (price derived server-side from the worker's rate) | Required |
| GET | `/` | List my bookings (as client or worker) | Required |
| GET | `/:id` | Booking details (participants only) | Required |
| PUT | `/:id/status` | Update booking status (state machine enforced server-side) | Required |
| PUT | `/:id/reschedule` | Reschedule date/time (other party re-confirms) | Required |
| POST | `/:id/pay` | Record the demo payment (client only, persists receipt) | Required |

### Messages — `/api/messages`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | My conversations (last message + unread count per person) | Required |
| POST | `/` | Send a message `{ receiverId, content, bookingReference? }` | Required |
| GET | `/:otherUserId` | Conversation history with a user | Required |
| PUT | `/:otherUserId/read` | Mark a conversation as read | Required |

### Reviews — `/api/reviews`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/professional/:professionalId` | Reviews shown on a worker's profile | Public |
| POST | `/` | Review a completed booking (its client only) | Required |
| GET | `/booking/:bookingId` | The review for a booking, or `null` | Required |

### Notifications — `/api/notifications`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | My notifications | Required |
| PUT | `/:id/read` | Mark one notification read | Required |
| PUT | `/read-all` | Mark all notifications read | Required |

### Payments — `/api/payments`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/mine` | My payment history (as client or worker) | Required |
| GET | `/:bookingId` | Payment receipt for a booking (participants only) | Required |

## Scripts

| Location | Command | Purpose |
|---|---|---|
| `BACKEND/` | `npm run dev` | Start API with nodemon |
| `BACKEND/` | `npm start` | Start API |
| `BACKEND/` | `npm run seed` | Seed demo data |
| `FRONTEND/` | `npm run dev` | Start Vite dev server |
| `FRONTEND/` | `npm run build` | Production build |
| `FRONTEND/` | `npm run preview` | Preview the production build |

## Project Structure

```
house-help-connect/
├── BACKEND/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # auth, profiles, bookings, messages, reviews, notifications, payments
│   ├── middlewares/     # auth guard, Aadhaar gate, error handler
│   ├── models/          # User, HelperProfile, EmployerProfile, Booking, Message, Review, Notification, Payment
│   ├── routes/          # auth, profiles, bookings, messages, reviews, notifications, payments
│   ├── utils/           # asyncHandler, AppError
│   ├── seed.js          # demo data seeder
│   └── server.js        # app entry point
└── FRONTEND/
    ├── public/
    └── src/
        ├── components/  # Header, Footer, banners, dashboard views
        ├── layouts/     # public page layout
        ├── pages/       # Landing, Login, Register, Dashboard, Profile
        ├── services/    # axios API client + domain services
        └── data/        # service category catalogue
```

## Roadmap

- Real payment gateway (Razorpay/Stripe) replacing the simulated flow — the payment module is read-only (receipts/history) until gateway keys are configured.
- Real-time chat (WebSockets) instead of the current 10-second polling.
- Push/email notifications for booking status changes.
- Availability calendars (date-level) for workers, beyond the current on/off toggle.

## License

This project was built for learning and portfolio purposes.
