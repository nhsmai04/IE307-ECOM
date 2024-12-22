import { View, Text, StyleSheet, Button } from "react-native";
import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext"; // Import AppContext

export default function Profilestack({ navigation }) {
  const { logout } = useContext(AppContext); // Sử dụng hook để lấy logout từ AppContext

  const handleLogout = async () => {
    try {
      await logout(); // Xóa token và giỏ hàng khỏi AsyncStorage
      navigation.replace("Login"); // Chuyển về trang Login
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
