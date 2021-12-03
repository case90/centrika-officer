import createDataContext from './createDataContext'
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient'
import * as rootNavigation from '../helpers/rootNavigation';

const initialState = {
    error: false,
    isValidCode: false,
    message: null,
    scanned: false,
    fetchingData: false,
    hasPermission: false
}

const qrScannerReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return { ...initialState }
        case 'SET_VALID_SCANNED_CODE':
            return { 
                ...state, 
                fetchingData: action.payload.fetchingData, 
                isValidCode: action.payload.isValidCode, 
                scanned: action.payload.scanned, 
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

const clearState = (dispatch) => {
    return () => {
        dispatch({type: 'CLEAR_STATE' });
    }
}

const validateQrCode = (code) => {
    const scanned_code = parseInt(code);
    if(Number.isInteger(scanned_code))
        return true

    return false
}

const handleBarCodeScanned = (dispatch) => {
    return async ({ data }) => {
        if(validateQrCode(data)){
            dispatch({ 
                type: 'FETCHING_DATA',
                payload: { fetchingData: true, scanned: true, isValidCode: true }
            });
            const response = await fetchSchedule(data);
            if(!response.error){
                dispatch({ 
                    type: 'SET_VALID_SCANNED_CODE',
                    payload: { isValidCode: true, fetchingData: false, scanned: true }
                });
                rootNavigation.navigate('ScheduleViewScreen', response)
            }else{
                dispatch({ 
                    type: 'SET_INVALID_SCANNED_CODE',
                    payload: { isValidCode: false, message: response.message }
                });
            }
        }else{
            dispatch({ 
                type: 'SET_INVALID_SCANNED_CODE',
                payload: { 
                    isValidCode: false, message: 'El código QR escaneado no es un codigo valido.' }
            });
        }
    }
}

const fetchSchedule = async (id) => {
    try {
        const newId = id.replace(/'/g, '')
        const user = JSON.parse(await AsyncStorage.getItem('user'))
        const token = user.token
        const response = await httpClient
            .get(`schedules/${newId}`,
                {
                    'Authorization': `Bearer ${token}`,
                }
            )
        if(!response.ObjetoSimple){
            return {
                error: true,
                message: 'Éste código de barras ya no es un codigo válido.'
            };
        }else{
            return response;
        }
    } catch (error) {
        return {
            error: true,
            message: 'No ha sido posible obtener la informacion, favor de intentar mas tarde.'
        };
    }
}

const setScannedStatus = (dispatch) => {
    return async (status) => {
        dispatch({ 
            type: 'SET_SCANNED_STATUS', 
            payload: { 
                scanned: status 
            } 
        })
    }
}

const requestBarcodeScannerPermissions = (dispatch) => {
    return async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
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
}

export const { Context, Provider } = createDataContext(
    qrScannerReducer, 
    { handleBarCodeScanned, setScannedStatus, requestBarcodeScannerPermissions },
    initialState
);