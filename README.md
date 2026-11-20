# BizzPilot ERP: Multi-Tenant Franchise Platform
> **Architecture:** Node.js Express • React 18 (Vite) • PostgreSQL • Multi-Tenant Isolation  

---

## 📌 Project Overview

BizzPilot ERP is an enterprise multi-tenant franchise operations and store management platform designed for multi-branch retail networks, inventory tracking, point-of-sale billing, and operational coordination.

---

## 🚀 How to Start the Application (CMD / Terminal)

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **PostgreSQL** (v14 or higher)

### Step 1: Install Dependencies
Open your Command Prompt (CMD) in the project root folder and execute:
```cmd
npm run install:all
```

### Step 2: Environment Configuration
Copy `.env.example` to create your local `.env` configuration file:
```cmd
copy .env.example .env
```
Update your database credentials (`PG_USER`, `PG_PASSWORD`, `PG_DATABASE`) in the `.env` file.

### Step 3: Launch the System

#### Production Mode (Single Port Unified Server)
Builds the client frontend bundle and serves the application on a unified server:
```cmd
npm run build
npm start
```
* **Application URL**: `http://localhost:5000`

---

#### Developer Mode (Live Hot-Reloading)
Run backend and frontend concurrently in two separate Command Prompt windows:

**Terminal 1 (Backend API):**
```cmd
npm run server
```
* Runs on: `http://localhost:5000`

**Terminal 2 (Frontend Client):**
```cmd
npm run client
```
* Runs on: `http://localhost:3000` (auto-proxies API calls to port 5000)

---

## 🏗️ Core Features

* **Multi-Branch Operations**: Real-time counter sales, customer billing, and multi-tender split payments (Cash, UPI, Card).
* **Inter-Branch Stock Transfers**: Official dispatch tracking with origin/destination branches, logistics notes, and driver details.
* **Network Stock Telemetry**: Live inventory availability across store locations.
* **Procurement & Inventory**: Vendor purchase orders, goods receiving, and catalog management.
* **Customer Holds & Reservations**: Timed inventory holds preventing counter double-selling.
* **Daily Cash Book**: Shift cash tracking and reconciliation.

---

## 📁 Repository Structure

```
├── client/                  # React 18 Frontend (Vite, CSS Modules, Lucide Icons)
├── server/                  # Node.js Express REST Backend & PostgreSQL Models
│   ├── server.js            # Main application server & route handlers
│   └── postgres.js          # PostgreSQL connection pool & database interface
├── .env.example             # Safe environment variable configuration template
├── package.json             # Root lifecycle scripts and workspace configuration
└── README.md                # System documentation and deployment instructions
```
