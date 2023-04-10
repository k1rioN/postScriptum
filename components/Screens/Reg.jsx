import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, TouchableWithoutFeedback, View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Image, SafeAreaView, Animated } from 'react-native';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { auth, database } from '../../firebase'
import { Keyboard } from 'react-native'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const backImage = require('../../assets/Rectangle.jpg')

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const nameId = 'user' + name.replace(/ /g,'');
  const newId = toString(Math.floor(Math.random() * (9999 - 1000 + 1)))
  const navigation = useNavigation();

  const handleRegister = () => {
    if(email !== "" && password !== "" && password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
      .then(() => console.log("Registration success"))
      .then(navigation.navigate('Welcome'))
      .catch((err) => Alert.alert("Registration error", err.message));
      setDoc(doc(database, 'users', nameId), {name, email, friendsList: [], friendsRequest: [], isWelcomed: false})
    }
  };

  const keyboardOffset = useRef(new Animated.Value(10)).current;

  const startAnimation = (toValue) =>
  Animated.timing(keyboardOffset, { toValue, duration: 300 }).start();

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", (e) => {
      startAnimation(-70);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      startAnimation(0);
    });
    return () => {
    };
  }, []);

  const moveToAuth = () => {
    navigation.navigate('Auth')
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container} >
         <Image source={require('../../assets/Rectangle.jpg')} style={styles.backImage} />
      <View style={styles.whiteSheet} onPress={() => Keyboard.dismiss()}/>
      <SafeAreaView style={styles.form} onPress={() => Keyboard.dismiss()}>
      <Animated.View style={{ transform: [{ translateY: keyboardOffset }] }}>
        <Text style={styles.title}>Регистрация</Text>
            <View>
              <TextInput
                    style={styles.input}
                    placeholder="Имя"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    value={name}
                    autoCorrect={false}
                    onChangeText={(text) => setName(text)}
                />
              
               <TextInput
                  style={styles.input}
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={email}
                  autoCorrect={false}
                  onChangeText={(text) => setEmail(text)}
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

                <TextInput
                  style={styles.input}
                  placeholder="Повторить пароль"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  textContentType="password"
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                />
              </View>
              
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Зарегистрироваться</Text>
      </TouchableOpacity>
      </Animated.View>
      <View style={{marginTop: 25, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 45}}>
        <Text style={{color: 'gray', fontWeight: '600', fontSize: 15}}>Уже пользуетесь ПостСкриптум? </Text>
        <TouchableOpacity onPress={moveToAuth}>
          <Text style={{color: '#5687a6', fontWeight: '600', fontSize: 15}}>Войти</Text>
        </TouchableOpacity>
      </View>
      
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
    marginTop: 60
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
    height: 530,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '83%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
    marginTop: 2,
  },
});