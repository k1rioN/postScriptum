import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { database, auth } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc, orderBy, deleteDoc, onSnapshot } from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState, useEffect, useCallback } from "react";
import { async } from "@firebase/util";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppLoader from "./AppLoader";
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';



export default function Profile() {
  const [data, setData] = useState([]);
  const [loginPending, setLoginPending] = useState(true);
  const [avatarUri, setAvatarUri] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [showFullText, setShowFullText] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [postList, setPostList] = useState();
  const navigation = useNavigation();
  const storage = getStorage();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
      const q = query(
        collection(database, "posts"),
        where("author.email", "==", auth.currentUser.email),
        orderBy("author.date", "desc")
      );
      const querySnapshot = await getDocs(q);
      setPostList(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    setRefreshing(false);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      createAvatar(result.uri);
    }
  };

  const createAvatar = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const userDataRef = doc(database, "users", `user${currentUser}`);
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const imgToUpload = `https://firebasestorage.googleapis.com/v0/b/socialapp-ad261.appspot.com/o/avatars%2F${filename}?alt=media&token=f00829a3-7a29-4b99-8927-2f69da012902`;
    const storageRef = ref(storage, `avatars/${filename}`);
    await uploadBytes(storageRef, blob);
    await updateDoc(userDataRef, {
      avatar: imgToUpload
    });
  };
  

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(database, "posts"),
        where("author.email", "==", auth.currentUser.email),
        orderBy("author.date", "desc")
      ),
      (snapshot) => {
        setPostList(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        
      }
      
    );
    return unsubscribe;
  }, []);
  

  useEffect(() => {
    const getData = async () => {
      const q = query(collection(database, "users"), where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => doc.data());
      setData(userData);
      setLoginPending(false)
    };
  
    const interval = setInterval(() => {
      getData();
    }, 1000)
  
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (data.length > 0) {
      setCurrentUser(data[0].name.replace(/ /g,''))
      setAvatarUri(data[0].avatar)
    }
  }, [data])

  const handleDeletePost = async (post) => {
    await deleteDoc(doc(database, "posts", post))
    onRefresh()
  }

  const handleImagePress = (imageUrl) => {
    setImgUrl(imageUrl);
    setImageModalVisible(true);
  };  
  
  return (
    <>
    {loginPending ? <AppLoader /> : <View style={styles.container}>
      <SafeAreaView>
        <Modal
          animationType="slide"
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <SafeAreaView style={styles.modal}>
            <TouchableOpacity
              style={styles.closeBttn}
              onPress={() => setImageModalVisible(false)}
            >
              <AntDesign name="closecircle" size={45} color="#fff" />
            </TouchableOpacity>
            <Image
              style={styles.modalImage}
              source={{ uri: imgUrl }}
            />
          </SafeAreaView>
        </Modal>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={45} color="#fff" />
          </TouchableOpacity>
          <Text style={{marginTop: 2, color: '#fff', alignSelf: 'center', fontSize: 30, fontWeight: '700'}}>Профиль</Text>
          <View onPress={() => {}}>
            <Text style={{color: '#305a82'}}>dfsd</Text>
          </View>
        </View>
        <View style={styles.profileHeader}>
          {avatarUri ? (
          <TouchableOpacity onPress={() => handleImagePress(avatarUri)}>
            <Image
              source={{ uri: avatarUri }}
              style={{ width: 130, height: 130, borderRadius: 75 }}
            />
          </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 75,
                  backgroundColor: '#CCCCCC',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: 'white' }}>Добавить аватар</Text>
              </View>
            </TouchableOpacity>
          )}
      <View>
      {data.map((item, index) => (
        <Text key={index} style={{fontSize: 24, fontWeight: '700', color: '#fff'}}>{item.name}</Text>
      ))}
        <TouchableOpacity style={styles.button}>
          <Text style={{fontWeight: '600', color: '#ffffff', fontSize: 18, fontWeight: '600'}}>Редактировать</Text>
        </TouchableOpacity>
      </View>
        </View>
        <View style={{height: '82%', marginTop: 5, backgroundColor: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, marginTop: 10}}>
        <FlatList showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } data={postList} renderItem={({item}) => (
        <View 
          style={{
            padding: 20,
            margin: 0,
            backgroundColor: "#9FB1BCFF",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            flexDirection: 'column', 
            marginBottom: 5,
          }} >
            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
              <Text style={styles.title}>{ item.author.name }</Text>
              <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>{showFullText ? item.text : item.text.slice(0, 200)}</Text>
            {item.text.length > 200 && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowFullText(!showFullText)}
              >
                <Text style={styles.showMoreButtonText}>
                  {showFullText ? 'Скрыть' : 'Показать еще'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableWithoutFeedback onPress={() => handleImagePress(item.img)}>
              <Image source={{ uri: item.img }} style={{height: 380, width: "100%", borderRadius: 20, resizeMode: 'cover'}} />
            </TouchableWithoutFeedback>
        </View>
      )} /> 
        </View>
      </SafeAreaView>
    </View>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#305a82",
    shadowColor: 'black',
    height: "100%",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12
  },
  profileHeader: {
    marginTop: 5,
    height: 147,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 0
  },
  editProfile: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#49a41e',
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    alignSelf: 'center'
  },
  showMoreButton: {
    backgroundColor: '#78A2CC',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'center',
    marginBottom: 10
  },
  showMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonExpand: {
    backgroundColor: '#ff6181',
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: "#1F2421",
  },
  text: {
    fontSize: 18,
    color: "#1F2421",
    marginTop: 15,
    marginBottom: 15,
  },
  modal: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeBttn: {
    marginTop: 20,
    alignSelf: 'center'
  },
  modalImage: {
    flex: 1,
    resizeMode: "contain",
    marginBottom: 70
  },
});