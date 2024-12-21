import { View, Text, StyleSheet, Button } from "react-native";
import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext"; // Import AppContext

export default function Profilestack({ navigation }) {
  const { logout } = useContext(AppContext); // Sử dụng hook để lấy logout từ AppContext

  const handleLogout = async () => {
    try {
      // Gọi logout từ AppContext
      await logout(); // Đảm bảo logout xóa token và giỏ hàng khỏi AsyncStorage

      // Sau khi logout, chuyển hướng về trang login
      navigation.replace("Login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
