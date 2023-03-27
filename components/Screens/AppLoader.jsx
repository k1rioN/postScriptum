import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AnimatedLottieView from 'lottie-react-native'

const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <AnimatedLottieView source={require('../../assets/loader.json')} autoPlay loop renderMode={"SOFTWARE"} />
    </View>
  )
}

export default AppLoader

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        zIndex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
})