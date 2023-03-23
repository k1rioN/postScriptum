import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StatusBar, TouchableWithoutFeedback, View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Image, SafeAreaView } from 'react-native';
import KeyboardAvoidingView, { KeyboardAvoidingViewComponent } from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { auth } from '../../firebase'
import { Keyboard } from 'react-native'

const backImage = require('../../assets/Rectangle.jpg')

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if(email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
      .then(() => console.log("Login success"))
      .catch((err) => Alert.alert("Login error", err.message));
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.navigate("Home")
      }
    })
    return unsubscribe
  }, [])

  let isPressed = false;

  const moveToReg = () => {
    navigation.navigate('Reg')
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} onPress={() => Keyboard.dismiss()}/>
      <SafeAreaView style={styles.form} onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
      <View style={{marginTop: 40, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{color: 'gray', fontWeight: '600', fontSize: 15}}>Впервые в ПостСкриптум?? </Text>
        <TouchableOpacity onPress={moveToReg}>
          <Text style={{color: '#5687a6', fontWeight: '600', fontSize: 15}}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
});