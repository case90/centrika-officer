import { Alert } from 'react-native'
import createDataContext from './createDataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient'
import { INVITED_ENTRY_TYPE, PROVIDER_ENTRY_TYPE } from '../config/defines';
import * as rootNavigation from '../helpers/rootNavigation';
import moment from 'moment';

const initialState = {
    error: false,
    message: '',
    fetchingData: false,
    scannerVisibilityState: true,
    data: null,
}

const invitationReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return { 
                ...initialState,
            }
        case 'FETCHING_DATA':
            return { ...state, fetchingData: action.payload.fetchingData }  
        case 'SET_SCANNER_VISIBILITY_STATE':
            return { ...state, scannerVisibilityState: action.payload.scannerVisibilityState }  
        case 'SET_REQUEST_ERROR':
            return { 
                ...state, 
                error: true,
                message: action.payload.message,
                fetchingData: false
            }
        case 'SET_INVITATION_DATA':
            return { 
                ...state, 
                data: action.payload.data,
                fetchingData: false,
                error: false,
                scannerVisibilityState: false,
                message: '' }
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

const fetchInvitationById = (dispatch) => {
    return async (id) => {
        try {
            if(validateQrCode(id)){
                dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
                const user = JSON.parse(await AsyncStorage.getItem('user'));
                const token = user.token
                const data = await httpClient.get(`invitations/${id}`, {'Authorization': token});
                console.log(`invitations/${id}`)
                dispatch({ 
                    type: 'SET_INVITATION_DATA', 
                    payload: { data } 
                });
            }else{
                dispatch({ 
                    type: 'SET_REQUEST_ERROR',
                    payload: { 
                        error: true, 
                        message: 'El código QR escaneado no es un codigo valido.' }
                });
            }
        } catch (error) {
            dispatch({ 
                type: 'SET_REQUEST_ERROR', 
                payload: { 
                    error: true, 
                    message: 'Por el momento el servicio no está disponible, inténtelo mas tarde.' 
                } 
            });
        }
        
        
    }
}

const setScannerVisibilityState = (dispatch) => {
    return async (state) => {
        dispatch({ 
            type: 'SET_SCANNER_VISIBILITY_STATE', 
            payload: { 
                scannerVisibilityState: state 
            } 
        });
    }
}

const laodInvitationByGuestId = (dispatch) => {
    return async (id, currentState) => {
        dispatch({ type: 
            'FETCHING_DATA', 
            payload: { 
                fetchingData: true 
            } 
        });
        const data = { ...currentState, data: filterGuestById(id, currentState.data) }
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        rootNavigation.navigate('EntranceCreateForm', { data, timestamp })
        dispatch({type: 'CLEAR_STATE' });
    }
}

const filterGuestById = (id, guests) => {
    return guests.filter(guest => guest.id == id);
}

export const { Context, Provider } = createDataContext(
    invitationReducer, 
    { 
        clearState,
        fetchInvitationById, 
        laodInvitationByGuestId,
        setScannerVisibilityState,
    },
    initialState
);