<a href="https://guppycode.vercel.app">
   <img src="frontend/public/title.png" alt="guppy logo" width="200">
</a>

**Live Demo:** [guppycode.vercel.app](https://guppycode.vercel.app)

---

`guppy` is a programming puzzle game where you recreate pixel art by writing Python code. The target images dynamically change with the canvas dimensions, so your solutions must be mathematically robust and work for any valid size.

## How to Play

*   **Study:** Open a level and study the target image.
*   **Code:** Write Python code to recreate it using the built-in Monaco Editor.
*   **Test:** Drag the dimension sliders to test your solution across different canvas sizes.
*   **Solve:** Pass the level by producing the correct output for every valid size.

---

<img src="frontend/public/example.png" alt="guppy screenshot">

---

## Tech Stack

**Frontend**
*   **React + TypeScript + Vite**: Core UI and build tooling.
*   **Monaco Editor**: High-performance code editor for the Python environment.
*   **Pyodide**: WebAssembly-powered Python runtime that executes code entirely in the browser.
*   **HTML Canvas**: Fast 2D rendering engine for the pixel buffer.

**Backend**
*   **Node.js + Express**: RESTful API framework.
*   **PostgreSQL**: Relational database for user profiles and code submissions.
*   **Prisma**: Type-safe ORM for database migrations and queries.
*   **Google OAuth 2.0**: Secure authentication system.

---

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   Docker (for local PostgreSQL database)
*   Google Cloud Console account (for OAuth credentials)

### 1. Database & Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://guppy:password@localhost:5433/guppy?schema=public"
   JWT_SECRET="super-secret-local-key"
   PORT=8081
   GOOGLE_CLIENT_ID="your_google_client_id_here"
   ```
4. Start the local PostgreSQL database using Docker:
   ```bash
   docker compose up -d
   ```
5. Sync the Prisma schema to initialize the database tables:
   ```bash
   npm run db:push
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   *(Note: The `postinstall` script will automatically copy Pyodide WebAssembly assets into the `public/pyodide` folder for offline-first development).*
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL="http://localhost:8081/api"
   VITE_GOOGLE_CLIENT_ID="your_google_client_id_here"
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Google OAuth Configuration
To enable sign-ups, you must generate a Client ID in the [Google Cloud Console](https://console.cloud.google.com/).
*   Add `http://localhost:5173` to your **Authorized JavaScript origins**.
*   Paste the Client ID into both `.env` files.

You are now ready to play locally!
