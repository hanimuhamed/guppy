# Backend Integration Guide for GetSetPixel

This document outlines the API endpoints and expected payload structures required to fully power the GetSetPixel frontend.

Currently, the frontend uses a service layer (`src/api/client.ts`) that will make actual HTTP calls to a backend. The base URL is configured in that file (default `http://localhost:8080/api`).

## Authentication & Users

### 1. User Signup
**Endpoint**: `POST /auth/signup`
**Description**: Register a new user.
**Request Body**:
```json
{
  "username": "player1",
  "password": "securepassword",
  "favoriteColor": "#FF5733",
  "leastFavoriteColor": "#33C3FF",
  "guestProgress": {
    "completedLevels": ["level-1", "level-2"],
    "levelCode": {
      "level-1": "def run():\n  pass"
    }
  }
}
```
**Notes**: The frontend may send `guestProgress` (the local storage progress). The backend should automatically merge this data into the newly created user's profile.
**Response (200 OK)**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "username": "player1",
    "favoriteColor": "#FF5733",
    "leastFavoriteColor": "#33C3FF",
    "joinDate": "2026-06-25T00:00:00Z"
  }
}
```

### 2. User Login
**Endpoint**: `POST /auth/login`
**Description**: Authenticate an existing user.
**Request Body**:
```json
{
  "username": "player1",
  "password": "securepassword"
}
```
**Response (200 OK)**: Same as Signup.

### 3. Get Current User
**Endpoint**: `GET /users/me`
**Headers**: `Authorization: Bearer <token>`
**Description**: Fetch the currently authenticated user's profile information.
**Response (200 OK)**:
```json
{
  "id": "uuid",
  "username": "player1",
  "favoriteColor": "#FF5733",
  "leastFavoriteColor": "#33C3FF",
  "joinDate": "2026-06-25T00:00:00Z"
}
```

## Progression & Submissions

### 4. Fetch Progress
**Endpoint**: `GET /progress`
**Headers**: `Authorization: Bearer <token>`
**Description**: Fetch the user's progress across all worlds and levels.
**Response (200 OK)**:
```json
{
  "completedLevels": ["level-1", "level-2"],
  "levelCode": {
    "level-1": "def run():\n  pass"
  },
  "levelDimensions": {
    "level-1": { "width": 5, "height": 5 }
  }
}
```

### 5. Submit Solution (Save Progress)
**Endpoint**: `POST /progress`
**Headers**: `Authorization: Bearer <token>`
**Description**: Save progress (either a successful completion or just saving code state).
**Request Body**:
```json
{
  "levelId": "level-1",
  "code": "def run():\n  pass",
  "dimensions": { "width": 5, "height": 5 },
  "completed": true
}
```
**Response (200 OK)**:
```json
{
  "success": true
}
```

## Next Steps for Backend Setup
1. Implement the routes above matching the request/response schema.
2. Implement JWT or session-based auth (the frontend expects to store a token in `localStorage` and pass it in the `Authorization` header).
3. Update `src/api/client.ts` with the correct `API_BASE_URL` when ready to connect.
