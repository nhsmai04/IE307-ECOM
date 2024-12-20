import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useApp } from '../contexts/AppContext';

export default function Shopstack() {
  const { cart, removeFromCart } = useApp();

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemText}>Tên sản phẩm: {item.name}</Text>
        <Text style={styles.itemText}>Kích thước: {item.size}</Text>
        <Text style={styles.itemText}>Đá: {item.ice}</Text>
        <Text style={styles.itemText}>Độ ngọt: {item.sweetness}</Text>
        <Text style={styles.itemText}>Topping: {item.toppings ? item.toppings.map(topping => topping.nametopping).join(', ') : 'Không có topping'}</Text>
        <Text style={styles.itemText}>Số lượng: {item.quantity}</Text>
        <Text style={styles.itemText}>Tổng: {item.total}đ</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item)}>
        <Icon name="times" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
});