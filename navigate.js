import React, { createContext, useState } from "react";
import { Button } from 'react-native';
import Home from './components/Screens/Home'
import Auth from './components/Screens/Auth'
import Reg from './components/Screens/Reg'
import Profile from './components/Screens/Profile'
import Friends from './components/Screens/Friends'
import OtherProfile from './components/Screens/OtherProfile'
import Settings from './components/Screens/Settings'
import { TouchableOpacity } from "react-native-gesture-handler";
import Onboarding from "./components/Screens/Onboarding";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


const Stack = createStackNavigator();

export default function Navigate({ navigation }) {

    return <NavigationContainer>
        <Stack.Navigator defaultScreenOptions={Home}>
            <Stack.Screen 
                name="Auth"
                component={Auth}
                options={
                    {
                        title: 'ПостСкриптум',
                        headerStyle: {
                            height: 0,
                            backgroundColor: '#ffff',
                        },
                        headerTitleStyle: {
                            fontSize: 20
                        },
                        headerBackTitleVisible: false,
                        headerShown: false,
                        gestureEnabled: false
                    }
                }
            />
            <Stack.Screen 
                name="Reg"
                component={Reg}
                options={
                    {
                        title: 'ПостСкриптум',
                        headerStyle: {
                            height: 0,
                            backgroundColor: '#ffff',
                        },
                        headerBackTitleVisible: false,
                        headerShown: false,
                        gestureEnabled: false
                    }
                }
            />
            <Stack.Screen 
                name="Home"
                component={Home}
                options={({ navigation, route }) => ({
                        title: 'Новости',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 24,
                        },
                        headerBackTitleVisible: false,
                        headerShown: false,
                        gestureEnabled: false
                    })}
            />
            <Stack.Screen 
                name="Профиль"
                component={Profile}
                options={({ navigation, route }) => ({
                        title: 'Профиль',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowColor: 'transparent',
                            shadowOpacity: 0,
                            borderBottomWidth: 0,
                            shadowRadius: 0,
                            shadowOffset: {
                                height: 0,
                            },
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 24,
                        },
                        headerShadowVisible: false,
                        headerShown: false,
                    })}
            />
            <Stack.Screen 
                name="Другой профиль"
                component={OtherProfile}
                options={({ navigation, route }) => ({
                        title: 'Профиль',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowColor: 'transparent',
                            shadowOpacity: 0,
                            borderBottomWidth: 0,
                            shadowRadius: 0,
                            shadowOffset: {
                                height: 0,
                            },
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 24,
                        },
                        headerShadowVisible: false,
                        headerShown: false,
                    })}
            />
            <Stack.Screen 
                name="Друзья"
                component={Friends}
                options={({ navigation, route }) => ({
                        title: 'Профиль',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowColor: 'transparent',
                            shadowOpacity: 0,
                            borderBottomWidth: 0,
                            shadowRadius: 0,
                            shadowOffset: {
                                height: 0,
                            },
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 24,
                        },
                        headerShadowVisible: false,
                        headerShown: false,
                    })}
            />
            <Stack.Screen 
                name="Settings"
                component={Settings}
                options={({ navigation, route }) => ({
                        title: 'Настройки',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowColor: 'transparent',
                            shadowOpacity: 0,
                            borderBottomWidth: 0,
                            shadowRadius: 0,
                            shadowOffset: {
                                height: 0,
                            },
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 24,
                        },
                        headerShadowVisible: false,
                        headerShown: false,
                    })}
            />
            <Stack.Screen 
                name="Welcome"
                component={Onboarding}
                options={({ navigation, route }) => ({
                        title: 'Настройки',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowColor: 'transparent',
                            shadowOpacity: 0,
                            borderBottomWidth: 0,
                            shadowRadius: 0,
                            shadowOffset: {
                                height: 0,
                            },
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 24,
                        },
                        headerShadowVisible: false,
                        headerShown: false,
                    })}
            />
        </Stack.Navigator>
    </NavigationContainer>
}