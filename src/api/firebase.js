// Firebase SDK v9+ (modular SDK)
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { ref, get } from 'firebase/database';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc2ShExyCYd0lcNtW4cNcwTVqH_W0i9vM",
  authDomain: "ie307-solitea.firebaseapp.com",
  projectId: "ie307-solitea",
  storageBucket: "ie307-solitea.firebasestorage.app",
  messagingSenderId: "17934521703",
  appId: "1:17934521703:web:c64ba684d1af918c98cbc2",
  measurementId: "G-BPPZP2ZER4"
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);
const databaseURL = 'https://ie307-solitea-default-rtdb.asia-southeast1.firebasedatabase.app/';
// Lấy database instance
const db = getDatabase(app,databaseURL);

// Hàm lấy dữ liệu từ database
export const getProducts = async () => {
  try {
    // Tạo tham chiếu tới database
    const productsRef = ref(db, '2/data');
    
    // Lấy dữ liệu từ database
    const snapshot = await get(productsRef);
    
    // Kiểm tra nếu có dữ liệu
    if (snapshot.exists()) {
      return snapshot.val();  // Trả về dữ liệu từ database
    } else {
      console.log("Không có dữ liệu.");
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    return null;
  }
};
