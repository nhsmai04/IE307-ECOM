import React, { createContext, useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

// Tạo Context cho cả giỏ hàng và token
export const AppContext = createContext();

// Custom hook để sử dụng Context
export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Lưu token của người dùng
  const [cart, setCart] = useState([]); // Lưu danh sách sản phẩm trong giỏ hàng

  // Kiểm tra token khi load ứng dụng
  //   useEffect(() => {
  //     const checkToken = async () => {
  //       const savedToken = await AsyncStorage.getItem('token');
  //       if (savedToken) {
  //         setToken(savedToken);
  //       }
  //     };
  //     checkToken();
  //   }, []);

  //   // Đăng nhập và lưu token vào Context và AsyncStorage
  //   const login = async (newToken) => {
  //     setToken(newToken);
  //     await AsyncStorage.setItem('token', newToken);
  //   };

  //   // Đăng xuất và xóa token
  //   const logout = async () => {
  //     setToken(null);
  //     await AsyncStorage.removeItem('token');
  //   };

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
    } else {
      newItem.total =
        parseFloat(newItem.price) +
        newItem.toppings.reduce(
          (acc, topping) => acc + (parseFloat(topping.value) || 0),
          0
        );
      setCart([...cart, newItem]);
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
      value={{ token, cart, addToCart, calculateTotal, removeFromCart }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;