import { auth } from "../../firebase"
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Modal, Animated, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from "react-native-screens-swiper";
import FriendsPosts from "./FriendsPosts";
import Feed from "./Feed";
import AppLoader from "./AppLoader";
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";

const ModalPoup = ({visible, children}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 100);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function Home() {

  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();

  const data = [
    {
      tabLabel: 'Лента',
      component: Feed,
    },
    {
      tabLabel: 'Интересное',
      component: FriendsPosts,
    },
  ];

  const handleFriendsListNav = () => {
    setVisible(false)
    navigation.navigate("Друзья")
  }

  const handleSettingsNav = () => {
    setVisible(false)
    navigation.navigate("Settings")
  }

  const handleLogout = () => {
    if (auth.currentUser) {
      auth.signOut()
        .then(() => {
          console.log("Logout success");
          navigation.navigate("Auth");
        })
        .catch((err) => console.log(err));
    } else {
      console.log("User not logged in");
      navigation.navigate("Auth");
    }
  };

  const styless = {
    pillContainer: {
      alignItems: 'center',
      paddingHorizontal: 2,
      marginTop: 15,
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
      fontSize: 19,
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
      <ModalPoup visible={visible}>
        <SafeAreaView style={styles.nav}>
          <TouchableOpacity style={{flexDirection: 'row', marginBottom: 7}} onPress={handleLogout}>
            <Ionicons name="log-out" size={32} color="#dddce1" />
            <Text style={{fontSize: 28, marginRight: 20, fontWeight: '600', color: '#dddce1', marginTop: 2, marginLeft: 5}}>Выйти</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsNav} style={{flexDirection: 'row'}}>
            <Ionicons name="cog-outline" size={32} color="#dddce1" />
            <Text style={{fontSize: 28, fontWeight: '600', color: '#dddce1', marginTop: 2, marginLeft: 5}}>Настройки</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row', marginTop: 7}} onPress={handleFriendsListNav}>
            <Ionicons name="people-outline" size={32} color="#dddce1" />
            <Text style={{fontSize: 28, fontWeight: '600', color: '#dddce1', marginLeft: 5}}>Друзья</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <TouchableOpacity style={styles.closebutton} onPress={() => setVisible(false)}>
          <Text style={{fontWeight: 'bold', color: '#30475E', fontSize: 20}}>Закрыть</Text>
        </TouchableOpacity>
      </ModalPoup>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Ionicons name="reorder-three-outline" size={36} color="#dddce1" />
        </TouchableOpacity>
        <Text style={[styles.title, {marginTop: 2}]}>ПостСкриптум</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Профиль")}>
          <Ionicons name="person" size={36} color="#dddce1" />
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
  nav: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 46,
    backgroundColor: '#305a82',
    marginTop: 10,
  },
  title: {
    fontSize: 27,
    color: '#dddce1',
    letterSpacing: 6,
    fontWeight: '700'
  },
  content: {
    width: '100%',
    height: '90%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#305a82',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '100%',
    height: 285,
    backgroundColor: '#305a82',
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 20,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  closebutton: {
    backgroundColor: '#88A795',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 390,
    marginBottom: 10,
  },
});
