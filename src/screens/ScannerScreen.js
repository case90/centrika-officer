import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import httpClient from '../services/httpClient'
import { Camera } from 'expo-camera';
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const initialState = {
    error: false,
    isValidCode: false,
    message: null,
    scanned: false,
    fetchingData: false,
    hasPermission: false,
    type: Camera.Constants.Type.back,
    data: null,
}

const qrScannerReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return { 
                ...initialState, 
                hasPermission: state.hasPermission,
                scanned: false,
                data: null,
            }
        case 'SET_INVITATION_DATA':
            return { 
                ...state, 
                data: action.payload.data,
                fetchingData: false, 
                scanned: true, 
            }
        case 'SET_SUCCESS_PERMISSION':
            return { ...state, hasPermission: action.payload }
        case 'FETCHING_DATA':
            return { 
                ...state, 
                scanned: action.payload.scanned,
                isValidCode: action.payload.isValidCode,
                fetchingData: action.payload.fetchingData  }
        case 'SET_DENIED_PERMISSION':
            return { 
                ...state, 
                hasPermission: action.payload.hasPermission, 
                message: action.payload.message }
        case 'SET_INVALID_SCANNED_CODE':
            return { 
                ...state, 
                scanned: true,
                fetchingData: false,
                isValidCode: action.payload.isValidCode, 
                message: action.payload.message }
        case 'SET_SCANNED_STATUS':
            return { 
                ...state, 
                fetchingData: false,
                message: null,
                scanned: action.payload.scanned }
        default:
            return state
    }

}

const validateQrCode = (code) => {
    const scanned_code = parseInt(code);
    if(Number.isInteger(scanned_code))
        return true

    return false
}

const ScannerScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [state, dispatch] = useReducer(qrScannerReducer, initialState);

    const clearState = () => {
        dispatch({type: 'CLEAR_STATE' });
    }

    const handleBarCodeScanned = async({ data }) => {
        if(validateQrCode(data)){
            dispatch({ 
                type: 'FETCHING_DATA',
                payload: { fetchingData: true, scanned: true, isValidCode: true }
            });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token
            const invitation = await httpClient.get(`invitations/${data}`, {'Authorization': token});
            dispatch({ type: 'SET_INVITATION_DATA',  payload: { data: invitation } });
        }else{
            dispatch({ 
                type: 'SET_INVALID_SCANNED_CODE',
                payload: { 
                    isValidCode: false, message: 'El código QR escaneado no es un codigo valido.' }
            });
        }
    }

    const loadData = (data) => {
        navigation.navigate('CreateInvitation', { data })
    }
    
    const setScannedStatus = (status) => {
        dispatch({ 
            type: 'SET_SCANNED_STATUS', 
            payload: { 
                scanned: status 
            } 
        })
    }
    
    const requestCameraPermissions = async() => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if(status === 'granted')
            dispatch({ type: 'SET_SUCCESS_PERMISSION', payload: true })
        else
            dispatch({ 
                type: 'SET_DENIED_PERMISSION', 
                payload: {
                    hasPermission: false,
                    message: 'No tiene los permisos necesarios para el uso de la cámara, y no podrá hacer uso del escaner para el código QR.'
                } 
            })
    }

    useEffect(() => {
        requestCameraPermissions();
    }, []);

    return (
        <View style={styles.container}>
            {!state.hasPermission ?
                <Text>No tiene permisos para acceder al escaner.</Text>
            :
                isFocused &&
                <Camera 
                    style={styles.camera} 
                    type={state.type}
                    onBarCodeScanned={state.scanned ? undefined : handleBarCodeScanned}
                    barCodeScannerSettings={{
                        barCodeTypes: ['qr'],
                    }}>
                        <View style={{ flex: 3, backgroundColor: opacity }} />
                        <View style={{ flex: 4, flexDirection: 'row' }}>
                            <View style={{ flex: 1, backgroundColor: opacity }} />
                            <View style={{ flex: 5, backgroundColor: 'transparent' }} />
                            <View style={{ flex: 1, backgroundColor: opacity }} />
                        </View>
                        <View style={{ flex: 3, backgroundColor: opacity }}>
                            {state.scanned && !state.fetchingData ?
                                <View style={tw`flex-1 flex-row justify-evenly items-center`}>
                                    <TouchableOpacity
                                        style={tw`w-4/12 p-3 bg-white rounded-lg`}
                                        onPress={() => setScannedStatus(!state.scanned)}>
                                        <View style={tw`flex-row`}>
                                            <Icon name='qrcode' type='font-awesome' color='black' />
                                            <Text style={tw`ml-3 text-center`}>Escanear</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={tw`w-4/12 p-3 bg-white rounded-lg`}
                                        onPress={() => loadData(state.data)}>
                                        <View style={tw`flex-row`}>
                                            <Icon name='hdd-o' type='font-awesome' color='black' />
                                            <Text style={tw`ml-3 text-center`}>Cargar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                            }

                            { state.fetchingData && <ActivityIndicator style={tw`mt-5`} size="large" color="#ffffff" /> }
                            
                            {
                                (!state.isValidCode && state.scanned) &&
                                Alert.alert(
                                    "Error de QR",
                                    state.message,
                                    [{ 
                                        text: "OK", 
                                        onPress: () => setScannedStatus(!state.scanned)
                                    }]
                                )
                            }

                        </View>
                </Camera>
            }
        </View>
    )
}

export default ScannerScreen

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      camera: {
        flex: 1,
      },
      buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
      },
      button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
      },
      text: {
        fontSize: 18,
        color: 'white',
      },
})
