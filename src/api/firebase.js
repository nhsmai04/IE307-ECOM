// Firebase SDK v9+ (modular SDK)
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAc2ShExyCYd0lcNtW4cNcwTVqH_W0i9vM",
  authDomain: "ie307-solitea.firebaseapp.com",
  projectId: "ie307-solitea",
  storageBucket: "ie307-solitea.firebasestorage.app",
  messagingSenderId: "17934521703",
  appId: "1:17934521703:web:c64ba684d1af918c98cbc2",
  measurementId: "G-BPPZP2ZER4",
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Tạo database instance
const databaseURL =
  "https://ie307-solitea-default-rtdb.asia-southeast1.firebasedatabase.app/";
export const db = getDatabase(app, databaseURL);

// Tạo Firestore instance
export const FIREBASE_FIRESTORE = getFirestore(app);

// Tạo Auth instance với React Native persistence
export const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Hàm thêm dữ liệu người dùng vào Firestore
export const addUserToFirestore = async (uid, userData) => {
  try {
    const userDocRef = doc(FIREBASE_FIRESTORE, "users", uid);

    // Thêm hoặc ghi đè dữ liệu người dùng
    await setDoc(userDocRef, userData, { merge: true });

    console.log("Người dùng đã được thêm vào Firestore");
  } catch (error) {
    console.error("Lỗi khi thêm người dùng vào Firestore:", error);
  }
};

// Hàm lấy thông tin người dùng từ Firestore
export const getUserFromFirestore = async (uid) => {
  try {
    const userDocRef = doc(FIREBASE_FIRESTORE, "users", uid);

    // Lấy dữ liệu từ Firestore
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("Không tìm thấy thông tin người dùng.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng từ Firestore:", error);
    return null;
  }
};
