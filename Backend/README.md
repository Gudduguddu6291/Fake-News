# Fake News Backend

This backend is the Express API for the Fake News detection app. It handles:
- user authentication via Google/Firebase login
- JWT cookie generation
- user/session management
- prediction requests forwarded to the ML service

## Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB database URI
- Python 3.11+ installed for the ML service
- A working ML service in `../ML-Service` running on port `5000`

## Backend Setup

1. Open a terminal and navigate to the backend folder:

```bash
cd "d:/MERN/Fake News/Backend"
```

2. Install backend dependencies:

```bash
npm install
```

3. Create a `.env` file in `Backend/` with these variables:

```env
DBURL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the backend server:

```bash
npm run server
```

This starts the Express server on port `8000`.

## ML Service Requirement

The backend forwards prediction requests to the ML service at `http://127.0.0.1:5000/predict`.

The ML service is located in `ML-Service/` and must be running separately before prediction calls work.

### Optional combined start

If you have the ML service virtual environment available at `../ML-Service/venv`, you can run both servers together:

```bash
npm run dev
```

If the combined command fails, start the ML service manually from `ML-Service/`.

## API Endpoints

### `GET /`

- Returns: `Hello World!`

### `POST /api/auth/google` and `POST /api/auth/googleauth`

Request body:

```json
{
  "firebaseUid": "string",
  "email": "user@example.com",
  "name": "User Name"
}
```

Response:
- sets an HTTP-only `token` cookie
- returns user data and success message

### `GET /api/auth/logout`

- Clears the authentication cookie
- Returns a logout success message

### `POST /api/predict`

Request body:

```json
{
  "text": "The news text to classify"
}
```

Response:
- forwards the request to the ML service
- returns prediction response with `verdict`, probabilities, and explanation terms

## Notes

- Backend CORS is configured for `http://localhost:5173` by default.
- The ML service must be available at `http://127.0.0.1:5000`.
- Use `DBURL` for your MongoDB connection string.
- Use `JWT_SECRET` to sign auth cookies.

## Backend Folder Structure

```
Backend/
  index.js
  package.json
  config/
    db.js
    token.js
  controllers/
    auth.controllers.js
    predict.js
  middlewares/
    isAuth.js
  models/
    User.js
  routes/
    auth.routes.js
    predict.route.js
```

## Troubleshooting

- If MongoDB fails to connect, verify `DBURL` and database access.
- If prediction fails, confirm the ML service is running on port `5000`.
- If auth fails, confirm `JWT_SECRET` is set in `.env`.
