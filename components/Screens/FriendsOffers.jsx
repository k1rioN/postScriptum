import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";
import { database, auth } from "../../firebase";
import { collection, query, where, getDocs, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore'
import { useState, useEffect } from "react";
import { async } from "@firebase/util";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';



export default function FriendsOffers() {
  const [data, setData] = useState([]);
  const [friendsOffersList, setFriendsOffersList] = useState(false);
  const navigation = useNavigation();

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
      setFriendsOffersList(data[0].friendsRequest)
    }
  }, [data]);
  
  const handleAddFriend = async (name, email) => {
    const userRef = collection(database, "users");
    const q = query(userRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data();
      const updatedRequests = docData.friendsRequest.filter((friend) => friend.email !== email);
      await updateDoc(docRef, {
        friendsRequest: updatedRequests,
        friendsList: arrayUnion({ name, email })
      });
  
      // Обновление другого документа
      const q2 = query(userRef, where("email", "==", email));
      const querySnapshot2 = await getDocs(q2);
  
      if (!querySnapshot2.empty) {
        const docRef2 = querySnapshot2.docs[0].ref;
        await updateDoc(docRef2, {
          friendsList: arrayUnion({ email: data[0].email, name: data[0].name })
        });
      } else {
        console.log(`Документ с email: ${email} не найден`);
      }
    } else {
      console.log("Документ не найден");
    }
  }
  

  const handleReject = async (email) => {
    const userRef = collection(database, "users");
    const q = query(userRef, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data();
      const updatedRequests = docData.friendsRequest.filter((friend) => friend.email !== email);
      await updateDoc(docRef, {
        friendsRequest: updatedRequests,
      });
    } else {
      console.log("Документ не найден");
    }
  }
  

  const handleNav = (name) => {
    navigation.navigate("Другой профиль", name)
  }
  
  return (
    <View style={styles.container}>
      {friendsOffersList && friendsOffersList.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={friendsOffersList}
          renderItem={({item}) => (
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
              }}
            >
              <TouchableOpacity onPress={() => handleNav(item.name)}>
                <Text style={{fontSize: 20}}>{item.name}</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 70}}>
                <TouchableOpacity style={{}} onPress={() => handleAddFriend(item.name, item.email)}>
                  <Ionicons name="checkmark-outline" size={32} color="green" />
                </TouchableOpacity>
                <TouchableOpacity style={{}} onPress={() => handleReject(item.email)}>
                  <Ionicons name="close-outline" size={32} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={{alignSelf: 'center', fontSize: 20, marginTop: 10}}>Нет активных запросов в друзья :(</Text>
      )}
    </View>
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