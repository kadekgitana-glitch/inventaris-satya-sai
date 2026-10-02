import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD7Ds9aVsRN14IEMNuqVad7S8DNYowjwI0",
  authDomain: "sarpras-sekolah.firebaseapp.com",
  databaseURL: "https://sarpras-sekolah-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sarpras-sekolah",
  storageBucket: "sarpras-sekolah.firebasestorage.app",
  messagingSenderId: "763230538669",
  appId: "1:763230538669:web:ba11d0db5c7bb9bef9af24"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export const firebaseStorage = getStorage(app);

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.warn("Gagal mengubah persistence Firebase Auth:", error);
});
