import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import {
  getUserFromFirestore,
  updateUserName,
  changePassword,
} from "../api/firebase";
import Icon from "react-native-vector-icons/FontAwesome";
const AvatarWithLetter = ({
  name,
  size = 70,
  backgroundColor = "#004437",
  textColor = "#fff",
}) => {
  const getInitial = () => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
      ]}
    >
      <Text
        style={[styles.avatarLetter, { fontSize: size / 2, color: textColor }]}
      >
        {getInitial()}
      </Text>
    </View>
  );
};

export default function ProfileScreen({ navigation }) {
  const { logout, token } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const handleLogout = async () => {
    try {
      setUserInfo(null);
      setLoading(true);
      await logout();
      navigation.replace("Login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openPasswordModal = () => setPasswordModalVisible(true);
  const closePasswordModal = () => setPasswordModalVisible(false);

  const handleSaveNewName = async () => {
    if (!newName.trim()) {
      Alert.alert("Thông báo", "Tên người dùng không được để trống.");
      return;
    }

    try {
      await updateUserName(token, newName);
      setUserInfo({ ...userInfo, username: newName });
      Alert.alert("Thành công", "Tên người dùng đã được cập nhật.");
      closeModal();
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể cập nhật tên người dùng. Vui lòng thử lại."
      );
      console.error("Lỗi cập nhật tên người dùng:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.log("Token không hợp lệ, dừng việc lấy thông tin người dùng.");
        return;
      }

      try {
        const data = await getUserFromFirestore(token); // Gọi hàm lấy thông tin
        setUserInfo(data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="#a04bfe"
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View>
        <Text>Không thể tải thông tin người dùng.</Text>
      </View>
    );
  }
  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập mật khẩu mới và xác nhận.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Thông báo", "Mật khẩu mới không khớp.");
      return;
    }

    try {
      await changePassword(token, currentPassword, newPassword); // Gọi API đổi mật khẩu
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi thành công.");
      closePasswordModal();
    } catch (error) {
      Alert.alert("Lỗi", error.message);
      console.error("Lỗi thay đổi mật khẩu:", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#008B8B", paddingTop: 40 }}>
        <Text style={styles.title}>Tài khoản</Text>
        <View style={styles.user}>
          <AvatarWithLetter name={userInfo.username} size={100} />
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{userInfo.username}</Text>
            <TouchableOpacity onPress={openModal}>
              <Icon
                name="pencil"
                size={24}
                color="#000"
                style={styles.iconEdit}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={openPasswordModal}>
          <View style={styles.iconWrapper}>
            <Icon name="lock" size={30} color="#004437" />
          </View>
          <Text style={styles.textIcon}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("OrderHistory")}
        >
          <View style={styles.iconWrapper}>
            <Icon name="history" size={30} color="#004437" />
          </View>
          <Text style={styles.textIcon}>Lịch sử đơn hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <View style={styles.iconWrapper}>
            <Icon name="sign-out" size={30} color="#004437" />
          </View>
          <Text style={styles.textIcon}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      {/* Modal thay đổi tên người dùng */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thay đổi tên người dùng</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên mới"
              value={newName}
              onChangeText={setNewName}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSaveNewName}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal thay đổi mật khẩu */}
      <Modal
        visible={isPasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePasswordModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thay đổi mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu hiện tại"
              value={currentPassword}
              secureTextEntry
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              secureTextEntry
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              value={confirmNewPassword}
              secureTextEntry
              onChangeText={setConfirmNewPassword}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={closePasswordModal}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 20,
    marginBottom: 20,
  },
  user: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontWeight: "bold",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconEdit: {
    marginLeft: 10,
  },
  userName: {
    marginTop: 5,
    fontSize: 24,
    color: "#fff",
  },
  userEmail: {
    marginTop: 10,
    fontSize: 20,
    color: "#fff",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  iconContainer: {
    marginTop: 20,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textIcon: {
    fontSize: 16,
    color: "#333",
    marginLeft: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#008B8B",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
