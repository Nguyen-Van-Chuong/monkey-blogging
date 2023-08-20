import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDmJDlagr7r76cgxaV5H8-sLmyrGtMbGcs",
  authDomain: "monkey-blogging-868e7.firebaseapp.com",
  projectId: "monkey-blogging-868e7",
  storageBucket: "monkey-blogging-868e7.appspot.com",
  messagingSenderId: "590141212931",
  appId: "1:590141212931:web:a6234f30a96dc7c0980136",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
