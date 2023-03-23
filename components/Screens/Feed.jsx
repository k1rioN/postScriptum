import React, { useState, useRef, useEffect  } from "react";
import { StyleSheet, Dimensions, Text, View, Modal, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { addDoc, collection, doc } from 'firebase/firestore'
import { database, auth } from "../../firebase";
import { async } from "@firebase/util";
import { getDocs } from 'firebase/firestore'
import moment from 'moment'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function Feed({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [postList, setPostList] = useState([]);
  const [imageUpload, setImageUpload] = useState();
  const lastNameRef = useRef();
  const { width, height } = Dimensions.get('window')
  const ITEM_SIZE = height / 100 * 72;

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    };
    const interval = setInterval(() => {
      getPosts();
    }, 1000)
  return () => clearInterval(interval)
  }, [])

  const postContainer = {
    padding: 20,
    margin: 0,
    marginHorizontal: 2,
    height: ITEM_SIZE,
    backgroundColor: "#c8d9ed",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: 3
  }

  const postView = {
    height: ITEM_SIZE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomEndRadius: 30,
    marginHorizontal: 6,
  }
  

  const postCollectionRef = collection(database, "posts")
  const createPost = async () => {
    let datetime = moment().format(); 
    await addDoc(postCollectionRef, {title, text, author: {date: datetime, name: auth.currentUser.email, id: auth.currentUser.uid}}),
    setModalVisible(!modalVisible),
    setTitle(""),
    setText("")
  }

  return (
    <View style={styles.container} onPress={() => setModalVisible(!modalVisible)}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closebutton} onPress={() => setModalVisible(false)}>
                <Text style={{fontWeight: 'bold', color: '#30475E', fontSize: 17}}>Закрыть</Text>
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
      </Modal>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
        <Text style={{fontWeight: 'bold', color: '#ffffff', fontSize: 22}}>+</Text>
      </TouchableOpacity>
      <View style={postView}>
        <FlatList data={postList} snapToInterval={ITEM_SIZE + 3} decelerationRate={0} renderItem={({item}) => (
        <View style={postContainer}>
          <Text style={styles.title} >{ item.title }</Text>
          <Text style={styles.text}>{ item.text }</Text>
        </View>
      )} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fddbb8",
    marginTop: 11,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    shadowColor: 'black',
    marginHorizontal: 6,
    height: "100%"
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000
  },
  
  modalView: {
    backgroundColor: 'white',
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
    height: "82%",
    width: "98%",
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#1F2421"
  },
  text: {
    fontSize: 18,
    color: "#1F2421"
  },
  button: {
    backgroundColor: '#0976d1',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    marginHorizontal: 7,
    marginBottom: 7
  },
  closebutton: {
    backgroundColor: '#fddbb8',
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
    backgroundColor: '#0976d1',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: "100%",
    marginHorizontal: 12,
  }
});