import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './../helpers/rootNavigation'
import AuthScreen from './../screens/AuthScreen';

const Stack = createNativeStackNavigator();

const AuthLayout = () => {
    return (
        <NavigationContainer ref={navigationRef} theme={{ colors: { background: 'white' } }}>
            <Stack.Navigator 
            initialRouteName="LoadingScreen" 
            screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AuthScreen" component={AuthScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AuthLayout
