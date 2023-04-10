import { auth } from "../../firebase"
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Modal, Animated, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from "react-native-screens-swiper";
import FriendsList from "./FriendsList";
import FriendsOffers from "./FriendsOffers";
import AppLoader from "./AppLoader";
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";

export default function Home() {

  const navigation = useNavigation();

  const data = [
    {
      tabLabel: 'Друзья',
      component: FriendsList,
    },
    {
      tabLabel: 'Заявки в друзья',
      component: FriendsOffers,
  },
  ];


  const styless = {
    pillContainer: {
      alignItems: 'center',
      paddingHorizontal: 2,
      marginTop: 5,
      marginBottom: 7,
    },
    pillActive: {
      backgroundColor: '#78A2CC',
      color: 'black',
    },
    pillButton: {
      height: 47,
      width: 192,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 12,
      position: 'fixed',
      scrollableContainer: false,
      backgroundColor: '#f2f2f2',
      color: '#30475E',
    },
    borderActive: {
      borderColor: 'black',
      backgroundColor: 'white'
    },
    pillLabel: {
      color: 'gray',
      position: 'fixed',
      fontSize: 18,
      color: '#30475E',
      fontWeight: '600',
    },
    activeLabel: {
      color: 'white',
    },
  };

    return (
    <>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={45} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.title, {marginTop: 6}]}>Список друзей</Text>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="person" size={20} color="#305a82" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Swiper
              data={data}
              isStaticPills={false}
              style={styless}
              scrollableContainer={false}
              loop={false}
              index={0}
          />
      </View>
    </View>
    <StatusBar barStyle={"light-content"} translucent={true}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#305a82',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 43,
    backgroundColor: '#305a82',
    marginTop: 10,
    height: 100
  },
  title: {
    fontSize: 27,
    color: '#dddce1',
    letterSpacing: 6,
    fontWeight: '700',
  },
  content: {
    width: '100%',
    height: '88%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#305a82',
    justifyContent: 'center',
  },
});
