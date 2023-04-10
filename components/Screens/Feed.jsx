<<<<<<< HEAD
import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, StatusBar, Text, RefreshControl, View, Modal, FlatList, TextInput, KeyboardAvoidingView, Alert, Image, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { addDoc, collection, query, where, orderBy, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
=======
import React, { useState, useRef, useEffect  } from "react";
import { StyleSheet, StatusBar, Text, RefreshControl, View, Modal, FlatList, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { addDoc, collection, doc, Firestore } from 'firebase/firestore'
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
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
<<<<<<< HEAD
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/storage';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
=======
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function Feed() {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [postList, setPostList] = useState([]);
<<<<<<< HEAD
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loginPending, setLoginPending] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [image, setImage] = useState(null);
  const [imagePrewiev, setImagePrewiev] = useState(null);
  const [data, setData] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const lastNameRef = useRef();
  const storage = getStorage();
  const navigation = useNavigation();
  const postCollectionRef = collection(database, "posts");

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const querySnapshot = await getDocs(
      query(postCollectionRef, orderBy("author.date", "desc"))
    );
    const postListData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setPostList(postListData);
    setRefreshing(false);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.uri) {
      const source = { uri: result.uri };
      console.log(source);
      setImage(source);
      setImagePrewiev(result.uri);
    }
  };
=======
  const [loginPending, setLoginPending] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const lastNameRef = useRef();
  

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377

  useEffect(() => {
    const q = query(
      collection(database, "posts"),
      where("author.email", "==", auth.currentUser.email),
      orderBy("author.date", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPostList(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  
    return () => unsubscribe();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    const getData = async () => {
      const q = query(collection(database, "users"), where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => doc.data());
      setData(userData);
    };
  
    const interval = setInterval(() => {
      getData();
    }, 1000)
  
    return () => clearInterval(interval);
  }, []);  

  useEffect(() => {
    if (data.length > 0) {
      setCurrentUser(data[0].name);
    }
  }, [data]);

  useEffect(() => {
      const getPosts = async () => {
        const querySnapshot = await getDocs(
          query(postCollectionRef, orderBy("author.date", "desc"))
        );
        const postData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPostList(postData);
        setLoginPending(false);
      };
      getPosts();
    }, [data])


  const createPost = async () => {
    if (text !== "") {
      const datetime = moment().format();
      let img = null;
      if (image) {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
        const imgToUpload = `images/${filename}`;
        const storageRef = ref(storage, imgToUpload);
        await uploadBytes(storageRef, blob);
        img = await getDownloadURL(storageRef);
      }
      await addDoc(postCollectionRef, {
        text,
        img,
        author: {
          date: datetime,
          email: auth.currentUser.email,
          id: auth.currentUser.uid,
          name: currentUser,
        },
      });
      setModalVisible(false);
      setText("");
      setImagePrewiev(null);
      setImage(null);
      onRefresh();
    } else {
      Alert.alert("Заполните все поля");
    }
  };

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
=======
  const postView = {
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#ffffff",
    paddingBottom: 100
  }

  const postCollectionRef = collection(database, "posts")

  const createPost = async (url) => {
    if(text !== "") {
      let datetime = moment().format(); 
      await addDoc(postCollectionRef, {text, author: {date: datetime, name: auth.currentUser.email, id: auth.currentUser.uid}}),
      setModalVisible(!modalVisible),
      setLoginPending(true)
      setTitle(""),
      setText("")
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
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
    <View style={styles.container} onPress={() => setModalVisible(!modalVisible)}>
      
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
          <>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closebutton} onPress={() => setModalVisible(false)}>
<<<<<<< HEAD
                <Text style={{fontWeight: 'bold', color: '#30475E', fontSize: 20}}>Закрыть</Text>
=======
                <Text style={{fontWeight: 'bold', color: '#30475E', fontSize: 17}}>Закрыть</Text>
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
              </TouchableOpacity>
              <Text style={{fontSize: 24, marginTop: 20, marginBottom: 10}}>Текст поста</Text>
              <TextInput
                style={styles.inputArea}
                multiline={true}
                autoCorrect={false}
                ref={lastNameRef}
                onChangeText={(text) => setText(text)}
                value={text}
                autoFocus={true}
              />
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <AntDesign name="picture" size={24} color="white" />
                <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 17, marginLeft: 10}}>Выбрать фото</Text>
              </TouchableOpacity>
              {imagePrewiev ? (
                <>
                <View style={{flexDirection: 'column'}}>
                  <TouchableOpacity onPress={() => setImagePrewiev(null)} style={{alignSelf: 'center', marginTop: 10}}>
                    <Text style={{fontSize: 19, color: '#f97c7c', fontWeight: '500'}}>Удалить изображение</Text>
                  </TouchableOpacity>
                  <Image source={{ uri: imagePrewiev }} style={styles.image} />
                </View>
                </>
              ) : null}
              <TouchableOpacity style={styles.saveButton} onPress={createPost}>
                <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 17}}>Опубликовать</Text>
              </TouchableOpacity>
            </View>
          </View>
          </>
      </Modal>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
        <Text style={{fontWeight: '700', color: '#ffffff', fontSize: 21}}>Добавить пост</Text>
      </TouchableOpacity>
<<<<<<< HEAD
      <FlatList showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } data={postList} renderItem={({item}) => (
=======
      <ScrollView style={postView} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <FlatList data={postList} renderItem={({item}) => (
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
        <View 
          style={{
            padding: 20,
            margin: 0,
<<<<<<< HEAD
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
      )} /> 
    </View>}
=======
            height: 150,
            backgroundColor: "#9FB1BCFF",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            flexDirection: 'column', 
            marginBottom: 5
          }} >
          <Text style={styles.title} >{ item.author.name }</Text>
          <Text style={styles.text}>{ item.text }</Text>
        </View>
      )} />
      </ScrollView>
    </View>
    {loginPending ?  <AppLoader /> : null}
    <StatusBar barStyle={"light-content"} translucent={true}/>
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    marginTop: 5,
    shadowColor: 'black',
    height: "100%",
<<<<<<< HEAD
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12
=======
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
<<<<<<< HEAD
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
=======
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
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
    borderRadius: 20,
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
<<<<<<< HEAD
    width: 390,
=======
    width: 380,
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
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
<<<<<<< HEAD
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
=======
    width: 380,
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
  }
});


