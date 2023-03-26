import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';
import MainStack from './navigate'


export default function App() {

  return (
    <View style={styles.container}>
      <MainStack />
    </View>
    )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
