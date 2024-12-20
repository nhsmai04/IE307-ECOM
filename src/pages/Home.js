import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import Header from '../components/Header';
import Item from '../components/ItemHome';

const { height } = Dimensions.get('window'); // Lấy chiều cao thiết bị

const items = [
  { id: 1, title: 'Trà', imageUrl: require('../assets/images/tea.jpg') },
  { id: 2, title: 'Creamy', imageUrl: require('../assets/images/creamy.jpg') },
  { id: 3, title: 'Trà sữa', imageUrl: require('../assets/images/milktea.jpg') },
  { id: 4, title: 'Fresh', imageUrl: require('../assets/images/fresh.jpg') },
];

export default function Home({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Tạo hiệu ứng ẩn/hiện Header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100], // Khi cuộn từ 0 đến 100
    outputRange: [height * 0.1, 0], // Chiều cao Header từ đầy đủ đến ẩn hoàn toàn
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100], // Khi cuộn từ 0 đến 100
    outputRange: [1, 0], // Độ mờ từ 1 đến 0
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { height: headerHeight, opacity: headerOpacity },
        ]}
      >
        <Header />
      </Animated.View>

      {/* Nội dung cuộn */}
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Item
              title={item.title}
              imageUrl={item.imageUrl}
              navigation={navigation}
            />
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    position: 'absolute', // Cố định vị trí Header
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10, // Đảm bảo Header nằm trên ScrollView
    elevation: 5, // Bóng đổ trên Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    paddingTop: height * 0.1 + 10, // Đẩy nội dung xuống dưới Header
    paddingHorizontal: 15,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
    height: 300,
  },
});
