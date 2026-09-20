# Portal Layouts & Shared State

This directory contains the core layout components for the **Business**, **Vendor**, and **Client** portals.

## Stabilization & Best Practices

All layouts have been stabilized to prevent runtime errors and navigation mismatches.

### 1. Dynamic Routing (Ziggy)
All navigation links MUST use the Ziggy `route()` helper instead of hardcoded strings. This ensures the frontend remains synchronized with the Laravel backend.
```tsx
<Link href={route('vendor.billing')}>Bills</Link>
```

### 2. Defensive Page State
Access shared page data (auth, url) defensively to handle asynchronous loading.
```tsx
const page = usePage<any>();
const url = page?.url || '';
const { auth } = page.props;
```

### 3. Active Link Highlighting
Use `url.startsWith()` for robust active link matching, especially when routes have parameters or query strings.
