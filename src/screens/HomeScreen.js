import React from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}>
            <Text>Bienvenido a Centrika App</Text>
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
