import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useApp } from "../contexts/AppContext";
import { orderHistory } from "../api/firebase";
let debounceTimeout;

export default function PaymentScreen({ route, navigation }) {
  const { totalCart } = route.params;
  const { token } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Gợi ý địa chỉ
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Hàm gọi API lấy gợi ý địa chỉ (dùng fetch)
  const fetchSuggestions = async (text) => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          text
        )}&countrycodes=VN&format=json&addressdetails=1`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0 (your_email@example.com)",
          },
        }
      );

      const data = await response.json();
      const formattedSuggestions = data.map((item) => ({
        displayName: item.display_name,
      }));
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  const handleAddressChange = (text) => {
    setAddress(text);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      fetchSuggestions(text);
    }, 300); // Đợi 300ms sau khi ngừng nhập
  };

  const handleSelectSuggestion = (suggestion) => {
    setAddress(suggestion.displayName);
    setSuggestions([]);
  };
  const handleOrder = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy userId. Vui lòng đăng nhập lại!");
      return;
    }

    try {
      // Gọi hàm đặt hàng
      await orderHistory(token, name, phone, address);
      Alert.alert(
        "Đặt hàng thành công",
        `Cảm ơn bạn đã đặt hàng!\nTên: ${name}\nSĐT: ${phone}\nĐịa chỉ: ${address}\nPhương thức: ${
          paymentMethod === "cash" ? "Thanh toán trực tiếp" : "Ví điện tử"
        }\nTổng tiền: ${totalCart}đ`
      );
      navigation.goBack(); // Điều hướng về trang trước
    } catch (error) {
      console.error("Lỗi khi đặt hàng :", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đặt hàng, vui lòng thử lại.");
    }
  };
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconContainer}
        >
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Thanh Toán</Text>
      </View>
      <Text style={styles.label}>Tên người dùng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Text style={styles.label}>Địa chỉ giao hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ giao hàng"
        value={address}
        onChangeText={handleAddressChange}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
              <Text style={styles.suggestionItem}>{item.displayName}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}
      <Text style={styles.label}>Phương thức thanh toán</Text>
      <View style={styles.radioContainer}>
        <View style={styles.radioItem}>
          <RadioButton
            value="cash"
            status={paymentMethod === "cash" ? "checked" : "unchecked"}
            onPress={() => setPaymentMethod("cash")}
          />
          <Text>Thanh toán trực tiếp</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton
            value="e-wallet"
            status={paymentMethod === "e-wallet" ? "checked" : "unchecked"}
            onPress={() => {
              Alert.alert(
                "Thông báo",
                "Hiện tại, phương thức này chưa hỗ trợ."
              );
            }}
          />
          <Text>Thanh toán qua ví điện tử</Text>
        </View>
      </View>
      <Text style={styles.totalText}>
        Tổng tiền phải trả: {formatNumber(totalCart)}đ
      </Text>
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.orderButtonText}>Đặt Hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    flex: 1,
    marginTop: 20,
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  suggestionsContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 150,
    backgroundColor: "#fff",
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#58ACD6",
    textAlign: "center",
    marginVertical: 16,
  },
  orderButton: {
    backgroundColor: "#58ACD6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  disabledText: {
    color: "#aaa",
    textDecorationLine: "line-through",
  },
});
