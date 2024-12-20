import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import images from "../assets/images/imageMap";
import  {useApp}  from "../contexts/AppContext";
export default function DetailProduct({ navigation }) {
  const route = useRoute();
  const {addToCart} = useApp();
  const { item } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedIce, setSelectedIce] = useState("Ít đá");
  const [selectedSweetness, setSelectedSweetness] = useState("Bình thường");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [total, setTotal] = useState(0);


  const AddItemtoCart = () =>{
    const cartItem  = {
      id: item.id,
      name: item.name,  
      image: item.image,
      price: item.price,
      size: selectedSize,
      ice: selectedIce,
      sweetness: selectedSweetness,
      toppings: selectedToppings,
      total: total,
    }
    addToCart(cartItem);
    
  }

  const getImage = (imageName) => {
    return images[imageName];
  };

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const existingToppingIndex = prev.findIndex(
        (item) => item.nametopping === topping.nametopping
      );
      if (existingToppingIndex > -1) {
        // Nếu topping đã được chọn trước đó, tăng số lượng
        const updatedToppings = [...prev];
        updatedToppings[existingToppingIndex].quantity += 1;
        return updatedToppings;
      } else {
        // Nếu topping chưa được chọn, thêm mới vào danh sách
        return [...prev, { ...topping, quantity: 1 }];
      }
    });
  };

  const removeTopping = (topping) => {
    setSelectedToppings((prev) =>
      prev.filter((item) => item.nametopping !== topping.nametopping)
    );
  };

  useEffect(() => {
    let newTotal = parseFloat(item.price);
    selectedToppings.forEach((topping) => {
      newTotal += parseFloat(topping.value) * topping.quantity;
    });
    setTotal(newTotal);
  }, [selectedToppings]);

  return (
    <View style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="heart" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Image source={getImage(item.image)} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}đ</Text>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.rating}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Icon name="star-o" size={32} color="#D8BB7A" />
            </TouchableOpacity>
            <Text style={styles.ratingText}>(4.9)</Text>
            <Icon name="truck" size={32} color="#D8BB7A" paddingLeft={60} />
            <Text style={styles.ratingText}>Miễn phí vận chuyển</Text>
          </View>
        </View>

        <View style={styles.descriptionBox}>
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => setDetailsVisible(true)}
          >
            <Text style={styles.detailsBtnText}>Thêm chi tiết</Text>
          </TouchableOpacity>
          <Text style={styles.description}>Giới thiệu:</Text>
          <Text style={styles.desText}>{item.description}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.orderBtn}>
        <Text style={styles.btnText}>ĐẶT HÀNG</Text>
      </TouchableOpacity>

      {/* Modal for Details */}
      <Modal transparent={true} visible={detailsVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.backgroundOverlay}
            onPress={() => setDetailsVisible(false)}
          />
          <View style={styles.modalContainerDetails}>
            <Text style={styles.modalTitle}>Chọn chi tiết</Text>

            <ScrollView style={styles.scrollViewModal} contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalSubtitle}>Kích thước</Text>
              <View style={styles.optionsRow}>
                {[
                  { label: "M", value: "M" },
                  { label: "L", value: "L" },
                ].map((size) => (
                  <TouchableOpacity
                    key={size.value}
                    style={
                      selectedSize === size.value
                        ? styles.optionBtnSelected
                        : styles.optionBtn
                    }
                    onPress={() => setSelectedSize(size.value)}
                  >
                    <Text style={styles.optionText}>{size.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalSubtitle}>Chọn đá</Text>
              <View style={styles.optionsRow}>
                {["Bình thường", "Ít đá", "Đá riêng"].map((ice) => (
                  <TouchableOpacity
                    key={ice}
                    style={
                      selectedIce === ice
                        ? styles.optionBtnSelected
                        : styles.optionBtn
                    }
                    onPress={() => setSelectedIce(ice)}
                  >
                    <Text style={styles.optionText}>{ice}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalSubtitle}>Chọn độ ngọt</Text>
              <View style={styles.optionsRow}>
                {["Bình thường", "70%", "50%"].map((sweetness) => (
                  <TouchableOpacity
                    key={sweetness}
                    style={
                      selectedSweetness === sweetness
                        ? styles.optionBtnSelected
                        : styles.optionBtn
                    }
                    onPress={() => setSelectedSweetness(sweetness)}
                  >
                    <Text style={styles.optionText}>{sweetness}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalSubtitle}>Chọn topping</Text>
              <Text>Topping 3k/mỗi loại</Text>
              <View style={styles.optionsRow}>
                {[
                  { nametopping: "Trân châu đen", value: "3000" },
                  { nametopping: "Thạch AIYU", value: "3000" },
                  { nametopping: "Sương sáo", value: "3000" },
                ].map((topping) => (
                  <View key={topping.nametopping} style={styles.toppingContainer}>
                    <TouchableOpacity
                      style={
                        selectedToppings.some((item) => item.nametopping === topping.nametopping)
                          ? styles.optionBtnSelected
                          : styles.optionBtn
                      }
                      onPress={() => toggleTopping(topping)}
                    >
                      <Text style={styles.optionText}>
                        {topping.nametopping}
                        {selectedToppings.some((item) => item.nametopping === topping.nametopping) && (
                          <Text> x{selectedToppings.find((item) => item.nametopping === topping.nametopping).quantity}</Text>
                        )}
                      </Text>
                    </TouchableOpacity>
                    {selectedToppings.some((item) => item.nametopping === topping.nametopping) && (
                      <TouchableOpacity onPress={() => removeTopping(topping)}>
                        <Icon name="times" size={16} color="#000" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
              <Text>Topping 5k/mỗi loại</Text>
              <View style={styles.optionsRow}>
                {[
                  { nametopping: "Trân châu Olong", value: "5000" },
                  { nametopping: "Phô mai viên", value: "5000" },
                  { nametopping: "Pudding", value: "5000" },
                ].map((topping) => (
                  <View key={topping.nametopping} style={styles.toppingContainer}>
                    <TouchableOpacity
                      style={
                        selectedToppings.some((item) => item.nametopping === topping.nametopping)
                          ? styles.optionBtnSelected
                          : styles.optionBtn
                      }
                      onPress={() => toggleTopping(topping)}
                    >
                      <Text style={styles.optionText}>
                        {topping.nametopping}
                        {selectedToppings.some((item) => item.nametopping === topping.nametopping) && (
                          <Text> x{selectedToppings.find((item) => item.nametopping === topping.nametopping).quantity}</Text>
                        )}
                      </Text>
                    </TouchableOpacity>
                    {selectedToppings.some((item) => item.nametopping === topping.nametopping) && (
                      <TouchableOpacity onPress={() => removeTopping(topping)}>
                        <Icon name="times" size={16} color="#000" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
              <Text style={styles.totalPrice}>Tổng tiền: {total} VND</Text>
            </ScrollView>
            <TouchableOpacity style={styles.orderBtnModal} onPress={() => AddItemtoCart()}>
              <Text style={styles.btnText}>ĐẶT HÀNG</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
    position: "absolute",
    top: 30,
    zIndex: 999,
    width: 370,
  },
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
    backgroundColor: "#E1CA90",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  details: {
    width: 360,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
    width: 360,
    top: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  price: {
    fontSize: 26,
    color: "rgba(0, 0, 0, 0.5)",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
    width: 340,
    top: 5,
  },
  rating: {
    top: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  ratingText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontFamily: "Lato-Bold",
    fontSize: 20,
    marginLeft: 10,
    paddingBottom: 5,
  },
  detailsBtn: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#D8BB7A',
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  descriptionBox: {
    top: 50,
    marginLeft: 20,
  },
  description: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.7)",
  },
  desText: {
    fontSize: 18,
    fontFamily: "Lato-Bold",
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "justify",
    marginBottom: 20,
  },
  orderBtn: {
    backgroundColor: "#58ACD6",
    width: 360,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  orderBtnModal: {
    backgroundColor: "#58ACD6",
    width: "100%",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: 20,
  },
  btnText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backgroundOverlay: {
    flex: 1,
  },
  modalContainer: {
    height: "60%",
    display:'flex',
    justifyContent:"flex-end",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerContent: {
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.5)",
  },
  modalTitleNumber: {
    fontSize: 24,
    fontWeight: "bold",
    right: 0,
    color: "rgba(0, 0, 0, 0.5)",
  },
  modalRating: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "center",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  starText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  starIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
  },
  commentSection: {
    flex: 1,
    marginTop: 16,
  },
  commentBox: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalText: {
    marginTop: 20,
    fontSize: 16,
    color: '#901D00',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  optionBtn: {
    
    backgroundColor: '#D8BB7A',
    borderRadius: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    
  },
  modalContainerDetails: {
    height: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  scrollViewModal: {
    width: "100%",
    padding: 10,
  },
  scrollViewContent: {
    paddingBottom: 80, // Đảm bảo có đủ khoảng trống để nút ĐẶT HÀNG không bị che khuất
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  optionBtn: {
    padding: 10,
    backgroundColor: "#D8BB7A",
    borderRadius: 5,
    width: "48%", // Đảm bảo mỗi item chiếm 48% chiều rộng để có khoảng cách giữa các item
    marginBottom: 10, // Khoảng cách giữa các hàng
  },
  optionBtnSelected: {
    padding: 10,
    backgroundColor: "#58ACD6",
    borderRadius: 5,
    width: "48%", // Đảm bảo mỗi item chiếm 48% chiều rộng để có khoảng cách giữa các item
    marginBottom: 10, // Khoảng cách giữa các hàng
  },
  toppingContainer: {
    flexDirection: "row",
    alignItems: "center",


    width:"50%"
  },
  totalPrice: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
});
