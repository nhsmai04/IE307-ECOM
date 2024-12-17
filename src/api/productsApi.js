import database from '@react-native-firebase/database';

export const getProducts = async (path) => {
try {
    const snapshot = await database().ref(path).once('value');
    return snapshot.val();
} catch (error) {
    console.error('Lỗi lấy dữ liệu',error);
    throw error;
    
}
}
export const getProductsById = async (path,id) => {
    try{
        const snapshot = await database().ref(`${path}/${id}`).once('value');
        return snapshot.val();
    }catch(error){
        console.error('Lỗi lấy dữ liệu',error);
        throw error;
    }
}