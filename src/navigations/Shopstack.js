import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useApp } from "../contexts/AppContext";

export default function Shopstack() {
  const { cart, removeFromCart } = useApp();
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemText}>
          Tên sản phẩm: <Text style={styles.orderText}>{item.name}</Text>
        </Text>
        <Text style={styles.itemText}>
          Kích thước: <Text style={styles.orderText}>{item.size}</Text>
        </Text>
        <Text style={styles.itemText}>
          Đá: <Text style={styles.orderText}>{item.ice}</Text>
        </Text>
        <Text style={styles.itemText}>
          Độ ngọt: <Text style={styles.orderText}>{item.sweetness}</Text>
        </Text>
        <Text style={styles.itemText}>
          Topping:{" "}
          <Text style={styles.orderText}>
            {item.toppings
              ? item.toppings.map((topping) => topping.nametopping).join(", ")
              : "Không có topping"}
          </Text>
        </Text>
        <Text style={styles.itemText}>
          Số lượng: <Text style={styles.orderText}>{item.quantity}</Text>
        </Text>
        <Text style={styles.itemText}>
          Tổng:{" "}
          <Text style={styles.orderText}>{formatNumber(item.total)}đ</Text>
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item)}>
        <Icon name="times" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Lato-Bold",
    marginBottom: 5,
  },
  orderText: {
    fontFamily: "Lato-Regular",
  },
});