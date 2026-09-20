# Final Year Project – Financial Ecosystem (wAlletry)

## Project Overview

This project is a high-performance multi-portal financial/business management ecosystem designed to centralize billing, payments, and reporting.

*   **Backend:** Laravel 11 (PHP 8.2+)
*   **Frontend:** React 18, Inertia.js (SPA), TypeScript
*   **Design System:** Modern premium dashboard with HSL gradients and dark mode support
*   **Real-time:** Laravel Echo integration ready
*   **Architecture:** Multi-tenant / Role-centric dashboard system

It supports three primary user roles: **Businessman**, **Vendor**, and **Client**.

---

## Core Functional Flow

### Authentication & Role Routing
The application uses a role-based redirection system. Upon authentication, users are automatically routed to their respective portals:

| Role          | Path                     | Layout              |
|---------------|--------------------------|---------------------|
| Businessman   | `/dashboard/business`    | `BusinessLayout`    |
| Vendor        | `/vendor/dashboard`      | `VendorLayout`      |
| Client        | `/client/dashboard`      | `ClientLayout`      |

*   **Middleware Protection:** Portals are secured via `role:*` and `portal.role` middleware to prevent unauthorized cross-portal access.
*   **Portal Stabilization:** Navigation is dynamically handled via **Ziggy Route Helpers** to ensure frontend/backend synchronization.

---

## Module Breakdown

### 1. Businessman Portal (The Controller)
Acts as the central entity for organizational management and high-level financial oversight.
- **Features:** Analytics, Detailed Reports, Partner/Vendor Management, Transaction Ledger, and Manual Payment Verification.
- **Key Routes:** `/dashboard/business`, `/transactions`, `/partners`, `/payments/verify`.

### 2. Vendor Portal (The Provider)
Focused on billing, service delivery, and settlement management.
- **Features:** **Service Catalog Management**, Invoice Generation, Statement Downloads, and Settlement/Withdrawal flows.
- **Key Routes:** `/vendor/dashboard`, `/vendor/billing`, `/vendor/settlements`, `/vendor/catalog`.

### 3. Client Portal (The Payer)
Focused on personal finance, budget tracking, and goal achievement.
- **Features:** Budget CRUD, Savings Goals, Analytics, Invoice Tracking, and Payment Extension Requests.
- **Key Routes:** `/client/dashboard`, `/client/transactions`, `/client/budgets`, `/client/goals`.

---

## Technical Audit & Enhancements

- **Portal Stabilization:** Recently refactored to use **Ziggy `route()` helpers** throughout the layouts, resolving navigation mismatches (e.g., Billing/Settlements mapping).
- **Defensive Hooks:** Implemented robust `usePage` state management to prevent runtime errors during asynchronous data loading.
- **Design Excellence:** Premium UI utilizing HSL gradients, glassmorphism, and responsive Tailwind layouts.

---

## Deployment & Demo Instructions

### Backend Setup
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
```

### Showcase Data (IMPORTANT)
To populate the dashboards with rich, presentation-ready data, run the specific showcase seeder:
```bash
php artisan db:seed --class=SuperStoreShowcaseSeeder
```
*This populates David Wilson's Catalog, Settlements, and Michael Chen's Goals/Budgets.*

### Frontend Setup
```bash
npm install
npm run dev
```

---

## Suggested Demo Credentials

| Role        | Email                  | Password | Dashboard Feature to Show |
|-------------|------------------------|----------|---------------------------|
| Businessman | `businessman@example.com` | `password` | Organization Switching    |
| Vendor      | `vendor@example.com`      | `password` | Service Catalog & Invoices |
| Client      | `client@example.com`      | `password` | Savings Goals & Budgets   |

---

## Presentation Demo Flow

### Vendor Demo (First Impression)
1. Login as `vendor@example.com`.
2. Navigate to **Catalog** to show the colorful service list.
3. Open **Payouts** to show the settlement history graph.

### Businessman Demo
1. Login as `businessman@example.com`.
2. Show **Transactions** and the **Manual Payment Verification** flow.

### Client Demo
1. Login as `client@example.com`.
2. Show **Goals** and the visual progress bars for savings.

---

## Conclusion
This platform solves fragmented financial coordination by centralizing the entire lifecycle of a transaction—from service listing (Vendor) to payment (Client) and reconciliation (Businessman). It is architected for scalability and ready for academic presentation.
