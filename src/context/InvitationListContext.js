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
    invitations: []
}

const invitationListReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return { ...initialState }
        case 'FETCHING_DATA':
            return { ...state, fetchingData: action.payload.fetchingData }
        case 'SET_INVITATION_LIST_DATA':
            return { 
                ...state, 
                fetchingData: false,
                error: false,
                message: "",
                invitations: action.payload.invitations 
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

const fetchInvitations = (dispatch) => {
    return async () => {
        try {
            dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token;
            const response = await httpClient
                .get(`invitations?neighbor_id=${user.neighbor.id}&orderBy=id&order=desc&paginate=true&per_page=10`, {
                    'Authorization': token,
                }
            );
            if(response){
                dispatch({
                    type: 'SET_INVITATION_LIST_DATA', 
                    payload: { 
                        invitations: response.data
                    } 
                });
            }else{
                dispatch({ 
                    type: 'SET_REQUEST_ERROR', 
                    payload: { 
                        error: true, 
                        message: 'No se encontraron invitaciones anteriores.' 
                    } 
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

export const { Context, Provider } = createDataContext(
    invitationListReducer, 
    { 
        clearState,
        fetchInvitations,
    },
    initialState
);