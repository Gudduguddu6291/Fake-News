import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fake-news-6c153.firebaseapp.com",
  projectId: "fake-news-6c153",
  storageBucket: "fake-news-6c153.firebasestorage.app",
  messagingSenderId: "419012236353",
  appId: "1:419012236353:web:cf65f934f751e0c6ffa2c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
