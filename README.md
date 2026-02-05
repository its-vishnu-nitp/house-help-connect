# 🏠 House Help Connect

**House Help Connect** is a full-stack web application that connects **house owners** with **house helps** (maid, cook, driver, babysitter, etc.) based on location, work category, and availability.

This project is built as a **learning-first, resume-ready full-stack project**, following industry practices and clean architecture.

---

## 📌 Problem Statement

Finding reliable house help is difficult for house owners, while house helps struggle to find nearby and trustworthy work opportunities.

There is no simple, centralized platform that connects both efficiently.

---

## 💡 Solution Overview

House Help Connect provides a platform where:

- House helps can create profiles showcasing their skills and availability
- House owners can search for suitable house helps
- Both parties can connect directly
- (Future) Ratings, reviews, chat, and payments can be added

---

## ✨ Features

### 🔑 Version 1 (MVP)

- User registration and login
- Role-based access (House Owner / House Help)
- Profile creation
- Search house helps by category and location
- View detailed profiles
- Send work/contact requests

### ⭐ Version 2 (Planned)

- One-to-one chat system
- Ratings and reviews
- Availability calendar
- Verification badges
- Online payment integration

---

## 👤 User Roles

1. **House Owner**
   - Search house helps
   - View profiles
   - Contact house helps

2. **House Help**
   - Create and manage profile
   - Receive work requests

3. **Admin** *(Future Scope)*
   - User management
   - Verification handling
   - Platform moderation

---

## 🌐 Pages

### Public Pages
- Home
- Login
- Register

### Authenticated Pages
- Dashboard
- Profile Page
- Search Results
- House Help Details Page

---

## 🗄️ Database Design (MongoDB)

### Core Collections
- Users
- HouseHelpProfiles
- Requests
- Reviews

### Example: User Schema

| Field     | Type   |
|----------|--------|
| name     | String |
| email    | String |
| password | String |
| role     | String (owner/help) |
| location | String |

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT (JSON Web Token)

### Tools
- VS Code
- Postman
- Git & GitHub

---
<!-- 
## 🧱 Project Structure -->

