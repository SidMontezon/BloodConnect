// firebase-init.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// Your ONLY Firebase project (bloodconnect-b5142)
const firebaseConfig = {
  apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
  authDomain: "bloodconnect-b5142.firebaseapp.com",
  databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
  projectId: "bloodconnect-b5142",
  storageBucket: "bloodconnect-b5142.firebasestorage.app",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getDatabase(app);