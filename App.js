import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigations/AppNavigator";
import { useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import AppProvider from "./src/contexts/AppContext";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./src/api/firebase";
import { useEffect } from "react";
const loadFonts = () => {
  return Font.loadAsync({
    "Lato-Regular": require("./src/assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./src/assets/fonts/Lato-Bold.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [user, setUser] = useState(null); // Trạng thái người dùng
  const [authLoading, setAuthLoading] = useState(true); // Trạng thái kiểm tra auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      setUser(currentUser); // Cập nhật trạng thái người dùng
      setAuthLoading(false); // Dừng trạng thái loading auth
    });

    return unsubscribe; // Dọn dẹp listener khi unmount
  }, []);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator initialRouteName={user ? "BottomNavigator" : "Login"} />
      </NavigationContainer>
    </AppProvider>
  );
}
