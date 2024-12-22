import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo Context cho cả giỏ hàng và token
export const AppContext = createContext();

// Custom hook để sử dụng Context
export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Lưu token của người dùng
  const [cart, setCart] = useState([]); // Lưu danh sách sản phẩm trong giỏ hàng

  // Kiểm tra token khi load ứng dụng
  useEffect(() => {
    const checkTokenAndCart = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const savedCart = await AsyncStorage.getItem("cart");

      // Nếu có token, cập nhật token vào context
      if (savedToken) {
        setToken(savedToken);
      }

      // Nếu có giỏ hàng, cập nhật giỏ hàng vào context
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    };

    checkTokenAndCart();
  }, []);

  // Đăng nhập và lưu token vào Context và AsyncStorage
  const saveCredentials = async (email, password) => {
    try {
      const credentials = { email, password };
      await AsyncStorage.setItem(
        "userCredentials",
        JSON.stringify(credentials)
      );
    } catch (error) {
      console.error("Failed to save credentials:", error);
    }
  };

  // Tải thông tin đăng nhập
  const loadCredentials = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem("userCredentials");
      return storedCredentials ? JSON.parse(storedCredentials) : null;
    } catch (error) {
      console.error("Failed to load credentials:", error);
      return null;
    }
  };

  // Đăng nhập
  const login = async (newToken) => {
    setToken(newToken);
    await AsyncStorage.setItem("token", newToken);
  };

  // Đăng xuất
  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (item) => {
    const newItem = {
      itemId: item.id_drinks,
      name: item.name,
      image: item.image,
      size: item.size,
      ice: item.ice,
      sweetness: item.sweetness,
      toppings: item.toppings,
      price: item.price,
      quantity: 1,
      total: item.total,
    };

    const existingProductIndex = cart.findIndex((cartItem) => {
      return (
        cartItem.itemId === newItem.itemId &&
        cartItem.size === newItem.size &&
        cartItem.ice === newItem.ice &&
        cartItem.sweetness === newItem.sweetness &&
        JSON.stringify(cartItem.toppings) === JSON.stringify(newItem.toppings)
      );
    });

    if (existingProductIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      updatedCart[existingProductIndex].total =
        updatedCart[existingProductIndex].quantity *
        (parseFloat(updatedCart[existingProductIndex].price) +
          updatedCart[existingProductIndex].toppings.reduce(
            (acc, topping) => acc + parseFloat(topping.value),
            0
          ));
      setCart(updatedCart);
      AsyncStorage.setItem("cart", JSON.stringify(updatedCart)); // Cập nhật giỏ hàng vào AsyncStorage
    } else {
      newItem.total =
        parseFloat(newItem.price) +
        newItem.toppings.reduce(
          (acc, topping) => acc + (parseFloat(topping.value) || 0),
          0
        );
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      AsyncStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu giỏ hàng vào AsyncStorage
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (item) => {
    const updatedCart = cart.filter((cartItem) => {
      return !(
        cartItem.itemId === item.id_drinks &&
        cartItem.size === item.size &&
        cartItem.ice === item.ice &&
        cartItem.sweetness === item.sweetness &&
        JSON.stringify(cartItem.toppings) === JSON.stringify(item.toppings)
      );
    });
    setCart(updatedCart);
    AsyncStorage.setItem("cart", JSON.stringify(updatedCart)); // Cập nhật giỏ hàng vào AsyncStorage
  };

  // Tính tổng tiền giỏ hàng
  const calculateTotal = () => {
    return cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  return (
    <AppContext.Provider
      value={{
        token,
        cart,
        addToCart,
        removeFromCart,
        calculateTotal,
        login,
        logout,
        saveCredentials,
        loadCredentials,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
