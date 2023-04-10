import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AnimatedLottieView from 'lottie-react-native'

const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <AnimatedLottieView style={{width: 400, height: 400}} source={require('../../assets/loader.json')} autoPlay />
    </View>
  )
}

export default AppLoader

const styles = StyleSheet.create({
    container: {
<<<<<<< HEAD
      backgroundColor: "#305a82",
      shadowColor: 'black',
      height: "100%",
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      justifyContent: 'center',
      alignItems: 'center'
=======
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        zIndex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
>>>>>>> 12a6539e5759d9cad48c671e74d33a7b656c2377
    }
})