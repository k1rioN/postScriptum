import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { database, auth } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc, orderBy, deleteDoc, arrayUnion, onSnapshot } from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState, useEffect, useCallback } from "react";
import { async } from "@firebase/util";
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppLoader from "./AppLoader";
import * as ImagePicker from 'expo-image-picker';



export default function OtherProfile({ route }) {
  const [data, setData] = useState([]);
  const [loginPending, setLoginPending] = useState(true);
  const [avatarUri, setAvatarUri] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [showFullText, setShowFullText] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [requestSend, setRequestSend] = useState(false);
  const [isFriend, setIsFriend] = useState();
  const [ownRequest, setOwnRequest] = useState();
  const [postList, setPostList] = useState();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [friendsData, setFriendsData] = useState([]);
  const navigation = useNavigation();
  const storage = getStorage();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
      const q = query(
        collection(database, "posts"),
        where("author.name", "==", route.params),
        orderBy("author.date", "desc")
      );
      const querySnapshot = await getDocs(q);
      setPostList(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    setRefreshing(false);
  }, []);
  
  useEffect(() => {
    setCurrentUser(route.params.replace(/ /g,''));
    const q = query(
      collection(database, "posts"),
      where("author.name", "==", route.params),
      orderBy("author.date", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPostList(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  
    return () => unsubscribe();
  }, [route.params]);
  
  useEffect(() => {
    const q = query(collection(database, "users"), where("email", "==", auth.currentUser.email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userData = querySnapshot.docs.map(doc => doc.data());
      setFriendsData(userData);
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (friendsData.length > 0) {
      const hasFriendRequest = friendsData[0].friendsRequest && friendsData[0].friendsRequest.find(obj => obj.email === data[0]?.email);
      if(hasFriendRequest) {
        setOwnRequest(true)
      }
    }
  }, [friendsData, data]);
  
  useEffect(() => {
    const q = query(collection(database, "users"), where("name", "==", route.params));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userData = querySnapshot.docs.map((doc) => doc.data());
      setData(userData);
      setLoginPending(false);
      console.log(userData)
    });
  
    return () => unsubscribe();
  }, [route.params]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      const hasFriend = data[0].friendsList.find(obj => obj.email === auth.currentUser.email);
      const hasRequestSend = data[0].friendsRequest && data[0].friendsRequest.find(obj => obj.email === auth.currentUser.email);
      setAvatarUri(data[0].avatar);
      if(hasFriend) {
        setIsFriend(true);
      }
      if(hasRequestSend) {
        setRequestSend(true);
      }
      console.log(data[0].friendsList.find(obj => obj.email === auth.currentUser.email))
    }
  }, [data]);

  const addFriend = async () => {
    if (data && data.length > 0) {
      const userDataRef = doc(database, "users", `user${currentUser}`);
      const hasFriend = data[0].friendsList.find(obj => obj.email === auth.currentUser.email);
      if (hasFriend) {
        setIsFriend(true);
      }
      else {
        setRequestSend(true)
      }
      await updateDoc(userDataRef, {
        friendsRequest: arrayUnion({email: auth.currentUser.email, name: friendsData[0].name})
      });
    }
  }

  const handleAcceptFriend = async () => {
    if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('name')) {
      const userRef = collection(database, "users");
      const q = query(userRef, where("email", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();
        const updatedRequests = docData.friendsRequest.filter(
          (friend) => friend.email !== data[0].email
        );
        await updateDoc(docRef, {
          friendsRequest: updatedRequests,
          friendsList: arrayUnion({ email: data[0].email, name: data[0].name }),
        });
  
        // Add a check to only update the friend's list with the first object in data
        if (data.length === 1) {
          const q2 = query(userRef, where("email", "==", data[0].email));
          const querySnapshot2 = await getDocs(q2);
  
          if (!querySnapshot2.empty) {
            const docRef2 = querySnapshot2.docs[0].ref;
            await updateDoc(docRef2, {
              friendsList: arrayUnion({ email: friendsData[0].email, name: friendsData[0].name }),
            });
          } else {
            console.log(`Документ с email: ${friendsData[0].email} не найден`);
          }
        }
      } else {
        console.log("Документ не найден");
      }
    }
  };

  const handleDeleteFriend = async () => {
    if(Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('email')) {
    const userRef = collection(database, "users");
    const q = query(userRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data();
      const updatedfriendsList = docData.friendsList.filter((friend) => friend.email !== data[0].email);
      await updateDoc(docRef, {
        friendsList: updatedfriendsList,
      });
    } else {
      console.log("Документ не найден");
    }
    const userRef2 = collection(database, "users");
    const q2 = query(userRef2, where("email", "==", data[0].email));
    const querySnapshot2 = await getDocs(q2);
    if (!querySnapshot2.empty) {
      const docRef = querySnapshot2.docs[0].ref;
      const docData = querySnapshot2.docs[0].data();
      const updatedfriendsList = docData.friendsList.filter((friend) => friend.email !== auth.currentUser.email);
      await updateDoc(docRef, {
        friendsList: updatedfriendsList,
      });
    } 
    else {
      console.log("Документ не найден");
    }
    setIsFriend(false)
    }
  }

  const handleImagePress = (imageUrl) => {
    setImgUrl(imageUrl);
    setImageModalVisible(true);
  };  

  if (loginPending) {
    return <AppLoader />;
  }
  
  return (
    <>
    <View style={styles.container}>
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
      <SafeAreaView>
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
          {avatarUri &&  (
            <TouchableOpacity onPress={() => handleImagePress(avatarUri)}>
            <Image
              source={{ uri: avatarUri }}
              style={{ width: 130, height: 130, borderRadius: 75 }}
            />
          </TouchableOpacity>
          )}
      <View style={{alignSelf: 'center', justifyContent: 'flex-start', flexDirection: 'column', flex: 1}}>
      {data.map((item, index) => (
        <Text key={index} style={{fontSize: 24, fontWeight: '700', color: '#fff', justifyContent: 'center', alignSelf: 'center'}}>{item.name}</Text>
      ))}
        {isFriend ? (
          <TouchableOpacity style={styles.bttnDelete} onPress={handleDeleteFriend}>
            <Text style={{fontWeight: '600', color: '#ffffff', fontSize: 18, fontWeight: '600'}}>Удалить из друзей</Text>
          </TouchableOpacity>
        ) : (
          ownRequest ? (
            <TouchableOpacity style={styles.button} onPress={handleAcceptFriend}>
              <Text style={{fontWeight: '600', color: '#ffffff', fontSize: 18, fontWeight: '600'}}>Принять заявку в друзья</Text>
            </TouchableOpacity>
          ) : requestSend ? (
            <TouchableOpacity style={styles.button}>
              <Text style={{fontWeight: '600', color: '#ffffff', fontSize: 18, fontWeight: '600'}}>Заявка отправлена</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={addFriend}>
              <Text style={{fontWeight: '600', color: '#ffffff', fontSize: 18, fontWeight: '600'}}>Добавить в друзья</Text>
            </TouchableOpacity>
          )
        )}
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
            <Text style={styles.title}>{ item.author.name }</Text>
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
            {item.img !== null ? <TouchableWithoutFeedback onPress={() => handleImagePress(item.img)}>
              <Image source={{ uri: item.img }} style={{height: 380, width: "100%", borderRadius: 20, resizeMode: 'cover'}} />
            </TouchableWithoutFeedback> : null}
        </View>
      )} /> 
        </View>
      </SafeAreaView>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15
  },
  editProfile: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#49a41e',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
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
    backgroundColor: '#78A2CC',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
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
  bttnDelete: {
    backgroundColor: '#f97c7c',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    alignSelf: 'center'
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
});