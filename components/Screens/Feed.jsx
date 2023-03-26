import React, { useState, useRef, useEffect  } from "react";
import { StyleSheet, StatusBar, Text, View, Modal, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { addDoc, collection, doc, Firestore } from 'firebase/firestore'
import { database, auth } from "../../firebase";
import { async } from "@firebase/util";
import { getDocs } from 'firebase/firestore'
import moment from 'moment'
import { LogBox } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import AppLoader from "./AppLoader";
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function Feed({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [postList, setPostList] = useState([]);
  const [loginPending, setLoginPending] = useState(false);
  const lastNameRef = useRef();

  useEffect(() => {
    setLoginPending(true)
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      setLoginPending(false)
    };
    const interval = setInterval(() => {
      getPosts();
    }, 1000)
  return () => clearInterval(interval)
  
  }, [])

  const postView = {
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomEndRadius: 30,
    marginHorizontal: 6,
    backgroundColor: "#6E8898FF"
  }

  const postCollectionRef = collection(database, "posts")

  const createPost = async (url) => {
    if(title !== "" && text !== "") {
      let datetime = moment().format(); 
      await addDoc(postCollectionRef, {title, text, author: {date: datetime, name: auth.currentUser.email, id: auth.currentUser.uid}}),
      setModalVisible(!modalVisible),
      setLoginPending(true)
      setTitle(""),
      setText("")
    }
    else {
      Alert.alert("Заполните все поля")
    }
  }

  return (
    <>
    <View style={styles.container} onPress={() => setModalVisible(!modalVisible)}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        keyboardShouldPersistTaps={'always'}
        >
          <>
          <View style={styles.centeredView}>
            <View style={styles.modalView} keyboardShouldPersistTaps='handled'>
              <TouchableOpacity keyboardShouldPersistTaps='handled' style={styles.closebutton} onPress={() => setModalVisible(false)}>
                <Text keyboardShouldPersistTaps='handled' style={{fontWeight: 'bold', color: '#30475E', fontSize: 17}}>Закрыть</Text>
              </TouchableOpacity>
              <Text style={{fontSize: 24, marginTop: 25, marginBottom: 10}}>Заголовок</Text>
              <TextInput 
                style={styles.input}
                autoCorrect={false}
                autoFocus={true}
                onSubmitEditing={() => {
                  lastNameRef.current.focus();
                }}
                blurOnSubmit={false}
                onChangeText={(text) => setTitle(text)}
                value={title}
              />
              <Text style={{fontSize: 24, marginTop: 20, marginBottom: 10}}>Текст поста</Text>
              <TextInput
                style={styles.inputArea}
                multiline={true}
                autoCorrect={false}
                ref={lastNameRef}
                onChangeText={(text) => setText(text)}
                value={text}
              />
              <TouchableOpacity style={styles.saveButton} onPress={createPost}>
                <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 17}}>Опубликовать</Text>
              </TouchableOpacity>
            </View>
          </View>
          </>
      </Modal>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
        <Text style={{fontWeight: 'bold', color: '#ffffff', fontSize: 22}}>+</Text>
      </TouchableOpacity>
      <View style={postView}>
        <FlatList data={postList} renderItem={({item}) => (
        <View 
          style={{
            padding: 20,
            margin: 0,
            height: 200,
            backgroundColor: "#9FB1BCFF",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            flexDirection: 'column', 
            marginBottom: 5
          }}>
          <Text style={styles.title} >{ item.title }</Text>
          <Text style={styles.text}>{ item.text }</Text>
        </View>
      )} />
      </View>
    </View>
    {loginPending ?  <AppLoader /> : null}
    <StatusBar barStyle={"light-content"} translucent={true}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6E8898FF",
    marginTop: 5,
    shadowColor: 'black',
    height: "100%",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },

  modalView: {
    backgroundColor: '#6E8898FF',
    borderRadius: 30,
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
    height: "83%",
    width: "100%",
  },
  input: {
    backgroundColor: "#E7E7E7",
    height: 50,
    width: "100%",
    marginHorizontal: 12,
    fontSize: 16,
    borderRadius: 30,
    padding: 13,
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
  colorPickerContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#1F2421",
  },
  text: {
    fontSize: 18,
    color: "#1F2421",
    marginTop: 15,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#78A2CC',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    marginBottom: 10,
    marginTop: 7
  },
  closebutton: {
    backgroundColor: '#F8858B',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    width: "100%",
    marginHorizontal: 12,
    zIndex: 1000
  },
  saveButton: {
    backgroundColor: '#78A2CC',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    width: "100%",
    marginHorizontal: 12,
    marginTop: 15
  }
});


