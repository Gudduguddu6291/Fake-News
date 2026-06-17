# FactGuard Frontend

FactGuard is the React frontend for the Fake News detection app. It provides a polished UI for users to submit content, sign in with Google, and receive a prediction from the backend service.

---

## 🚀 Features

- Interactive fake news analysis interface
- Google sign-in with Firebase
- Smooth animations using Framer Motion
- Tailwind CSS styling and responsive layout
- Axios HTTP client for backend communication
- Prediction result display with confidence and keyword insights

---

## 🧩 Tech Stack

- React 19
- Vite
- Tailwind CSS
- Firebase Authentication
- Axios
- Framer Motion
- Lucide React Icons

---

## 📁 Project Structure

```bash
Frontend/
  src/
    components/
      Hero.jsx
      InputCard.jsx
      Navbar.jsx
      ResultCard.jsx
      ScoreBar.jsx
    context/
      GlobalContext.jsx
    pages/
      Factguardpage.jsx
    utils/
      firebase.js
    App.jsx
    main.jsx
  package.json
  vite.config.js
  README.md
```

---

## 🔧 Prerequisites

- Node.js 18+ installed
- npm installed
- Backend server running on `http://localhost:8000`
- ML service running on `http://127.0.0.1:5000`

---

## ⚙️ Installation

1. Open a terminal and navigate to the frontend folder:

```bash
cd "d:/MERN/Fake News/Frontend"
```

2. Install dependencies:

```bash
npm install
```

---

## 🚀 Run Locally

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

---

## 🔐 Firebase Authentication

Firebase is configured in `src/utils/firebase.js` with environment variables for the API key:

- `VITE_FIREBASE_API_KEY`

The app uses Google sign-in, and the navbar sends authentication data to the backend at:

- `POST http://localhost:8000/api/auth/googleauth`

If you want to use your own Firebase project, update `src/utils/firebase.js` and add the required environment variables.

---

## 🧠 Backend Integration

The frontend sends prediction requests to the backend using Axios:

- `POST http://localhost:8000/api/predict`

Request body:

```json
{ "text": "Your news content here" }
```

The backend response is used to populate prediction results in the UI.

---

## 📌 Notes

- CORS is configured for `http://localhost:5173` in the backend.
- Authentication requests are sent with `withCredentials: true`.
- The default backend endpoint is `http://localhost:8000`.

---

## 📚 Useful Commands

- `npm run dev` — start development server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
