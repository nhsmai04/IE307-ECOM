import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, { FadeInDown } from "react-native-reanimated";
import { FIREBASE_AUTH } from "../api/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
export default function Register({ navigation }) {
  const [isPasswordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const auth = FIREBASE_AUTH;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert("Đăng ký thành công");
      navigation.navigate("Login"); // Điều hướng sang trang đăng nhập
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.textHeader}>
        Chào mừng bạn đã đến với cửa hàng của chúng tôi
      </Text>

      <View>
        <Text style={styles.TextInput}>Email</Text>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </Animated.View>

        <Text style={styles.TextInput}>Mật khẩu</Text>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            secureTextEntry={isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Icon
              name={isPasswordVisible ? "eye" : "eye-slash"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.TextInput}>Mật khẩu xác nhận</Text>
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            secureTextEntry={isPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Icon
              name={isPasswordVisible ? "eye" : "eye-slash"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(800).duration(1000).springify()}
        style={{ flexDirection: "row", marginTop: 30 }}
      >
        <Text style={styles.signUpText}>
          Bạn đã có tài khoản? Hãy bấm ở nút{"   "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signUpLink}> Đăng nhập</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(1000).duration(1000).springify()}
        style={styles.buttonLogin}
      >
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    height: 150,
    marginBottom: 30,
    width: "100%",
    backgroundColor: "#12382B",
  },
  logo: {
    width: 110,
    height: 110,
    marginTop: 35,
  },
  textHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    marginHorizontal: 55,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 20,
    width: "80%",
    backgroundColor: "rgba(217, 217, 217, 0.5)",
  },
  TextInput: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    width: "80%",
    marginLeft: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
  },
  buttonLogin: {
    height: 50,
    width: "50%",
    backgroundColor: "rgba(18, 56, 43, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 80,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    left: 10,
  },
  signUpLink: {
    fontSize: 16,
    color: "#EC1C1C",
    fontWeight: "bold",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
});