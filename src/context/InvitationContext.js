import { Alert } from 'react-native'
import createDataContext from './createDataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient'
import { INVITED_ENTRY_TYPE, PROVIDER_ENTRY_TYPE } from '../config/defines';
import * as rootNavigation from '../helpers/rootNavigation';
import moment from 'moment';

const initialState = {
    error: false,
    message: "",
    fetchingData: false,
    data: [],
}

const invitationReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return { 
                ...initialState,
                car_colors: state.car_colors,
                streets: state.streets,
            }
        case 'FETCHING_DATA':
            return { ...state, fetchingData: action.payload.fetchingData }  
        case 'SET_REQUEST_ERROR':
            return { 
                ...state, 
                error: true,
                message: action.payload.message,
                fetchingData: false
            }
        default:
            return state
    }

}

const clearState = (dispatch) => {
    return () => {
        dispatch({type: 'CLEAR_STATE' });
    }
}

const fetchInvitationById = (dispatch) => {
    return async (id) => {
        try {
            dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token
            const data = await httpClient.get(`invitations/${id}`, {'Authorization': token});
            console.log('fetchInvitationById ', data)
          
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


export const { Context, Provider } = createDataContext(
    invitationReducer, 
    { 
        clearState,
        fetchInvitationById, 
    },
    initialState
);