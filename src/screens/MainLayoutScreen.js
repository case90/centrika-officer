import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from 'tailwind-react-native-classnames';
import HomeScreen from './HomeScreen';
import QRScannerScreen from './QRScannerScreen';
import { Provider as QRScannerProvider } from '../context/QRScannerContext'

const AppStack = createNativeStackNavigator();

const MainLayoutScreen = () => {
    return (
        <SafeAreaView style={tw`flex-1`}>
            <View style={[ tw`pl-8 pr-8 flex-1`]}>
                <QRScannerProvider>
                    <AppStack.Navigator screenOptions={{ headerShown: false }}>
                        <AppStack.Screen name="HomeScreen" component={HomeScreen} />
                        <AppStack.Screen name="QRScannerScreen" component={QRScannerScreen} />
                    </AppStack.Navigator>
                </QRScannerProvider>
            </View>
        </SafeAreaView>
    )
}

export default MainLayoutScreen

