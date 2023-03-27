import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList } from 'react-native';



export default function Messages({navigation}) {

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 18, padding: 15}}>Сообщения</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 5,
    shadowColor: 'black',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
});