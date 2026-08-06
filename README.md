# 👑 Mayura Fine Cuisine — Full-Stack Restaurant & Admin Platform

> A modern luxury restaurant website and management platform featuring online table reservations, automated Gmail email confirmations, interactive menu showcase, and an integrated admin dashboard.

---

## 🌟 Project Overview

**Mayura Fine Cuisine** is a full-stack web application designed for a luxury dining establishment. It provides customers with an immersive visual experience, complete with an interactive menu, story showcase, and table reservation system. On the backend, it features a robust Node.js/Express API powered by PostgreSQL and Prisma ORM, with automated Nodemailer email notifications and a dedicated React Admin Management Dashboard.

---

## ✨ Features

### 🍽️ Customer-Facing Website
- **Cinematic Experience**: Dark green and gold aesthetic with smooth scroll animations, glassmorphism, and responsive design.
- **Table Reservation System**: Interactive form validating guest details, date, time, seating preferences, and special occasions.
- **Automated Email Confirmations**: Sends formatted HTML confirmation emails to guests upon successful reservation via Nodemailer (Gmail SMTP).
- **Interactive Menu Showcase**: Filterable dishes categorized by Starters, Main Course, Desserts, and Artisanal Beverages with dietary tags (Veg / Non-Veg).
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.

### 👑 Admin Management Dashboard (`/admin`)
- **Luxury Admin Portal UI**: Designed with the same brand identity (`/admin`, `/admin/dashboard`).
- **Real-Time KPI Cards**: Metrics for Total Reservations, Pending Bookings, Today's Capacity, and Unread Messages.
- **Reservation Management**: Searchable table with color-coded status badges (*Pending*, *Confirmed*, *Cancelled*, *Completed*), status update modals, and delete controls.
- **Contact Messages**: Inquiry mailbox with full message preview modals.
- **Menu Management**: Categorized card view with item creation, edit modals, and availability toggles.
- **Restaurant Settings**: Editable profile form for contact details, address, operating hours, and social media channels.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS (Custom color tokens & utility system)
- **Icons**: Google Material Symbols Outlined & Google Fonts (Inter, Cinzel/Serif)

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express v5
- **Database**: PostgreSQL
- **ORM**: Prisma v7 (`@prisma/client`, `@prisma/adapter-pg`)
- **Email Service**: Nodemailer (Gmail SMTP)
- **Validation**: Zod v4
- **Security**: CORS, Dotenv, Cookie Parser

---

## 📁 Folder Structure

```text
NewProject/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Version-controlled SQL database migrations
│   │   └── schema.prisma        # Prisma database schema definition
│   ├── src/
│   │   ├── config/              # Environment config & database pool
│   │   ├── controllers/         # Request handlers (Reservation, Health)
│   │   ├── middleware/          # Error handling & 404 middlewares
│   │   ├── routes/              # Express API route modules
│   │   ├── services/            # Database queries & Nodemailer service
│   │   ├── utils/               # ApiError, ApiResponse, asyncHandler wrappers
│   │   ├── validators/          # Zod validation schemas
│   │   ├── app.js               # Express application setup
│   │   └── server.js            # Server entry point
│   ├── .env.example             # Backend environment template
│   ├── package.json             # Backend dependencies & scripts
│   └── prisma.config.ts         # Prisma 7 configuration file
│
├── src/
│   ├── components/              # Public & Admin reusable React components
│   │   └── admin/               # Admin Login, Sidebar, Navbar & Tab views
│   ├── data/                    # Mock data for menu items & admin dashboard
│   ├── pages/                   # Home, Menu, Experience, and Admin pages
│   ├── App.jsx                  # Main React Router setup
│   ├── index.css                # Global CSS & Tailwind imports
│   └── main.jsx                 # Vite entry point
│
├── .env.example                 # Root environment variables template
├── .gitignore                    # Global git ignore configuration
├── index.html                   # HTML entry point
├── package.json                 # Frontend dependencies & scripts
├── tailwind.config.js           # Custom Tailwind theme configuration
└── vite.config.js               # Vite build settings
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **PostgreSQL** (Installed and running on `localhost:5432`)
- **npm** or **yarn**

---

### 1. Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
# Clone the repository
git clone <repository-url>
cd NewProject

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

---

### 2. Environment Variables Setup

Create a `.env` file inside the `backend` folder based on `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your actual PostgreSQL and Gmail SMTP credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mayura_db?schema=public"

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Gmail SMTP (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
```

> **Note on Gmail App Passwords:** To allow Nodemailer to send emails via Gmail, generate a 16-character App Password at [Google App Passwords](https://myaccount.google.com/apppasswords).

---

### 3. Database Setup & Prisma Migrations

Navigate to the `backend` directory and apply the database migrations:

```bash
cd backend

# Run Prisma migrations to create PostgreSQL tables
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

---

### 4. Running the Application

#### Run Backend API Server
```bash
cd backend
npm run dev
```
- Server will run at: `http://localhost:5000`
- Health check endpoint: `http://localhost:5000/api/health`

#### Run Frontend Client (in a separate terminal)
```bash
# From root directory
npm run dev
```
- Customer Website: `http://localhost:5173/`
- Admin Dashboard: `http://localhost:5173/admin`

---

## 🔌 API Endpoints (Reservation Module)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & database connection status |
| `POST` | `/api/reservations` | Create a new table reservation & trigger email |
| `GET` | `/api/reservations` | Retrieve all reservations (Newest first) |
| `GET` | `/api/reservations/:id` | Fetch details of a single reservation |
| `PUT` | `/api/reservations/:id` | Update reservation status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`) |
| `DELETE` | `/api/reservations/:id` | Delete a reservation by ID |

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push your code to GitHub.
2. Connect your repository to **Vercel**.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Add Environment Variable: `VITE_API_URL=https://your-backend-api.onrender.com`

### Backend Deployment (Render / Railway)
1. Create a PostgreSQL database on **Render / Supabase / Neon**.
2. Deploy the `backend/` service to **Render Web Service**.
3. Set Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Set Start Command: `node src/server.js`
5. Configure Environment Variables (`DATABASE_URL`, `EMAIL_USER`, `EMAIL_PASS`, `CORS_ORIGIN`).

---

## 📸 Screenshots

*(Add screenshots of Customer Home, Reservation Form, Email Notification, and Admin Dashboard here)*

---

## 🔮 Future Improvements

- [ ] JWT authentication for Admin Dashboard login.
- [ ] Live PostgreSQL synchronization for Menu & Contact Messages.
- [ ] Customer SMS notifications via Twilio.
- [ ] Table floor-plan visual picker.

---

## 📜 License

This project is licensed under the **ISC License**.
