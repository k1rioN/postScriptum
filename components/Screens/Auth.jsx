import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, TouchableWithoutFeedback, View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Image, SafeAreaView, Animated } from 'react-native';
import KeyboardAvoidingView, { KeyboardAvoidingViewComponent } from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { auth, database } from '../../firebase'
import { Keyboard } from 'react-native'
import { collection, query, where, getDocs } from 'firebase/firestore'
import AppLoader from './AppLoader';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
import {signInWithEmailAndPassword} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';


const backImage = require('../../assets/Rectangle.jpg')

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    if (email !== "" && password !== "") {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Login success");
        navigation.navigate("Home");
      } catch (err) {
        Alert.alert("Login error", err.message);
      }
    } else {
      Alert.alert("Заполните поля для входа");
    }
  };
  const keyboardOffset = useRef(new Animated.Value(10)).current;

  const startAnimation = (toValue) => Animated.timing(keyboardOffset, { toValue, duration: 400, useNativeDriver: true }).start();

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => {
      startAnimation(-80);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      startAnimation(0);
    });
  
    const fetchUserData = async () => {
      if (auth.currentUser.email) {
        const q = query(collection(database, "users"), where("email", "==", auth.currentUser.email));      
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          navigation.navigate("Auth");
          setUser(null);
        } else {
          const userData = querySnapshot.docs[0].data();
          const isWelcomed = userData.isWelcomed;
  
          if (isWelcomed === false) {
            navigation.navigate("Welcome");
          } else {
            navigation.navigate("Home");
          }
          setUser(userData);
        }
      }
      else if (user) {
        navigation.navigate("Home");
      }
      else {
        navigation.navigate("Auth");
        setUser(null);
      }
    };
  
    fetchUserData();
  }, []);
  
  

  let isPressed = false;

  const moveToReg = () => {
    navigation.navigate('Reg')
  };

  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet}/>
      <SafeAreaView style={styles.form}>
      <Animated.View style={{ transform: [{ translateY: keyboardOffset }] }}>
        <Text style={styles.title}>Вход</Text>
         <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          autoCorrect={false}
          onChangeText={(text) => setEmail(text)}
          onPressOut={() => isPressed=true}
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Войти</Text>
      </TouchableOpacity>
      </Animated.View>
      <View style={{marginTop: 40, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{color: 'gray', fontWeight: '600', fontSize: 15}}>Впервые в ПостСкриптум?? </Text>
        <TouchableOpacity onPress={moveToReg}>
          <Text style={{color: '#5687a6', fontWeight: '600', fontSize: 15}}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
    </TouchableWithoutFeedback>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#37648d",
    alignSelf: "center",
    paddingBottom: 24,
    marginTop: 40
  },
  whiteSheet: {
    width: '100%',
    height: '78%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  input: {
    backgroundColor: "#E7E7E7",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    color: '#37648d'
  },
  backImage: {
    width: "100%",
    height: 540,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#5687a6',
    height: 58,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
});