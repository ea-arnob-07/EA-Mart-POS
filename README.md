# 🛒 EA Mart — Retail Management & Point of Sale (POS) System

<div align="center">

![EA Mart Banner](https://img.shields.io/badge/EA%20Mart-Retail%20POS%20System-emerald?style=for-the-badge&logo=shopify&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ea--mart--pos.vercel.app-00df9a?style=for-the-badge&logo=vercel&logoColor=white)](https://ea-mart-pos.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**A modern, enterprise-grade Multi-Store Retail Management and Point of Sale (POS) ecosystem tailored for high-volume retail chains, supermarkets, and specialty stores.**

[🚀 Live Demo](https://ea-mart-pos.vercel.app/) • [Default Credentials](#-default-login-credentials) • [Supabase Database](#-supabase-database-configuration) • [Key Features](#-key-features) • [Quick Start](#-quick-start)

</div>

---

## 🌟 Overview

**EA Mart Retail Management System** is an end-to-end POS and retail ERP application built with modern full-stack web technologies. It is built to bridge front-of-house cashier speed with back-of-house multi-warehouse logistics, purchasing workflows, shift reconciliation, batch expiration tracking, and multi-tier role-based access control.

The production deployment runs on **Vercel** backed by a high-availability **Supabase PostgreSQL** cloud database. Optimized out of the box for Bangladeshi retail operations with native **BDT (৳)** currency handling, Bangladesh VAT compliance, and local payment methods (bKash, Nagad, Rocket, Cards, Cash).

---

## 🌐 Live Demo & Repository

> [!TIP]
> 🔗 **Live Demo URL**: [https://ea-mart-pos.vercel.app](https://ea-mart-pos.vercel.app)  
> 📦 **GitHub Repository**: [ea-arnob-07/EA-Mart-POS](https://github.com/ea-arnob-07/EA-Mart-POS)  
> 💻 **Local Development**: `http://localhost:3000`

---

## 🗄️ Supabase Database Configuration

The system utilizes **[Supabase](https://supabase.com/)** as its managed cloud PostgreSQL database provider, configured with session-level IPv4 connection pooling:

- **Database Platform**: [Supabase](https://supabase.com/) (AWS Tokyo `ap-northeast-1`)
- **Connection Host**: `aws-1-ap-northeast-1.pooler.supabase.com:5432`
- **Database User**: `postgres.zjuiacsvtaqqursfgmsd`
- **Database Password**: `Arnob178202`
- **Database Name**: `postgres`
- **Prisma Connection URI (Session Pooler)**:
  ```text
  postgresql://postgres.zjuiacsvtaqqursfgmsd:Arnob178202@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require
  ```

---

## 🔑 Default Login Credentials

The login page includes a **"Login as (Roles)"** dropdown directly under the Continue button. Selecting any role will automatically populate its email address into the input field so you can sign in directly with the password.

> [!IMPORTANT]
> **Universal Demo Password:** `123456789` for all seeded demo accounts below.

| Role | Username | Demo Email | Primary Scope & Access |
| :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `admin` | `admin@eamart.test` | Full root access across all stores, settings, audit logs & users |
| 🏢 **Store Owner** | `owner` | `owner@eamart.test` | Store chain financial oversight, multi-store reports & executive analytics |
| 👔 **Store Manager** | `manager` | `manager@eamart.test` | Daily store operations, cash register approvals, pricing & staff management |
| 💻 **Cashier** | `cashier01` | `cashier@eamart.test` | Fast POS terminal, barcode scanning, checkout, customer selection & receipt printing |
| 📦 **Inventory Manager** | `inventory01` | `inventory@eamart.test` | Stock tracking, batch numbers, expiry warnings, damaged stock adjustments |
| 📑 **Purchasing Officer** | `purchase01` | `purchasing@eamart.test` | Supplier purchase orders (PO), goods receiving (GRN) & unit cost tracking |
| 💳 **Accountant** | `accountant01` | `accountant@eamart.test` | Expense tracking, tax summaries, P&L reporting & daily cash balancing |
| 🚚 **Warehouse Staff** | `warehouse01` | `warehouse@eamart.test` | Inter-store transfers, central distribution center picking, dispatching & receiving |
| 🔍 **Auditor** | `auditor01` | `auditor@eamart.test` | Read-only compliance inspection, price change logs, refunds & transaction trails |

---

## ✨ Key Features

### 🛒 High-Velocity Point of Sale (POS)
- **Barcode & Camera Scanning**: Instant item lookup via dedicated USB hardware barcode scanners or device camera.
- **Split & Multi-Tender Payments**: Cash, Card, Mobile Banking (bKash, Nagad, Rocket), and Store Credit within a single order.
- **Cart Management**: Item-level and whole-order discounts, tax computations (VAT included/excluded), and line-item voiding.
- **Hold & Recall Carts**: Park suspended customer transactions (layby) and resume instantly without losing cart state.
- **Thermal Receipt Printing & Customer Display**: Formatted 80mm/58mm thermal receipts with store BIN, barcode, and BDT totals.

### 🏬 Multi-Store & Central Warehouse
- Centralized management for Flagship Superstores, Express Outlets, and Central Warehouses.
- Inter-store stock transfers (`TRF-*`) with dispatch validation, in-transit tracking, and store receipt confirmation.

### 📦 Inventory, Batch & Expiry Control
- Real-time stock counts across multiple locations (`onHand`, `available`, `reserved`, `damaged`).
- Expiry date alerts and batch tracking (`StockBatch`) for perishable groceries and medicines.
- Transactional stock ledger recording every addition, sale deduction, write-off, and return.

### 💵 Cash Register & Shift Reconciliation
- Enforced shift opening with float verification.
- Mid-shift cash drops, petty cash expenses, and pay-ins/pay-outs (`CashMovement`).
- Blind end-of-shift cash counting with automated shortage/overage variance reporting.
- End-of-Day (EOD) business day closure consolidating gross, net, tax, and tender breakdowns.

### 🎯 Loyalty & Customer CRM
- Membership tier progression: **Bronze → Silver → Gold → VIP**.
- Automated loyalty points accrual on checkout and redemption against order subtotal.
- Complete customer purchase history and credit balance tracking.

### 🛡️ Enterprise Audit Trails & Security
- Immutable audit log (`AuditLog`) capturing all privileged actions, price changes, discounts, and refunds.
- Granular Role-Based Access Control (RBAC) preventing unauthorized cashier discounts or inventory alterations.
- Secure JWT-based sessions and bcrypt hashed passwords.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions & API Routes) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **User Interface** | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/) |
| **Database Provider**| [Supabase](https://supabase.com/) (Managed Cloud PostgreSQL) |
| **ORM** | [Prisma ORM 6](https://www.prisma.io/) |
| **Hosting & Deployment**| [Vercel](https://vercel.com/) (Edge Network & Serverless Functions) |
| **Authentication**| JWT (JSON Web Tokens), `bcryptjs` password hashing |
| **Runtime / Tooling** | Node.js 20+, `tsx` execution engine |

---

## 📁 Project Structure

```text
EA-Mart-Retail-Management-System/
├── prisma/
│   ├── schema.prisma         # Full relational database schema (12 Core Modules)
│   └── seed.ts               # Production-grade seed data (9 roles, stores, products, batches)
├── public/                   # Static assets, branding, and icons
├── scripts/
│   └── set-bdt-currency.ts   # Currency configuration & price conversion utility
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # RESTful API endpoints (auth, pos, sales, inventory, etc.)
│   │   ├── audit/            # Audit trail viewer
│   │   ├── customers/        # Customer directory & loyalty tiers
│   │   ├── end-of-day/       # Daily store closure & financial balance
│   │   ├── expenses/         # Store expense recording
│   │   ├── inventory/        # Stock levels, batches, and adjustments
│   │   ├── login/            # Authentication & quick demo selector
│   │   ├── pos/              # High-speed cashier register interface
│   │   ├── products/         # Product catalog management
│   │   ├── promotions/       # Discounts, coupons & BOGO promotions
│   │   ├── purchasing/       # Purchase orders (PO) & goods receiving (GRN)
│   │   ├── register/         # Cash register shift open/close
│   │   ├── reports/          # Financial, sales, tax & inventory reports
│   │   ├── returns/          # Customer refund processing & restock
│   │   ├── sales/            # Sales invoice history
│   │   ├── settings/         # Store preferences, receipt branding & VAT
│   │   ├── transfers/        # Inter-store stock transfer workflows
│   │   ├── layout.tsx        # Global app layout & navigation
│   │   └── page.tsx          # Executive dashboard & metrics
│   ├── components/
│   │   └── pos/              # Specialized POS components (Cart, Scanner, Modals)
│   ├── context/
│   │   ├── AppContext.tsx    # Store context, current user & global settings
│   │   └── POSContext.tsx    # Active cart, barcode scanning & pricing logic
│   └── lib/
│       ├── auth.ts           # RBAC permissions matrix & session handling
│       ├── prisma.ts         # Prisma client singleton
│       └── types.ts          # Core domain models & API response types
├── .env.example              # Sample environment configuration
├── package.json              # Project dependencies & build scripts
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** or **pnpm**
- **Database**: Cloud [Supabase](https://supabase.com/) or local PostgreSQL

### 2. Clone Repository
```bash
git clone https://github.com/ea-arnob-07/EA-Mart-POS.git
cd EA-Mart-POS
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
# Supabase Cloud Database (Tokyo Pooler)
DATABASE_URL="postgresql://postgres.zjuiacsvtaqqursfgmsd:Arnob178202@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
JWT_SECRET="ea-mart-super-secret-jwt-key-2026"
```

### 5. Initialize Database & Seed Demo Data
```bash
# Push schema to database
npx prisma db push

# Seed sample stores, products, staff roles, and initial shifts
npm run db:seed
```

### 6. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🇧🇩 Bangladesh Currency & VAT Configuration

EA Mart operates natively in **Bangladeshi Taka (BDT ৳)** with Bangladesh National Board of Revenue (NBR) standard 15% VAT.

To re-apply or synchronize currency defaults across the database catalogue:
```bash
npm run currency:bdt
```

---

## 🚢 Deployment Guide

### Deploying on Vercel with Supabase

1. **Push to GitHub**: Code is maintained on [ea-arnob-07/EA-Mart-POS](https://github.com/ea-arnob-07/EA-Mart-POS).
2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and import `ea-arnob-07/EA-Mart-POS`.
   - In **Environment Variables**, add:
     - `DATABASE_URL`: `postgresql://postgres.zjuiacsvtaqqursfgmsd:Arnob178202@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require`
     - `JWT_SECRET`: `ea-mart-super-secret-jwt-key-2026`
3. **Deploy**: Click **Deploy**. Vercel builds the Next.js production bundle.
4. **Access Production Site**: [https://ea-mart-pos.vercel.app/](https://ea-mart-pos.vercel.app/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Developed & Maintained with ❤️ by <b>ea-arnob-07</b></sub>
</div>
