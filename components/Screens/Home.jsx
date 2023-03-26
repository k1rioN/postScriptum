import { auth } from "../../firebase"
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import Swiper from "react-native-screens-swiper";
import Messages from "./Messages";
import Feed from "./Feed";


export default function Home({ navigation }) {

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
      marginTop: 10,
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
      backgroundColor: '#9FB1BCFF',
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSingOut}>
          <Ionicons name="md-exit" size={34} color="#FD706B" />
        </TouchableOpacity>
        <Text style={styles.title}>ПостСкриптум</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="md-person" size={30} color="#708090" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Swiper
              data={data}
              isStaticPills={false}
              style={styless}
              scrollableContainer={false}
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
    backgroundColor: '#2E5266FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#2E5266FF',
    marginTop: 5,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D3D3D3',
  },
  content: {
    width: '100%',
    height: '90%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#2E5266FF',
    justifyContent: 'center',
  },
});
