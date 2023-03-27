import { auth } from "../../firebase"
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Modal, Animated, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import Swiper from "react-native-screens-swiper";
import Messages from "./Messages";
import Feed from "./Feed";

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
      setTimeout(() => setShowModal(false), 150);
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

export default function Home({ navigation }) {

  const [visible, setVisible] = React.useState(false);

  const data = [
    {
      tabLabel: 'Лента',
      component: Feed,
    },
    {
      tabLabel: 'Сообщения',
      component: Messages,
  },
  ];

  const handleSingOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.navigate("Auth")
    })
  }

  const styless = {
    pillContainer: {
      alignItems: 'center',
      paddingHorizontal: 2,
      marginTop: 15,
      marginBottom: 5
    },
    pillActive: {
      backgroundColor: '#78A2CC',
      color: 'black'
    },
    pillButton: {
      height: 47,
      width: 192,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
      position: 'fixed',
      scrollableContainer: false,
      backgroundColor: '#f2f2f2',
      color: '#30475E'
    },
    borderActive: {
      borderColor: 'black',
      backgroundColor: 'white'
    },
    pillLabel: {
      color: 'gray',
      position: 'fixed',
      fontSize: 17,
      fontWeight: 'bold',
      color: '#30475E',
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
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={handleSingOut}>
            <Ionicons name="log-out" size={36} color="#1b1a1d" />
            <Text style={{fontSize: 28, marginRight: 20, fontWeight: '600'}}>Выйти</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <Ionicons name="cog-outline" size={36} color="#1b1a1d" />
            <Text style={{fontSize: 28, fontWeight: '600'}}>Настройки</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <TouchableOpacity style={styles.closebutton} onPress={() => setVisible(false)}>
          <Text style={{fontWeight: 'bold', color: '#30475E', fontSize: 17}}>Закрыть</Text>
        </TouchableOpacity>
      </ModalPoup>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Ionicons name="reorder-three-outline" size={36} color="#1b1a1d" />
        </TouchableOpacity>
        <Text style={styles.title}>ПостСкриптум</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="md-person" size={36} color="#1b1a1d" />
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
    <StatusBar barStyle={"dark-content"} translucent={true}/>
    </>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ca786d',
  },
  nav: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#ca786d',
    marginTop: 5,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b1a1d',
  },
  content: {
    width: '100%',
    height: '90%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#ca786d',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '100%',
    height: 225,
    backgroundColor: '#ca786d',
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 20,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  closebutton: {
    backgroundColor: '#88A795',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 390,
    marginBottom: 10,
  },
});
