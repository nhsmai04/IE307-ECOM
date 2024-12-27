import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getOrderHistoryByUid } from "../api/firebase";
import { useApp } from "../contexts/AppContext";
export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useApp();
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await getOrderHistoryByUid(token);
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching order data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>
        Order ID: <Text style={styles.userText}>{item.id}</Text>
      </Text>
      <Text style={styles.orderText}>
        Ngày đặt đơn hàng: <Text style={styles.userText}>{item.createdAt}</Text>
      </Text>
      <Text style={styles.orderText}>
        Tổng tiền:{" "}
        <Text style={styles.userText}>{formatNumber(item.totalAmount)} đ</Text>
      </Text>
      <Text style={styles.orderText}>
        Tình trạng hàng: <Text style={styles.userText}>{item.type}</Text>
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="#a04bfe"
          style={{ marginBottom: 40 }}
        />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  orderItem: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#000",
  },
  orderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  userText: {
    color: "#004437",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});
