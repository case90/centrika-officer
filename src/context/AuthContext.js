import createDataContext from './createDataContext'
import httpClient from '../services/httpClient'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as rootNavigation from './../helpers/rootNavigation';
import { throwAlertError } from './../helpers/tools'

const initialState = {
    error: false,
    message: null,
    fetchingData: false,
    user: null,
}

const loginReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return initialState
        case 'FETCHING_DATA':
            return { 
                ...state, 
                error: false,
                message: null,
                fetchingData: action.payload.fetchingData
            }
        case 'SIGNIN':
            return { 
                ...state, 
                error: false,
                message: null,
                fetchingData: false,
                user: action.payload.user
            }
        case 'SIGNOUT':
            return { ...state, user: null, message: null, fetchingData: false }
        case 'SET_RESPONSE_ERROR':
            return { 
                ...state, 
                error: true,
                message: action.payload.message,
                fetchingData: false,
                user: null
            }
        case 'SET_REQUEST_ERROR':
            return { 
                ...state, 
                error: true,
                message: action.payload.message,
                fetchingData: false,
                user: null
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

const tryLocalSignin = (dispatch) => {
    return async () => {
        dispatch({type: 'FETCHING_DATA', payload: { fetchingData: true } });
        const user = JSON.parse(await AsyncStorage.getItem('user'))
        if(user){
            dispatch({ type: 'SIGNIN', payload: { user } });
        }else{
            dispatch({ type: 'SIGNOUT' });
        }
    }
}

const signin = (dispatch) => {
    return async ({ email, password }) => {
        dispatch({type: 'FETCHING_DATA', payload: { fetchingData: true } });
        try {
            tryAuth(email, password, dispatch);
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

const signout = (dispatch) => {
    return async () => {
        await AsyncStorage.removeItem('user')
        dispatch({ type: 'SIGNOUT' });
    }
}

const tryAuth = async (email, password, dispatch) => {
    dispatch({type: 'FETCHING_DATA', payload: { fetchingData: true } });
    const response = await httpClient.post('auth/login', {email, password})
    if ('errors' in response){
        dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: false } })
        throwAlertError(
            "Error en autentificacion", 
            response.errors,
        );
    }else{
        const user = { ...response.user, token: `${response.token_type} ${response.token}`, expires_at: response.expires_at }
        await AsyncStorage.setItem('user', JSON.stringify(user))
        dispatch({ type: 'SIGNIN', payload: { user } });
    }
}

export const { Context, Provider } = createDataContext(
    loginReducer, 
    { signin, signout, tryLocalSignin, clearState },
    initialState
);