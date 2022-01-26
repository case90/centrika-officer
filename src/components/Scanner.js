import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Icon } from 'react-native-elements'
import { useIsFocused } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const initialState = {
    error: false,
    isValidCode: false,
    message: null,
    scanned: false,
    fetchingData: false,
    hasPermission: true,
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
        case 'SET_SUCCESS_PERMISSION':
            return { ...state, fetchingData: false, hasPermission: action.payload }
        case 'FETCHING_DATA':
            return { 
                ...state, 
                scanned: action.payload.scanned,
                isValidCode: action.payload.isValidCode,
                fetchingData: action.payload.fetchingData  }
        case 'SET_DENIED_PERMISSION':
            return { 
                ...state, 
                fetchingData: false, 
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

const Scanner = ({ onScanner, onPressBack, onPressCloseButton }) => {
    const isFocused = useIsFocused();
    const [state, dispatch] = useReducer(qrScannerReducer, initialState);

    const clearState = () => {
        dispatch({type: 'CLEAR_STATE' });
    }

    const handleBarCodeScanned = async({ data }) => {
        onScanner(data)
        dispatch({ 
            type: 'SET_SCANNED_STATUS', 
            payload: { 
                scanned: true 
            } 
        })
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
                <View style={tw`flex-1 items-center justify-center`}>
                    <Text style={tw`text-xl text-center text-black`}>No tiene permisos para acceder al escaner.</Text>
                    <Button
                        title="Otorgar permisos"
                        titleStyle={{ fontWeight: '500' }}
                        buttonStyle={{
                            backgroundColor: '#ee8920',
                            borderColor: 'transparent',
                            borderWidth: 0,
                        }}
                        containerStyle={{
                            width: 200,
                            height: 45,
                            marginHorizontal: 50,
                            marginVertical: 10,
                        }}
                        onPress={() => requestCameraPermissions()}
                        loading={state.fetchingData}
                    />
                </View>
                
            :
                isFocused &&
                <Camera 
                    style={styles.camera} 
                    type={state.type}
                    onBarCodeScanned={state.scanned ? undefined : handleBarCodeScanned}
                    barCodeScannerSettings={{
                        barCodeTypes: ['qr'],
                    }}>
                        <View style={{ flex: 3, backgroundColor: opacity, alignItems: 'flex-start', flexDirection: 'row' }}>
                            <View style={tw`flex-1 flex-row justify-between mt-5 pl-5 pr-5`}>
                                <TouchableOpacity
                                    style={[tw`p-3 justify-center bg-white rounded-full`, {width: 50, height: 50}]}
                                    onPress={onPressBack}>
                                    
                                        <Icon name='undo' type='font-awesome' color='black' />
                                   
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[tw`p-3 justify-center bg-white rounded-full`, {width: 50, height: 50}]}
                                    onPress={() => onPressCloseButton()}>
                                   
                                        <Icon name='times-circle' type='font-awesome' color='black' />
                                
                                </TouchableOpacity>
                            </View>
                        </View>
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
                                </View>
                                :
                                null
                            }

                            { state.fetchingData && <ActivityIndicator style={tw`mt-5`} size="large" color="#ffffff" /> }

                        </View>
                </Camera>
            }
        </View>
    )
}

export default Scanner

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
