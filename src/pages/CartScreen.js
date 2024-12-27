import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useApp } from "../contexts/AppContext";
import { addToCart, removeFromCart, updateCart } from "../api/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FIREBASE_FIRESTORE } from "../api/firebase";
import images from "../assets/images/imageMap";

export default function CartScreen({ navigation }) {
  const { token, handleCartLenght } = useApp();
  const [cartData, setCartData] = useState([]);
  const [totalCart, setTotalCart] = useState(0);

  const headerHeight = useRef(new Animated.Value(60)).current; // Chiều cao mặc định của header (60px)
  const getImage = (imageName) => {
    return images[imageName];
  };

  useEffect(() => {
    if (!token) {
      console.log("Token không hợp lệ!");
      return;
    }

    const cartRef = doc(FIREBASE_FIRESTORE, "cart", token);

    const unsubscribe = onSnapshot(
      cartRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const items = docSnapshot.data().itemscart || [];
          const totalQuantity = items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          handleCartLenght(totalQuantity);
          setCartData(items);
        } else {
          setCartData([]);
        }
      },
      (error) => {
        console.error("Lỗi khi lắng nghe giỏ hàng:", error);
      }
    );

    return () => unsubscribe();
  }, [token]);

  useEffect(() => {
    const total = cartData.reduce((sum, item) => sum + item.total, 0);
    setTotalCart(total);
  }, [cartData]);

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCart(token, item, newQuantity);
  };

  const handleCheckout = () => {
    navigation.navigate("PaymentScreen", { totalCart: totalCart });
  };

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    if (currentOffset > 10 && headerHeight._value !== 0) {
      // Ẩn header
      Animated.timing(headerHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (currentOffset <= 10 && headerHeight._value !== 60) {
      // Hiện header
      Animated.timing(headerHeight, {
        toValue: 60,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={getImage(item.image)} style={styles.image} />
      </View>
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
          Giá: <Text style={styles.orderText}>{formatNumber(item.price)}đ</Text>
        </Text>
        <Text style={styles.itemText}>
          Tổng:{" "}
          <Text style={styles.orderText}>{formatNumber(item.total)}đ</Text>
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={async () => {
              await updateQuantity(item, item.quantity - 1);
            }}
          >
            <Icon name="minus" size={16} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={async () => {
              await updateQuantity(item, item.quantity + 1);
            }}
          >
            <Icon name="plus" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={async () => await removeFromCart(token, item)}>
        <Icon name="times" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Text style={styles.headerText}>Giỏ hàng của bạn</Text>
      </Animated.View>
      <View style={styles.content}>
        <FlatList
          data={cartData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        <View style={styles.checkoutContainer}>
          <Text style={styles.totalText}>
            Tổng cộng: {formatNumber(totalCart)}đ
          </Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#58ACD6",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: 16,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingTop: 60, // Giữ khoảng cách bằng chiều cao mặc định của header
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderText: {
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  checkoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: "#58ACD6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
