import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState, useContext } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppContext } from "../contexts/AppContext";
import { FIREBASE_AUTH } from "../api/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
const { width, height } = Dimensions.get("window");
export default function Login({ navigation }) {
  const [isPasswordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AppContext);
  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;

      // Lưu token vào context và AsyncStorage
      login(user.uid);
      navigation.navigate("BottomNavigator"); // Chuyển hướng tới trang chính
      setLoading(false);
    } catch (error) {
      console.log("Error logging in: ", error);
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
            onChangeText={(text) => setEmail(text)}
          />
        </Animated.View>

        <Text style={styles.TextInput}>Mật khẩu</Text>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={password}
            secureTextEntry={isPasswordVisible}
            onChangeText={(text) => setPassword(text)}
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
      <Text style={styles.forgotPW}>Quên mật khẩu</Text>

      <Animated.View
        entering={FadeInDown.delay(600).duration(1000).springify()}
        style={{ flexDirection: "row", marginTop: 10 }}
      >
        <Text style={styles.orText}>Hoặc bạn có thể đăng nhập bằng</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png",
              }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
              }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(800).duration(1000).springify()}
        style={{ flexDirection: "row", marginTop: 10 }}
      >
        <Text style={styles.signUpText}>
          Bạn chưa có tài khoản? Hãy bấm ở nút{"  "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signUpLink}>Đăng ký</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(1000).duration(1000).springify()}
        style={styles.buttonLogin}
      >
        <TouchableOpacity onPress={handleLogin} disabled={loading}>
          {loading ? (
            <Text style={styles.loadingText}>Đang đăng nhập...</Text>
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
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
    height: height * 0.2,
    marginBottom: 30,
    width: "100%",
    backgroundColor: "#12382B",
  },
  logo: {
    width: width * 0.3,
    height: height * 0.15,
    marginTop: 35,
  },
  textHeader: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    marginHorizontal: width * 0.1,
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
    fontSize: width * 0.04,
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
  forgotPW: {
    color: "#eb8ec7",
    textAlign: "right",
    marginBottom: 20,
    width: "80%",
    textShadowColor: "#e29fc8",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  buttonLogin: {
    height: height * 0.06,
    width: "50%",
    backgroundColor: "rgba(18, 56, 43, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 80,
  },
  buttonText: {
    color: "#000",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  loadingText: {
    color: "#000",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  orText: {
    fontSize: width * 0.04,
    marginVertical: 15,
    color: "#000",
    fontWeight: "bold",
    left: 70,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "60%",
    marginVertical: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
  signUpText: {
    fontSize: width * 0.04,
    color: "#000",
    fontWeight: "bold",
  },
  signUpLink: {
    fontSize: width * 0.04,
    color: "#EC1C1C",
    fontWeight: "bold",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
});
