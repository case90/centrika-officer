import React, { useContext } from 'react';
import { Text, View, Alert, ScrollView, ImageBackground } from 'react-native';
import Logo from '../components/Logo';
import tw from 'tailwind-react-native-classnames';
import InputForm from '../components/forms/InputForm';
import ButtonFrom from '../components/forms/ButtonFrom';
import { Context as AuthContext} from '../context/AuthContext';
import Images from '@assets/images';
import { AuthSchema } from './../config/schemas';
import useHandleOnChangeTextInput from './../hooks/useHandleOnChangeTextInput';

const AuthScreen = () => {
    const { state, signin, clearState } = useContext(AuthContext);
    const [inputState, handleInputChange] = useHandleOnChangeTextInput(AuthSchema);
   
    return (
        <ImageBackground source={Images.background_auth} resizeMode="cover" style={tw`flex-1 items-end flex-row bg-green-300`}>
            <View style={tw`rounded-t-3xl h-2/3 flex-1 bg-white`}>
                <ScrollView contentContainerStyle={tw`items-center`}>
                    <Logo size='md' style={tw`pt-8`} />
                    <Text style={tw`text-3xl mt-5 font-bold text-gray-600`}>Iniciar Sesión</Text>
                    <Text style={tw`w-2/3 text-center mt-3 font-bold text-gray-400`}>Favor de introducir tus credenciales para continuar</Text>
                    <View style={tw`w-4/5 mt-8`}>
                        <InputForm 
                            name='username' 
                            placeholder='Correo electrónico'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            onChangeText={(value) => handleInputChange(value, 'email')} />
                        <InputForm 
                            name='password' 
                            placeholder='Contraseña' 
                            secureTextEntry={true}
                            onChangeText={(value) => handleInputChange(value, 'password')} />
                        <ButtonFrom 
                            placeholder='Iniciar sesión'
                            secureTextEntry={true}
                            loading={ state.fetchingData ? true : false }
                            handleSubmit={() => {
                                signin(inputState);
                            }}
                        />
                    </View>
                    {
                        state.error === true 
                            ?
                                Alert.alert(
                                    "Error de Autentificacion",
                                    state.message,
                                    [{ 
                                        text: "OK", 
                                        onPress: clearState
                                    }]
                                ) 
                            :
                            null
                    }
                </ScrollView>
            </View>
        </ImageBackground >
    )
}

export default AuthScreen
