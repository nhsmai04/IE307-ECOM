import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { getProducts } from "../api/firebase"; // Giả sử bạn lưu hàm getProducts ở file firebase.js
import Icon from "react-native-vector-icons/FontAwesome";
import images from "../assets/images/imageMap";

export default function Products({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts();
      if (products) {
        setData(Object.values(products)); // Chuyển dữ liệu thành mảng nếu cần
      }
    };

    fetchData();
  }, []);

  const getImage = (imageName) => {
    return images[imageName];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}>Trà</Text>
      </View>

      <View>
        <Text style={styles.title}>BEST SELLER / NEW</Text>
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetailProduct", { item })}
          >
            <View style={styles.item}>
              <View style={styles.imageContainer}>
                <Image source={getImage(item.image)} style={styles.image} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.priceProduct}>{item.price} đ</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Icon name="plus-circle" size={30} color="#000" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        horizontal
        contentContainerStyle={{ columnGap: 10 }}
        keyExtractor={(item, index) => index.toString()}
      />

      <View>
        <Text style={styles.title2}>DRINK</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetailProduct", { item })}
          >
            <View style={styles.item}>
              <View style={styles.imageContainer}>
                <Image source={getImage(item.image)} style={styles.image} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.priceProduct}>{item.price} đ</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Icon name="plus-circle" size={30} color="#000" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        horizontal
        contentContainerStyle={{ columnGap: 10 }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    marginTop: 50,
    marginBottom: 20,
    borderColor: "#6BA397",
  },
  headertitle: {
    fontSize: 24,
    fontFamily: "Lato-Bold",
    marginVertical: 10,
    marginLeft: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    marginBottom: 20,
    color: "red",
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  title2: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    marginBottom: 20,
    color: "red",
    paddingBottom: 10,
    borderBottomWidth: 2,
    marginTop: 20,
  },
  item: {
    width: 182,
    height: 240,
    marginEnd: 22,
    borderRadius: 10,
    backgroundColor: "rgba(134,204,174,0.2)",
  },
  imageContainer: {
    flex: 1,
    width: 170,
    marginLeft: 5,
    marginTop: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  info: {
    paddingLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
    paddingLeft: 5,
    color: "#333333",
  },
  priceProduct: {
    fontSize: 18,
    fontWeight: "Lato-Regular",
    marginBlock: 5,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 10,
    paddingLeft: 5,
    paddingBottom: 10,
  },
  addBtn: {
    position: "absolute",
    bottom: 10,
    right: 40,
    paddingBottom: 5,
  },
});