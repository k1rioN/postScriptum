import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";
import { database, auth } from "../../firebase";
import { collection, query, where, getDocs, updateDoc, onSnapshot} from 'firebase/firestore'
import { useState, useEffect } from "react";
import { async } from "@firebase/util";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppLoader from "./AppLoader";



function getFriendsCountText(count) {
  const lastDigit = count % 10;
  if (count === 0) {
    return "Нет друзей";
  } else if (count === 1) {
    return "1 друг";
  } else if (count >= 11 && count <= 19) {
    return `${count} друзей`;
  } else if (lastDigit === 1) {
    return `${count} друг`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} друга`;
  } else {
    return `${count} друзей`;
  }
}

export default function FriendsList() {
  const [data, setData] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [loginPending, setLoginPending] = useState(true);
  const navigation = useNavigation();
  const [friendsCount, setFriendsCount] = useState(); 

  useEffect(() => {
    const q = query(collection(database, "users"), where("email", "==", auth.currentUser.email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userData = querySnapshot.docs.map((doc) => doc.data());
        setData(userData);
        setLoginPending(false);
    });

    return () => unsubscribe();
}, []);


  useEffect(() => {
    if (data.length > 0 && data[0].friendsList) {
      const f = data[0].friendsList;
      setFriendsList(f);
      setFriendsCount(f.length)
    }
    else {
      setFriendsCount(0)
    }
  }, [data]);

  const handleNav = (name) => {
    if (data.length > 0) {
      navigation.navigate("Другой профиль", name)
    }
  }  

  const handleDeleteFriend = async (email, name) => {
    const usersRef = collection(database, "users");
    const q = query(usersRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Remove friend from current user's friendsList
      const currentUserDocRef = querySnapshot.docs[0].ref;
      const currentUserData = querySnapshot.docs[0].data();
      const updatedCurrentUserFriendsList = currentUserData.friendsList.filter((friend) => friend.email !== email);
      await updateDoc(currentUserDocRef, {
        friendsList: updatedCurrentUserFriendsList,
      });
  
      // Remove current user from the friend's friendsList
      const friendsQuerySnapshot = await getDocs(query(usersRef, where("name", "==", name)));
      if (!friendsQuerySnapshot.empty) {
        const friendDocRef = friendsQuerySnapshot.docs[0].ref;
        const friendData = friendsQuerySnapshot.docs[0].data();
        const updatedFriendFriendsList = friendData.friendsList.filter((friend) => friend.email !== auth.currentUser.email);
        await updateDoc(friendDocRef, {
          friendsList: updatedFriendFriendsList,
        });
      }
    } else {
      console.log("Документ не найден");
    }
  };
  

  return (
    <>
    {loginPending ?  
    <AppLoader /> 
      :
    <SafeAreaView style={styles.container}>
      <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 18}}>{getFriendsCountText(friendsCount)}</Text>
      </View>
      <FlatList showsVerticalScrollIndicator={false} data={friendsList} renderItem={({item}) => (
        <View 
          style={{
            padding: 20,
            margin: 0,
            backgroundColor: "#9FB1BCFF",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            flexDirection: 'row', 
            marginBottom: 5,
            justifyContent: 'space-between',
            alignItems: 'center'
          }} >
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => handleNav(item.name)}>
                <Text style={{fontSize: 23, letterSpacing: 1}}>{item.name}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{borderRadius: 12, backgroundColor: '#f97c7c'}} onPress={() => handleDeleteFriend(item.email, item.name)}>
              <Text style={{fontSize: 19, padding: 8, color: '#8B0000', fontWeight: '600', letterSpacing: 1}}>Удалить</Text>
            </TouchableOpacity>
        </View>
      )} /> 
    </SafeAreaView>}
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
});