// Firebase SDK v9+ (modular SDK)
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
  updateDoc,
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
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Tạo database instance
const databaseURL =
  "https://ie307-solitea-default-rtdb.asia-southeast1.firebasedatabase.app/";
export const db = getDatabase(app, databaseURL);

export const getProductsByType = async (type) => {
  try {
    // Tạo tham chiếu tới database (2/product)
    const productsRef = ref(db, "2/product");

    // Lấy toàn bộ dữ liệu sản phẩm
    const snapshot = await get(productsRef);

    if (snapshot.exists()) {
      const allProducts = snapshot.val(); // Trả về đối tượng các sản phẩm
      const products = Object.values(allProducts); // Chuyển thành mảng

      // Lọc sản phẩm theo type
      const filteredProducts = products.filter(
        (product) => product.type === type
      );
      return filteredProducts;
    } else {
      console.log("Không có dữ liệu.");
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu theo type:", error);
    return [];
  }
};

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

// Hàm thêm sản phẩm vào giỏ hàng trên Firestore
export const addToCartFB = async (userId, cartItem) => {
  try {
    // Tham chiếu tới document giỏ hàng của người dùng
    const cartRef = doc(FIREBASE_FIRESTORE, "cart", userId);
    const cartSnapshot = await getDoc(cartRef);

    // Tính giá trị toppings (chuyển tất cả sang số)
    const toppingCost = cartItem.toppings.reduce((sum, topping) => {
      const toppingValue = parseFloat(topping.value || "0"); // Chuyển value sang số
      return sum + toppingValue;
    }, 0);
    console.log("Tổng giá trị toppings:", toppingCost);
    // Dữ liệu giỏ hàng mới
    const newItem = {
      id: cartItem.id,
      name: cartItem.name,
      image: cartItem.image,
      price: parseFloat(cartItem.price), // Chuyển price sang số
      quantity: cartItem.quantity,
      size: cartItem.size,
      ice: cartItem.ice,
      sweetness: cartItem.sweetness,
      toppings: cartItem.toppings || [],
      total: (parseFloat(cartItem.price) + toppingCost) * cartItem.quantity,
    };

    if (cartSnapshot.exists()) {
      // Nếu giỏ hàng đã tồn tại
      const currentCart = cartSnapshot.data().itemscart || [];

      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingProductIndex = currentCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.ice === newItem.ice &&
          item.sweetness === newItem.sweetness &&
          JSON.stringify(item.toppings) === JSON.stringify(newItem.toppings)
      );

      if (existingProductIndex >= 0) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        const existingProduct = currentCart[existingProductIndex];
        existingProduct.quantity += newItem.quantity;

        // Tính lại giá trị toppings cho sản phẩm đã tồn tại
        const existingToppingCost = existingProduct.toppings.reduce(
          (sum, topping) => sum + parseFloat(topping.value || "0"),
          0
        );

        // Cập nhật tổng giá trị
        existingProduct.total =
          existingProduct.quantity *
          (parseFloat(existingProduct.price) + existingToppingCost);
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
        currentCart.push(newItem);
      }

      // Cập nhật giỏ hàng trên Firestore
      await updateDoc(cartRef, { itemscart: currentCart });
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo mới
      await setDoc(cartRef, { itemscart: [newItem] });
    }

    console.log("Sản phẩm đã được thêm vào giỏ hàng!");
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
  }
};
