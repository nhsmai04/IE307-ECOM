import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { getProductsByType } from "../api/firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import images from "../assets/images/imageMap";

export default function Products({ navigation, type }) {
  const [bestNewData, setBestNewData] = useState([]);
  const [otherData, setOtherData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getProductsByType(type);
        const bestNew = products.filter(
          (product) => product.Cate === "1" || product.Cate === "2"
        );
        const others = products.filter(
          (product) =>
            !product.Cate || (product.Cate !== "1" && product.Cate !== "2")
        );
        setBestNewData(bestNew);
        setOtherData(others);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchData();
  }, [type]);

  const getImage = (imageName) => {
    return images[imageName];
  };

  const renderProductItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("DetailProduct", { item })}
      >
        <View style={styles.imageContainer}>
          <Image source={getImage(item.image)} style={styles.image} />
          {item.Cate === "1" && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Best Seller</Text>
            </View>
          )}
          {item.Cate === "2" && (
            <View style={styles.tag2}>
              <Text style={styles.tagText}>New</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.priceProduct}>{item.price} đ</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addBtn}>
        <Icon name="plus-circle" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}>{type.toUpperCase()}</Text>
      </View>

      <View>
        <Text style={styles.title}>BEST SELLER / NEW</Text>
      </View>

      <FlatList
        data={bestNewData}
        renderItem={renderProductItem}
        horizontal
        contentContainerStyle={{ columnGap: 10 }}
        keyExtractor={(item) => item.name}
      />

      <View>
        <Text style={styles.title2}>DRINK</Text>
      </View>
      <FlatList
        data={otherData}
        renderItem={renderProductItem}
        horizontal
        contentContainerStyle={{ columnGap: 10 }}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
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
  tag: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  tag2: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(27, 117, 186, 0.7)",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
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
    bottom: 30,
    right: 40,
    paddingBottom: 5,
  },
});
