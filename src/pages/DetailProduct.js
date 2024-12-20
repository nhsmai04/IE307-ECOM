import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
export default function DetailProduct({ navigation }) {
  const route = useRoute();
  const { item } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

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
      <Image
        source={{
          uri: "https://xingfutangvietnam.com/wp-content/uploads/2021/06/tra-sua-tran-chau-e1685431912430.png",
        }}
        style={styles.image}
      />
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}> 3000{item.price}đ</Text>
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
          <Text style={styles.description}>Giới thiệu:</Text>
          <Text style={styles.desText}>{item.description}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.orderBtn}>
        <Text style={styles.btnText}>ĐẶT HÀNG</Text>
      </TouchableOpacity>

      {/* Overlay Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.backgroundOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <View style={styles.headerContent}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>Tổng số lượt bình chọn:</Text>
                <Text style={styles.modalTitleNumber}>7.1k</Text>
              </View>
              <Text style={styles.modalRating}>4.9 trên 5</Text>
              <View style={styles.starRow}>
                <Text style={styles.starText}>Bấm để bình chọn</Text>
                <View style={styles.starIcon}>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Icon name="star-o" size={30} color="rgba(0, 0, 0, 0.5)" />
                  ))}
                </View>
              </View>
            </View>

            <ScrollView
              style={styles.commentSection}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              {Array.from({ length: 20 }, (_, index) => (
                <View key={index} style={styles.commentBox}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={{
                        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHylL97CjJ3JctnR5MzdMVvsJSeR5-TnVL4w&s",
                      }}
                      style={styles.commentAvatar}
                    />
                    <Text style={styles.commentUser}>Tên người dùng</Text>
                  </View>
                  <Text style={styles.commentText}>
                    Uống cũng tạm được, view khá là đẹp. Mỗi tội nhân viên do
                    đông quá hay gì mà có vẻ hơi lơ là với khách khi khách hỏi
                    hay yêu cầu gì đó
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    aspectRatio: 1,
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
  },
  commentBox: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 14,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 16,
  },
  commentText: {
    fontSize: 14,
    textAlign: "justify",
    fontWeight: "bold",
  },
});
