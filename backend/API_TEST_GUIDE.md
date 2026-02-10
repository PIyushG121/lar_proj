### API Authentication Test Guide

Your API is running at: http://127.0.0.1:8000

## Quick Tests (Use in Browser, Postman, or CURL)

### 1. Test Login
**URL**: `http://127.0.0.1:8000/api/login`
**Method**: POST
**Body** (JSON):
```json
{
  "email": "demo@walletry.app",
  "password": "password"
}
```

### 2. Test Registration
**URL**: `http://127.0.0.1:8000/api/register`
**Method**: POST
**Body** (JSON):
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "organization_name": "My Company"
}
```

### 3. Test Get User (Protected)
**URL**: `http://127.0.0.1:8000/api/user`
**Method**: GET
**Headers**:
- `Authorization: Bearer YOUR_TOKEN_FROM_LOGIN`

## Using CURL

### Login:
```bash
curl -X POST http://127.0.0.1:8000/api/login -H "Content-Type: application/json" -d "{\"email\":\"demo@walletry.app\",\"password\":\"password\"}"
```

### Register:
```bash
curl -X POST http://127.0.0.1:8000/api/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\",\"organization_name\":\"Test Org\"}"
```

## Note About the Vite Error
- The error you saw is for the **web frontend** route (`/`)
- Your **API routes** (`/api/*`) are working perfectly
- To fix the web route, you'd need to run: `npm run dev` in the backend folder
- But for API-only testing, just use the `/api/*` endpoints above
