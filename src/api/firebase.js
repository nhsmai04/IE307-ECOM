// Firebase SDK v9+ (modular SDK)
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
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

// Hàm kiểm tra thông tin người dùng từ Firestore
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
//Ham lay du lieu gio hang tu firestore
export const getCartFromFirestore = async (userId) => {
  try {
    const cartRef = doc(FIREBASE_FIRESTORE, "cart", userId);
    const cartSnapshot = await getDoc(cartRef);
    if (cartSnapshot.exists()) {
      console.log("Lay san pham thanh cong!");
      console.log(cartSnapshot.data().itemscart || []);
      return cartSnapshot.data().itemscart || [];
    } else {
      console.log("Khong co san pham trong gio hang!");
      return [];
    }
  } catch (error) {
    console.log("Loi khi lay san pham!");
    return null;
  }
};

const areToppingsEqual = (toppings1, toppings2) => {
  if (toppings1.length !== toppings2.length) return false;

  // Sắp xếp hai mảng toppings theo tên topping và giá trị
  const sortedToppings1 = [...toppings1].sort(
    (a, b) => a.nametopping.localeCompare(b.nametopping) || a.value - b.value
  );
  const sortedToppings2 = [...toppings2].sort(
    (a, b) => a.nametopping.localeCompare(b.nametopping) || a.value - b.value
  );

  for (let i = 0; i < sortedToppings1.length; i++) {
    if (
      sortedToppings1[i].nametopping !== sortedToppings2[i].nametopping ||
      sortedToppings1[i].value !== sortedToppings2[i].value
    ) {
      return false;
    }
  }
  return true;
};
export const removeFromCart = async (userId, itemToRemove) => {
  try {
    if (!userId || !itemToRemove) {
      console.error("Thiếu userId hoặc itemToRemove!");
      return;
    }

    const cartRef = doc(FIREBASE_FIRESTORE, "cart", userId);

    // Lấy dữ liệu hiện tại từ Firestore
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
      const currentCart = cartSnapshot.data().itemscart || [];

      // Lọc các item không phải là itemToRemove
      const updatedCart = currentCart.filter(
        (item) =>
          item.id !== itemToRemove.id ||
          item.size !== itemToRemove.size ||
          item.ice !== itemToRemove.ice ||
          item.sweetness !== itemToRemove.sweetness ||
          !areToppingsEqual(item.toppings, itemToRemove.toppings)
      );

      // Cập nhật giỏ hàng mới lên Firestore
      await updateDoc(cartRef, { itemscart: updatedCart });

      console.log("Đã xóa sản phẩm khỏi giỏ hàng:", itemToRemove);
    } else {
      console.log("Giỏ hàng trống hoặc không tồn tại!");
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
  }
};

export const updateCart = async (userId, itemToUpdate, newquantity) => {
  try {
    if (!userId || !itemToUpdate) {
      console.error("Thiếu userId hoặc itemToUpdate!");
      return;
    }

    const cartRef = doc(FIREBASE_FIRESTORE, "cart", userId);

    // Lấy dữ liệu hiện tại từ Firestore
    const cartSnapshot = await getDoc(cartRef);

    if (cartSnapshot.exists()) {
      const currentCart = cartSnapshot.data().itemscart || [];

      // Tính giá trị toppings (chuyển tất cả sang số)
      const toppingCost = itemToUpdate.toppings.reduce((sum, topping) => {
        const toppingValue = parseFloat(topping.value || "0"); // Chuyển value sang số
        return sum + toppingValue;
      }, 0);
      const arraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((topping1, index) => {
          const topping2 = arr2[index];
          // So sánh các thuộc tính của topping, như nametopping, value, v.v.
          return (
            topping1.nametopping === topping2.nametopping &&
            topping1.value === topping2.value
          );
        });
      };
      // Dữ liệu sản phẩm cần cập nhật
      const updatedItem = {
        id: itemToUpdate.id,
        name: itemToUpdate.name,
        image: itemToUpdate.image,
        price: parseFloat(itemToUpdate.price), // Chuyển price sang số
        quantity: newquantity,
        size: itemToUpdate.size,
        ice: itemToUpdate.ice,
        sweetness: itemToUpdate.sweetness,
        toppings: itemToUpdate.toppings || [],
        total: (parseFloat(itemToUpdate.price) + toppingCost) * newquantity,
      };

      // Tìm sản phẩm cần cập nhật trong giỏ hàng
      const existingProductIndex = currentCart.findIndex(
        (item) =>
          item.id === updatedItem.id &&
          item.size === updatedItem.size &&
          item.ice === updatedItem.ice &&
          item.sweetness === updatedItem.sweetness &&
          arraysEqual(item.toppings, updatedItem.toppings)
      );
      console.log("Update item:", updatedItem);
      if (existingProductIndex >= 0) {
        // Nếu sản phẩm đã tồn tại, cập nhật thông tin
        currentCart[existingProductIndex] = updatedItem;

        // Cập nhật giỏ hàng mới lên Firestore
        await updateDoc(cartRef, { itemscart: currentCart });

        console.log(`Đã cập nhật sản phẩm: ${updatedItem.name}`);
      } else {
        console.log("Không tìm thấy sản phẩm cần cập nhật!");
      }
    } else {
      console.log("Không tìm thấy giỏ hàng!");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", error);
  }
};
const getLocationFromAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&countrycodes=VN&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0 (your_email@example.com)", // Thay bằng thông tin của bạn
        },
      }
    );

    if (!response.ok) {
      throw new Error("Không thể lấy tọa độ từ địa chỉ.");
    }

    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) }; // Trả về tọa độ
    } else {
      throw new Error("Không tìm thấy tọa độ phù hợp.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi Nominatim API:", error);
    throw error;
  }
};
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Khoảng cách tính bằng km
  return distance.toFixed(2); // Làm tròn đến 2 chữ số thập phân
};
export const orderHistory = async (userId, name, phone, address) => {
  try {
    const location = await getLocationFromAddress(address);

    // Toạ độ kho hàng (ví dụ)
    const warehouseLocation = { lat: 10.762622, lng: 106.660172 };

    // Tính khoảng cách và thời gian dự kiến giao hàng (giả sử tốc độ trung bình 40km/h)
    const distance = calculateDistance(
      warehouseLocation.lat,
      warehouseLocation.lng,
      location.lat,
      location.lng
    );
    const estimatedTimeInHours = distance / 40; // Tính thời gian (giờ)
    const estimatedTimeInMs = estimatedTimeInHours * 60 * 60 * 1000; // Chuyển sang milliseconds

    // Tham chiếu tới giỏ hàng
    const cartRef = doc(FIREBASE_FIRESTORE, "cart", userId);
    const cartSnapshot = await getDoc(cartRef);

    if (!cartSnapshot.exists()) {
      console.log("Giỏ hàng trống, không thể đặt hàng!");
      return;
    }

    const cartItems = cartSnapshot.data().itemscart || [];
    if (cartItems.length === 0) {
      console.log("Giỏ hàng trống, không thể đặt hàng!");
      return;
    }

    // Tạo một orderID mới
    const orderID = `${userId}_${Date.now()}`;

    // Tạo dữ liệu order
    const orderData = {
      orderID: orderID,
      items: cartItems,
      uid: userId,
      name: name,
      phone: phone,
      address: address,
      location: location,
      totalAmount: cartItems.reduce((sum, item) => sum + item.total, 0), // Tổng tiền
      type: "Đang giao hàng", // Trạng thái đơn hàng
      estimatedTime: estimatedTimeInHours.toFixed(2), // Thời gian giao hàng (giờ)
      createdAt: new Date(), // Thời gian đặt hàng
    };

    // Tham chiếu tới collection orderHistory
    const orderHistoryRef = doc(FIREBASE_FIRESTORE, "orderHistory", orderID);

    // Thêm dữ liệu vào orderHistory
    await setDoc(orderHistoryRef, orderData);

    // Xóa giỏ hàng
    await updateDoc(cartRef, { itemscart: [] });

    console.log("Đơn hàng đã được tạo thành công!");

    // Tự động cập nhật trạng thái sau thời gian giao hàng dự kiến
    setTimeout(async () => {
      await updateDoc(orderHistoryRef, { type: "Đã giao hàng" });
      console.log(`Đơn hàng ${orderID} đã chuyển thành "Đã giao hàng".`);
    }, estimatedTimeInMs);
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
  }
};

export const getOrderHistoryByUid = async (uid) => {
  try {
    // Tham chiếu tới collection "orderHistory"
    const orderHistoryRef = collection(FIREBASE_FIRESTORE, "orderHistory");

    // Tạo truy vấn với điều kiện `uid`
    const orderQuery = query(orderHistoryRef, where("uid", "==", uid));

    // Lấy dữ liệu
    const querySnapshot = await getDocs(orderQuery);

    // Xử lý dữ liệu thành danh sách
    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt;

      if (createdAt instanceof Timestamp) {
        data.createdAt = createdAt.toDate().toLocaleString();
      }

      return {
        id: doc.id, // Lấy ID của tài liệu
        ...data, // Lấy dữ liệu bên trong, bao gồm createdAt đã được format
      };
    });

    return orders; // Trả về danh sách đơn hàng
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đặt hàng:", error);
    return [];
  }
};
export const updateUserName = async (userId, newName) => {
  const userDocRef = doc(FIREBASE_FIRESTORE, "users", userId);

  try {
    await updateDoc(userDocRef, { username: newName });
    return "Tên người dùng đã được cập nhật thành công.";
  } catch (error) {
    console.error("Lỗi khi cập nhật tên người dùng:", error);
    throw error;
  }
};
export const changePassword = async (token, currentPassword, newPassword) => {
  const user = FIREBASE_AUTH.currentUser;

  if (!user) {
    throw new Error("Người dùng chưa đăng nhập.");
  }

  try {
    // Lấy email từ người dùng hiện tại
    const email = user.email;

    // Xác thực lại mật khẩu cũ
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, currentPassword);

    // Cập nhật mật khẩu mới
    await updatePassword(user, newPassword);
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      throw new Error("Mật khẩu hiện tại không chính xác.");
    } else {
      throw new Error(
        "Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại sau."
      );
    }
  }
};
