import { Alert } from 'react-native'
import createDataContext from './createDataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient'
import * as rootNavigation from '../helpers/rootNavigation';
import { PROVIDER_ENTRY_TYPE } from './../config/defines';
import moment from 'moment';

const initialState = {
    error: false,
    message: "",
    fetchingData: false,
    car_colors: [],
    streets: [],
    address: [],
    street_id: null,
    car_tag: "",
    name: "",
    number: "",
    neighbor: null,
    car_model: "",
    reason_id: 1,
    car_color_id: null,
    equip_description: "",
    company: "",
    equip_description: "",
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
        case 'SET_NEIGHBOR_NAME':
            return { 
                ...state,
                neighbor: action.payload.neighbor,
                fetchingData: false,
                error: false,
                message: ""
            }
        case 'SET_ADDRESS_NUMBER':
            return { 
                ...state,
                number: action.payload.number,
            }
        case 'SET_CAR_TAG_VALUE':
            return { 
                ...state,
                car_tag: action.payload.car_tag,
            }
        case 'SET_REQUEST_ERROR':
            return { 
                ...state, 
                error: true,
                message: action.payload.message,
                fetchingData: false
            }
        case 'DELETE_NEIGHBOR_ADDRESS':
            let address = state.address.filter((item) => item.id !== action.payload.id)
            return { ...state, address }
        case 'UPDATE_NEIGHBOR_NAME':
            return { ...state, neighbor: action.payload.neighbor }
        case 'LOAD_INVITATION_DATA':
            return { 
                ...state,
                ...action.payload.data[0],
                number: action.payload.address.number,
                neighbor: action.payload.address.neighbor.name,
                street_id: action.payload.address.street.id,
                fetchingData: false
            }
        case 'SET_CAR_TAG_SEARCH_RESPONSE':
            return { 
                ...state,
                error: false,
                message: "",
                fetchingData: false,
                neighbor: action.payload.response.address.neighbor.name,
                address: [action.payload.response.address],
                street_id: parseInt(action.payload.response.address.street_id),
                number: action.payload.response.address.number,
            }
        default:
            return state
    }

}

const createEntrance = async(data, dispatch) => {
    try {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const token = user.token
        const response = await httpClient.post('incomings', data, { 'Authorization': token });
        if(response.status){
            dispatch({type: 'CLEAR_STATE' });
            Alert.alert(
                "Correcto",
                response.message,
                [{ 
                    text: "Aceptar",
                    onPress: () => rootNavigation.navigate('Inicio')
                }]
            )
        }else{
            Alert.alert(
                "Ha ocurrido un error",
                response.message,
                [{ 
                    text: "Aceptar",
                }]
            )
        }
    } catch (error) {
        Alert.alert(
            "Ha ocurrido un error",
            "Por el momento el servicio no est?? disponible, int??ntelo mas tarde.",
            [{ 
                text: "Aceptar",
            }]
        )
    }
    
}

const prepareEntranceRequest = (entranceState, incomeState) => {
    
    if(!entranceState.car_tag)
        return { error: true, message: 'Debe capturar una placa.' }
    if(!entranceState.street_id)
        return { error: true, message: 'Debe seleccionar una calle.' }
    if(!entranceState.number)
        return { error: true, message: 'Debe capturar una n??mero de casa valido.' }
    if(!entranceState.neighbor)
        return { error: true, message: 'Debe capturar una nombre de vecino.' }
    if(incomeState.data.length === 0)
        return { error: true, message: 'Debe agregar un tipo de entrada.' }
    
    let result = {
        error: false,
        incoming_type_id: incomeState.incoming_type_id,
        incoming_time: moment().format('YYYY-MM-DD H:m:s'),
        car_tag: entranceState.car_tag,
        street_id: entranceState.street_id,
        number: entranceState.number,
        neighbor: entranceState.neighbor,
        name: incomeState.data[0].name,
        company: incomeState.data[0].name,
        car_model: incomeState.data[0].car_model,
        car_color_id: incomeState.data[0].car_color_id,
        equip_description: incomeState.data[0].equip_description,
        reason: incomeState.data[0].equip_description,
        reason_id: incomeState.data[0].reason_id,
        employee_quantity: incomeState.employee_quantity,
        employees: incomeState.employees
    }

    if(incomeState.incoming_type_id == PROVIDER_ENTRY_TYPE){
        for (let i = 0; i < result.employees.length; i++) {
            if((!result.employees[i].name.trim() || !result.employees[i].surname.trim()) && result.employees.length > 0 ){
                return { error: true, message: 'Debe capturar un nombre y apellido para cada empleado.' }
            }
        }
    }
    return result;
}

const getProviderObjectFormatType = (incoming) => {
    return {
        incoming_type_id:  incoming.incoming_type_id,
        employee_quantity: incoming.data[0]?.employee_quantity,
        employees: incoming.data[0]?.employees,
        data: [{
            car_color_id: parseInt(incoming.car_color_id),
            car_model: incoming.car_model,
            car_tag: incoming.car_tag,
            employee_quantity: incoming.data[0]?.employee_quantity,
            id: incoming.data[0]?.id,
            name: incoming.name,
            equip_description: incoming.equip_description,
        }],
    }
}

const getEntryTypeStandadObjectFormat = (incoming) => {
    return {
        incoming_type_id:  incoming.incoming_type_id,
        employee_quantity: 1,
        employees: [],
        data: [{
            car_color_id: parseInt(incoming.car_color_id),
            car_model: incoming.car_model,
            car_tag: incoming.car_tag,
            employee_quantity: 1,
            id: incoming.id,
            name: incoming.name,
            equip_description: incoming.equip_description,
        }],
    }
}

const createIncomeStateFormat = (incoming) => {

    let result = null;

    result = getEntryTypeStandadObjectFormat(incoming)
    if(incoming.incoming_type_id == PROVIDER_ENTRY_TYPE)
        result = getProviderObjectFormatType(incoming)

    return result
}

const store = (dispatch) => {
    return async(entranceState, incomeState) => {
        const reqData = prepareEntranceRequest(entranceState, incomeState);
        if(!reqData.error){
            createEntrance(reqData, dispatch);
        }else{
            Alert.alert(
                "Ha ocurrido un error",
                reqData.message,
                [{ 
                    text: "Aceptar",
                }]
            )
        }        
    }
}

const clearState = (dispatch) => {
    return () => {
        dispatch({type: 'CLEAR_STATE' });
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
                    message: 'Por el momento el servicio no est?? disponible, int??ntelo mas tarde.' 
                } 
            });
        }

    }
}

const setCarTagValue = (dispatch) => {
    return async (car_tag) => {
        dispatch({ 
            type: 'SET_CAR_TAG_VALUE',
            payload: { car_tag }
        });
    }
}

const setAddressNumber = (dispatch) => {
    return async (number) => {
        dispatch({ 
            type: 'SET_ADDRESS_NUMBER',
            payload: { number }
        });
    }
}

const updateNeighborName = (dispatch) => {
    return async (name) => {
        dispatch({ 
            type: 'UPDATE_NEIGHBOR_NAME', 
            payload: { neighbor: name } 
        });
    }
}

const setFetchTagResponse = (dispatch) => {
    return async(car_tag, setIncomeData) => {
        try {
            dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token
            const response = await httpClient.get(`incomings?car_tag=${car_tag}`, {'Authorization': token});
            if(Object.keys(response).length > 0){
                const incomeData = createIncomeStateFormat(response);
                setIncomeData(incomeData);
                dispatch({ 
                    type: 'SET_CAR_TAG_SEARCH_RESPONSE', 
                    payload: { response } 
                });
            }else{
                Alert.alert(
                    "Ha ocurrido un error",
                    `No se encontraron registros para el n??mero de placas: ${car_tag}.`,
                    [{ 
                        text: "Aceptar", 
                        onPress: dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: false } })
                    }]
                )
            }
        } catch (error) {
            dispatch({ 
                type: 'SET_REQUEST_ERROR', 
                payload: { 
                    error: true, 
                    message: 'Por el momento el servicio no est?? disponible, int??ntelo mas tarde.' 
                } 
            });
        }
    }
}

const fetchNeighborAddress = (dispatch) => {
    return async(number, street_id) => {
        try {
            if(number && street_id){
                dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
                const user = JSON.parse(await AsyncStorage.getItem('user'));
                const token = user.token
                const response = await httpClient.get(`addresses?number=${number}&street_id=${street_id}`, {'Authorization': token});
                if(response.length > 0){
                    dispatch({ 
                        type: 'SET_NEIGHBOR_NAME', 
                        payload: { neighbor: response[0].neighbor.name } 
                    });
                }else{
                    Alert.alert(
                        "Ha ocurrido un error",
                        `No se encontraron registros para la direcci??n con n??mero ${number} calle ${street_id}.`,
                        [{ 
                            text: "Aceptar", 
                            onPress: dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: false } })
                        }]
                    )
                }
            }else{
                Alert.alert(
                    "Ha ocurrido un error",
                    'Debe seleccionar una calle y escribir un n??mero valido de casa.',
                    [{ 
                        text: "Aceptar", 
                        onPress: dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: false } })
                    }]
                )
            }
         
        } catch (error) {
            dispatch({ 
                type: 'SET_REQUEST_ERROR', 
                payload: { 
                    error: true, 
                    message: 'Por el momento el servicio no est?? disponible, int??ntelo mas tarde.' 
                } 
            });
        }
    }
}

const handleSelectedStreet = (dispatch) => {
    return async (street_id) => {
        dispatch({ type: 'SET_STREET_ID', payload: { street_id } });
    }
}

const deleteNeighborAddress = (dispatch) => {
    return async (id) => {
        dispatch({
            type: 'DELETE_NEIGHBOR_ADDRESS',
            payload: { id }
        });
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
                    message: 'Por el momento el servicio no est?? disponible, int??ntelo mas tarde.' 
                } 
            });
        }
        
        
    }
}

export const { Context, Provider } = createDataContext(
    entranceReducer, 
    { 
        store, 
        clearState,
        loadInvitation,
        setCarTagValue,
        setAddressNumber,
        updateNeighborName,
        setFetchTagResponse,
        fetchNeighborAddress,
        handleSelectedStreet,
        deleteNeighborAddress,
        initEntranceDefaultState,
    },
    initialState
);