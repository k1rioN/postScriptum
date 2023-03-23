import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';



export default function Post({route}) {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{route.params.title}</Text>
            <Text style={styles.text}>{route.params.text}</Text>
            <StatusBar style="auto" />
        </View>
        )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ('5%', 10, '5%'),
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    color:'black',
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 25,
  },
  text: {
    color:'black',
    top: 10,
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  }
});