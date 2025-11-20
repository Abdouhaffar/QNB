// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // لـ Firestore
import { getStorage } from "firebase/storage";   // لـ Storage
import { getAuth } from "firebase/auth";       // لـ Authentication

// Your web app's Firebase configuration
// تم استبدال القيم بقيم مشروعك ARTIZONE
const firebaseConfig = {
  apiKey: "AIzaSyDHuYlu4xDoaom-neYGQBYf4iITeybdrvI",
  authDomain: "artizone-e3d9c.firebaseapp.com",
  projectId: "artizone-e3d9c",
  storageBucket: "artizone-e3d9c.appspot.com", // تعديل: يجب أن يكون appspot.com
  messagingSenderId: "370751376477",
  appId: "1:370751376477:web:804fb26c7f24db5f3c51b4",
  measurementId: "G-YLTXWE4TC4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);       // قاعدة البيانات
export const storage = getStorage(app);   // تخزين الملفات والصور
export const auth = getAuth(app);         // المصادقة (تسجيل الدخول/التسجيل)

// يمكنك استخدام هذه المتغيرات (db, storage, auth) في أي مكان في مشروع React الخاص بك.
