# Database Seeders

This directory contains the data population logic for the application.

## Presentation Showcase Seeder

**Seeder:** `SuperStoreShowcaseSeeder`

This is the primary seeder for college presentations. It populates rich, colorful, and functional data for:

1.  **Vendor Catalog:** David Wilson (vendor@example.com)
2.  **Vendor Settlements:** David Wilson (vendor@example.com)
3.  **Client Goals & Budgets:** Michael Chen (client@example.com)
4.  **Relationships:** Links data to Organization ID 3 (Smith Consulting LLC)

### How to Run
```bash
php artisan db:seed --class=SuperStoreShowcaseSeeder
```

## Core Seeders
- `DatabaseSeeder`: Main entry point.
- `MultiRoleSeeder`: Creates the default users and roles.
- `PortalRefinementSeeder`: Sets up the initial multi-tenant structure.
