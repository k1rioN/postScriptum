import React, { createContext, useState } from "react";
import { Button } from 'react-native';
import Home from './components/Screens/Home'
import Profile from './components/Screens/Profile'
import Auth from './components/Screens/Auth'
import Reg from './components/Screens/Reg'
import Post from "./components/Posts/Post";
import { isAuthStateChanged } from 'firebase/auth'


import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { back } from "react-native/Libraries/Animated/Easing";

const Stack = createStackNavigator();

export default function Navigate({ navigation }) {

    return <NavigationContainer>
        <Stack.Navigator defaultScreenOptions={Home} screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="Auth"
                component={Auth}
                
                options={
                    {
                        title: 'ПостСкриптум',
                        headerStyle: {
                            height: 100,
                            backgroundColor: '#ffff',
                        },
                        headerTitleStyle: {
                            fontSize: 20
                        },
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
                            height: 100,
                            backgroundColor: '#ffff',
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 20,
                        },
                        headerBackTitleVisible: false,
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
                name="Profile"
                component={Profile}
                options={
                    {
                        title: 'Профиль',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 24,
                        },
                        headerBackTitleVisible: false,
                    }
                }
            />
            <Stack.Screen 
                name="Post"
                component={Post}
                options={
                    {
                        title: 'Пост',
                        headerStyle: {
                            height: 100,
                            backgroundColor: 'white',
                        },
                        headerTitleStyle: {
                            color: 'black',
                            fontSize: 23,
                        },
                        headerBackTitleVisible: false,
                    }
                }
            />
        </Stack.Navigator>
    </NavigationContainer>
}