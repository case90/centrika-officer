import { Alert } from 'react-native'
import createDataContext from './createDataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient'
import * as rootNavigation from '../helpers/rootNavigation';
import moment from 'moment';

const initialState = {
    error: false,
    message: "",
    fetchingData: false,
    initial_date: "",
    final_date: "",
    car_colors: [],
    streets: [],
    street_id: null,
    car_tag: "",
    name: "",
    number: "",
    neighbor: "",
    car_model: "",
    reason_id: 1,
    car_color_id: null,
    equip_description: "",
    company: "",
    reason: "",
    incoming_time: null,
    data: [],
    user: null
}

const entranceReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return { 
                ...initialState,
                car_colors: state.car_colors,
                streets: state.streets,
            }
        case 'FETCHING_DATA':
            return { ...state, fetchingData: action.payload.fetchingData }
        case 'SET_INITIAL_DATE':
            return { ...state, initial_date: action.payload.initial_date }
        case 'SET_FINAL_DATE':
            return { ...state, final_date: action.payload.final_date }
        case 'SET_STREET_ID':
            return { ...state, street_id: action.payload.street_id }
        case 'SET_FORM_INITIAL_DATA':
            return { 
                ...state,
                car_colors: action.payload.car_colors,
                user: action.payload.user,
                streets: action.payload.streets,
                fetchingData: false,
                error: false,
                message: ""
            }
        case 'SET_REQUEST_ERROR':
            return { 
                ...state, 
                error: true,
                message: action.payload.message,
                fetchingData: false
            }
        case 'LOAD_INVITATION_DATA':
            return { 
                ...state,
                ...action.payload.data[0],
                number: action.payload.address.number,
                neighbor: action.payload.address.neighbor.name,
                street_id: action.payload.address.street.id,
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

const initEntranceDefaultState = (dispatch) => {
    return async () => {
        try {
            dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token
            const streets = await httpClient.get(`streets`, {'Authorization': token});
            if(streets){
                dispatch({
                    type: 'SET_FORM_INITIAL_DATA', 
                    payload: { user, streets } 
                });
            }else{
                dispatch({ 
                    type: 'SET_REQUEST_ERROR', 
                    payload: { 
                        error: true, 
                        message: 'No ha sido posible obtener las calles.' 
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

const loadInvitation = (dispatch) => {
    return async (data) => {
        if(data){
            dispatch({ 
                type: 'LOAD_INVITATION_DATA',
                payload: {...data }
            });
        }else{
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

const store = (dispatch) => {
    return async (data) => {
        try {
            const validated = validateInvitationData(data);
            if(!validated.error){
                dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
                const user = JSON.parse(await AsyncStorage.getItem('user'));
                const token = user.token
                const response = await httpClient.post('invitations', data, { 'Authorization': token });
                if(response){
                    dispatch({ type: 'CLEAR_STATE' })
                    rootNavigation.navigate('QrView', { data: response })
                }else{
                    Alert.alert(
                        "Ha ocurrido un error",
                        'No ha sido posible crear el registro.',
                        [{ 
                            text: "Aceptar", 
                            onPress: dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: false } })
                        }]
                    )
                }
            }else{
                Alert.alert(
                    "Ha ocurrido un error",
                    validated.message,
                    [{ 
                        text: "Aceptar",
                    }]
                )
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

const handleSelectedDates = (dispatch) => {
    return async (date, type) => {
        const formatedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        if(type === 'initial_date')
            dispatch({ type: 'SET_INITIAL_DATE', payload: { initial_date: formatedDate } });
        else
            dispatch({ type: 'SET_FINAL_DATE', payload: { final_date: formatedDate } });
    }
}

const handleSelectedStreet = (dispatch) => {
    return async (street_id) => {
        dispatch({ type: 'SET_STREET_ID', payload: { street_id } });
    }
}

const validateInvitationData = (data) => {
    let result = { error: false }
    if(!data.initial_date || !data.final_date)
        return {...result, error: true, message: 'Debe seleccionar una fecha de entrada y una de salida.'}
    if(data.data.length === 0)
        return {...result, error: true, message: 'Debe agregar un tipo de entrada.'}

    return result
}

export const { Context, Provider } = createDataContext(
    entranceReducer, 
    { 
        initEntranceDefaultState, 
        store, 
        clearState,
        loadInvitation,
        handleSelectedDates,
        handleSelectedStreet,
    },
    initialState
);