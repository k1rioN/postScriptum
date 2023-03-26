import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, TouchableWithoutFeedback, View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Image, SafeAreaView, Animated, Slider } from 'react-native';
import KeyboardAvoidingView, { KeyboardAvoidingViewComponent } from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { auth } from '../../firebase'
import { Keyboard } from 'react-native'
import AppLoader from './AppLoader';
import { useFocusEffect } from '@react-navigation/native';
import Swiper from "react-native-screens-swiper";
import Auth from './Auth'
import Reg from './Reg'


const backImage = require('../../assets/Rectangle.jpg')

export default function LoginPage({ navigation }) {

    const styless = {
        pillContainer: {
          alignItems: 'center',
          paddingHorizontal: 2,
          marginTop: 15
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
          backgroundColor: '#D3D3D3',
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

      const data = [
        {
          tabLabel: 'Вход',
          component: Auth,
        },
        {
          tabLabel: 'Регистрация',
          component: Reg,
      },
      ];

    useFocusEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
            navigation.navigate("Home")
        }
        })
        return unsubscribe
    }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet}>
        <Swiper 
            data={data}
            isStaticPills={false}
            style={styless}
            scrollableContainer={false}
        />
      </View>
        
      <StatusBar barStyle="light-content" />
    </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  whiteSheet: {
    width: '100%',
    height: '85%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  backImage: {
    width: "100%",
    height: 540,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
});