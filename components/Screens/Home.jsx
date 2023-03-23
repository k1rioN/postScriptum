import { auth } from "../../firebase"
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
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
      paddingTop: 8,
      paddingHorizontal: 2
    },
    pillActive: {
      backgroundColor: '#0976d1',
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
      backgroundColor: '#F6F8FF',
      color: '#30475E'
    },
    borderActive: {
      borderColor: 'black',
      backgroundColor: '#37648d'
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSingOut}>
          <Ionicons name="md-exit" size={32} color="#fddbb8" />
        </TouchableOpacity>
        <Text style={styles.title}>ПостСкриптум</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="md-person" size={32} color="#a2d4ed" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#F0997D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#514e4c',
  },
  content: {
    width: '100%',
    height: '90%',
    position: "absolute",
    bottom: 0,
    backgroundColor: 'white',
    paddingTop: 5,
    justifyContent: 'center',
    backgroundColor: '#F0997D',
  },
});
