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
    incoming_type_id: INVITED_ENTRY_TYPE,
    data: [],
    employees: [],
    employee_quantity: null,
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
        case 'RENDER_ENTRY_TYPE_CONTENT':
            return { 
                ...state, 
                incoming_type_id: action.payload.incoming_type_id,
                data: []
            }     
        case 'DELETE_ENTRY_TYPE_ITEM':
            let data = state.data.filter((item) => item.id !== action.payload.id);
            return { ...state, data }
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
        case 'ADD_ENTRY_DATA_ITEM':
            let newData = [action.payload.data];
            if(action.payload.incoming_type_id === INVITED_ENTRY_TYPE)
                newData = [...state.data, action.payload.data];
                
            return { ...state, data: newData }
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
                incoming_type_id:  parseInt(action.payload.incoming_type_id),
                data: action.payload.data,
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

const initDefaultState = (dispatch) => {
    return async () => {
        try {
            dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token
            const colors = await httpClient.get(`car_colors`, {'Authorization': token});
            const streets = await httpClient.get(`streets`, {'Authorization': token});
            if(colors){
                dispatch({
                    type: 'SET_FORM_INITIAL_DATA', 
                    payload: { 
                        car_colors: colors,
                        user,
                        streets
                    } 
                });
            }else{
                dispatch({ 
                    type: 'SET_REQUEST_ERROR', 
                    payload: { 
                        error: true, 
                        message: 'No ha sido posible obtener los colores.' 
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

const handleEntryTypeContentRender = (dispatch, state) => {
    return async (incoming_type_id) => {
        if(state.data.length === 0){
            dispatch({
                type: 'RENDER_ENTRY_TYPE_CONTENT', 
                payload: { incoming_type_id } 
            });
        }else{
            Alert.alert(
                "Borrar registro",
                'Ya cuenta con un tipo de entrada registrado para esta invitacion, ¿Desea borrarlo?',
                [
                    {
                        text: "Cancelar"
                    },
                    {
                        text: "Ok",
                        onPress: () => dispatch({ type: 'RENDER_ENTRY_TYPE_CONTENT', payload: { incoming_type_id } }),
                    }
                ]
            )
        }
        
    }
}

const handleAddEntry = (dispatch) => {
    return async (data, type) => {
        let validated;
        if(type !== PROVIDER_ENTRY_TYPE )
            validated = validateEntryData(data)
        else
            validated = validateSupplierData(data)
            
        if(!validated.error){
            dispatch({
                type: 'ADD_ENTRY_DATA_ITEM',
                payload: {
                    data: { ...data, id: new Date().getTime() }, 
                    incoming_type_id: type, 
                }
            });
        }else{
            Alert.alert(
                "Ha ocurrido un error",
                validated.message,
                [{ 
                    text: "Aceptar"
                }]
            )
        }
    }
}

const handleDeleteEntryItem = (dispatch) => {
    return async (id) => {
        dispatch({ type: 'DELETE_ENTRY_TYPE_ITEM', payload: {id} });
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

const validateEntryData = (data) => {
    let result = { error: false }
    if(!data.name)
        return {...result, error: true, message: 'El nombre es requerido.'}
    if(!data.car_model)
        return {...result, error: true, message: 'El modelo es requerido.'}
    if(!data.car_color_id)
        return {...result, error: true, message: 'El color es requerido.'}
    if(!data.car_tag)
        return {...result, error: true, message: 'Las placas son requeridas.'}

    return result
}

const validateSupplierData = (data) => {
    let result = { error: false }
    if(!data.name)
        return {...result, error: true, message: 'El nombre es requerido.'}
    if(!data.car_model)
        return {...result, error: true, message: 'El modelo es requerido.'}
    if(!data.car_color_id)
        return {...result, error: true, message: 'El color es requerido.'}
    if(!data.car_tag)
        return {...result, error: true, message: 'Las placas son requeridas.'}
    if(!data.reason)
        return {...result, error: true, message: 'El equipo es requerido.'}
    if(!data.employee_quantity)
        return {...result, error: true, message: 'La cantidad de empleados es requerida.'}

    return result
}

export const { Context, Provider } = createDataContext(
    entranceReducer, 
    { 
        initDefaultState, 
        store, 
        clearState,
        loadInvitation,
        handleAddEntry, 
        handleSelectedDates,
        handleSelectedStreet,
        handleEntryTypeContentRender,
        handleDeleteEntryItem,
    },
    initialState
);