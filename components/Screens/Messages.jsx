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
    backgroundColor: "#fddbb8",
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: 'black',
    marginHorizontal: 5
  },
});