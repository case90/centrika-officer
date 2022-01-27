import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames'
import { Context as AuthContext} from './../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import MainMenuOption from './../components/MainMenuOption'

const HomeScreen = () => {
    const navigation = useNavigation();
    const { state, signout } = useContext(AuthContext);

    return (
        <ScrollView 
            showsVerticalScrollIndicator={false}>
            <View style={tw`p-5`}>
                <Text style={tw`text-xl font-bold mb-1 text-gray-700`}>¡Bienvenido/a!</Text>
                <Text style={tw`text-gray-700`}>{state.user.full_name}</Text>
            </View>
            <View style={tw`mb-5 p-8`}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('EntranceCreateForm')} >
                        <MainMenuOption icon="user" title="Crear Entrada"/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => signout()}>
                        <MainMenuOption icon="sign-out" title="Salir" size={39}/>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
