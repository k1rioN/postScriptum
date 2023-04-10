import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, StatusBar, Text, RefreshControl, View, Modal, FlatList, TextInput, KeyboardAvoidingView, Alert, Image, TouchableWithoutFeedback } from 'react-native';
import { addDoc, collection, query, where, orderBy, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { database, auth } from "../../firebase";
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { async } from "@firebase/util";
import { getDocs } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment'
import { LogBox } from 'react-native';
import AppLoader from "./AppLoader";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/storage';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function FriendsPosts() {
  const [text, setText] = useState("");
  const [postList, setPostList] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loginPending, setLoginPending] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [friendEmails, setFriendEmails] = useState([auth.currentUser.email]);
  const [data, setData] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const navigation = useNavigation();
  const postCollectionRef = collection(database, "posts");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFriendEmails = async () => {
      const q = query(collection(database, "users"), where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => doc.data());
      if (userData.length > 0) {
        setFriendEmails(userData[0].friendsList.map(friend => friend.email));
      } else {
        setFriendEmails([auth.currentUser.email]);
      }
      setLoading(false);
    };
    getFriendEmails();
  }, []);
  
  // В запросах проверяем, что массив friendEmails заполнен
  useEffect(() => {
    if (!loading && friendEmails.length > 0) {
      const q = query(
        collection(database, "posts"),
        where("author.email", "in", friendEmails),
        orderBy("author.date", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setPostList(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
      return () => unsubscribe();
    }
  }, [loading, friendEmails]);
  

  useEffect(() => {
    const getData = async () => {
      const q = query(collection(database, "users"), where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => doc.data());
      setData(userData);
    };
    getData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setCurrentUser(data[0].name);
    }
  }, [data]);

  useEffect(() => {
    if (!loading && friendEmails.length > 0) {
    const unsubscribe = onSnapshot(
      query(postCollectionRef, where("author.email", "in", friendEmails), orderBy("author.date", "desc")),
      (querySnapshot) => {
        const postData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPostList(postData);
        setLoginPending(false);
      }
    );
    
    // Отписка от подписки на изменения Firestore
    return () => unsubscribe();
    }
    else {
      setLoginPending(false);
    }
  }, [friendEmails]);
  

  useEffect(() => {
    if (imgUrl) {
      const updatedPostList = postList.map((post) => {
        if (post.imageLink === imgUrl) {
          post.imageLink = imgUrl;
        }
        return post;
      });
      setPostList(updatedPostList);
    }
  }, [imgUrl]);

  const handleDeletePost = async (post) => {
    await deleteDoc(doc(database, "posts", post))
    onRefresh()
  }

  const handleNav = (email, data) => {
    if(email == auth.currentUser.email) {
      navigation.navigate("Профиль")
    }
    else {
      navigation.navigate("Другой профиль", data)
    }
  }

  const handleImagePress = (imageUrl) => {
    setImgUrl(imageUrl);
    setImageModalVisible(true);
  };  

  return (
    <>
    {loginPending ? <AppLoader /> :
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text style={{fontSize: 20, marginTop: 5, fontWeight: '500'}}>Обновления ваших </Text>
        <Text onPress={() => navigation.navigate("Друзья")} style={{fontSize: 20, marginTop: 5, fontWeight: '500', color: '#f97c7c'}}>друзей</Text>
      </View>
      {postList ? <FlatList style={{marginTop: 5}} showsVerticalScrollIndicator={false} data={postList} renderItem={({item}) => (
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
              <TouchableOpacity onPress={() => handleNav(item.author.email, item.author.name)}>
                <Text style={styles.title}>{ item.author.name }</Text>
              </TouchableOpacity>
              {item.author.email == auth.currentUser.email ? <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
                <Ionicons name="trash-outline" size={25} color="#000" />
              </TouchableOpacity> : null}
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
            {item.img ? <TouchableWithoutFeedback onPress={() => handleImagePress(item.img)}>
              <Image source={{ uri: item.img }} style={{height: 380, width: "100%", borderRadius: 20, resizeMode: 'cover'}} />
            </TouchableWithoutFeedback> : null}
        </View>
      )} /> : null}
    </View>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    marginTop: 5,
    shadowColor: 'black',
    height: "100%",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  showMoreButton: {
    backgroundColor: '#78A2CC',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10
  },
  showMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "82%",
    width: "100%",
  },
  modal: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeBttn: {
    marginTop: 50,
    alignSelf: 'center'
  },
  modalImage: {
    flex: 1,
    resizeMode: "contain",
    marginBottom: 70
  },
  inputArea: {
    backgroundColor: "#E7E7E7",
    height: 110,
    width: "100%",
    marginHorizontal: 12,
    fontSize: 16,
    borderRadius: 20,
    padding: 15,
    paddingTop: 10
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    margin: 10,
    borderRadius: 20
  },
  colorPickerContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginHorizontal: 2
  },
  button: {
    backgroundColor: '#78A2CC',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    marginBottom: 10,
    marginTop: 10,
  },
  closebutton: {
    backgroundColor: '#88A795',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    width: 390,
    marginHorizontal: 12,
  },
  saveButton: {
    backgroundColor: '#78A2CC',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    width: "100%",
    marginHorizontal: 12,
    marginTop: 15,
    width: 390,
  },
  addImageButton: {
    backgroundColor: '#f97c7c',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    width: "100%",
    marginHorizontal: 12,
    marginTop: 15,
    width: 390,
    flexDirection: 'row'
  }
});


