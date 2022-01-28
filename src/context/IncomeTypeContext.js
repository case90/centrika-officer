import { Alert } from 'react-native'
import createDataContext from './createDataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/httpClient'
import { INVITED_ENTRY_TYPE, PROVIDER_ENTRY_TYPE, MAX_EMPLOYEE_QUANTITY } from '../config/defines';

const initialState = {
    error: false,
    message: "",
    fetchingData: false,
    incoming_type_id: INVITED_ENTRY_TYPE,
    employee_quantity: 1,
    data: [],
    employees: [],
    car_colors: [],
    reason_list: [
        { reason: 'Entrega de comida', value: '1' },
        { reason: 'Paqueteria', value: '2' },
        { reason: 'Super', value: '3' },
        { reason: 'Otros', value: '4' },
    ],
}

const incomeTypeReducer = (state = initialState, action) => {

    switch(action.type){
        case 'CLEAR_STATE':
            return { ...initialState }
        case 'DELETE_ENTRY_TYPE_ITEM':
            let data = state.data.filter((item) => item.id !== action.payload.id);
            return { ...state, data }
        case 'ADD_ENTRY_DATA_ITEM':
            let newData = [action.payload.data];
            if(action.payload.incoming_type_id === INVITED_ENTRY_TYPE)
                newData = [...state.data, action.payload.data];
            return { 
                ...state, 
                data: newData,
                employee_quantity: 1,
                employees: populateEmployeeArray(1),
            }
        case 'DELETE_ALL_EMPLOYEES':
            return { 
                ...state, 
                employees: [],
                employee_quantity: 0,
            }
        case 'DELETE_EMPLOYEE':
            const filteredEmployees = state.employees.filter((item) => item.id != action.payload.id)
            return { 
                ...state,
                employee_quantity: filteredEmployees.length,
                employees: filteredEmployees
            }
        case 'SET_EMPLOYEE_QTY':
            let employee_quantity = calculateEmployeeQty(action.payload.type, state.employee_quantity, action.payload.qty)
            let employees = populateEmployeeArray(employee_quantity)
            return { 
                ...state, 
                employees,
                employee_quantity
            }
        case 'RENDER_ENTRY_TYPE_CONTENT':
            return { 
                ...state, 
                incoming_type_id: action.payload.incoming_type_id,
                data: []
            }
        case 'LOAD_ENTRY_TYPE_DATA':
            let providerData = action.payload.data[0]
            return { 
                ...state, 
                incoming_type_id:  parseInt(action.payload.incoming_type_id),
                employee_quantity: providerData.employee_quantity,
                employees: action.payload.employees ? action.payload.employees : populateEmployeeArray(providerData.employee_quantity),
                data: [providerData],
            }
        case 'GENERATE_EMPLOYEES_OBJECTS_BY_QTY':
            return { 
                ...state, 
                employees: populateEmployeeArray(action.payload.employee_quantity),
                employee_quantity: action.payload.employee_quantity,
            }
        case 'SET_CAR_COLORS':
            return { 
                ...state,
                car_colors: action.payload.car_colors,
                fetchingData: false,
                error: false,
                message: ""
            }
        case 'SET_EMPLOYEE_INPUT_VALUE':
            updateEmployeeForm(state.employees, action.payload)
            return { 
                ...state,
                employees: updateEmployeeForm(state.employees, action.payload)
            }
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

const updateEmployeeForm = (employees, payload) => {
    
    const result = employees.map((employee) => {
        if(employee.id == payload.id){
            employee[payload.name] = payload.value
        }

        return employee
    });
    
    return result;
}

const populateEmployeeArray = (amount) => {
    let employees = [];
    for(let i = 0; i < amount; i++){
        employees = [ ...employees, { id: `${i}`, name: '', surname: '' } ]
    }
    return employees
}

const calculateEmployeeQty = (type, currentQty, qty) => {
    const localQty = type === 'increase' 
        ? 
        parseInt(currentQty) + parseInt(qty) 
        :
        parseInt(currentQty) - parseInt(qty);

    return localQty > 0 ? localQty : '0'
}

const validateEntryData = (data) => {
    let result = { error: false }
    if(!data.name)
        return {...result, error: true, message: 'El nombre es requerido.'}
    if(!data.car_model)
        return {...result, error: true, message: 'El modelo es requerido.'}
    if(!data.car_color_id)
        return {...result, error: true, message: 'El color es requerido.'}

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
    if(!data.equip_description)
        return {...result, error: true, message: 'El equipo es requerido.'}

    return result
}

const clearState = (dispatch) => {
    return () => {
        dispatch({type: 'CLEAR_STATE' });
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

const handleDeleteEmployee = (dispatch) => {
    return async (employee_id) => {
        dispatch({ 
            type: 'DELETE_EMPLOYEE', 
            payload: { id: employee_id } 
        })
    }
}

const handleDeleteEntryItem = (dispatch) => {
    return async (id) => {
        dispatch({ type: 'DELETE_ENTRY_TYPE_ITEM', payload: {id} });
    }
}

const handleLoadEntryTypeData = (dispatch) => {
    return async (data) => {
        dispatch({ 
            type: 'LOAD_ENTRY_TYPE_DATA',
            payload: {...data }
        });
    }
}

const handleDeleteAllEmployees = (dispatch) => {
    return async () => {
        dispatch({ type: 'DELETE_ALL_EMPLOYEES' })
    }
}

const handleSetEmployeeQuantity = (dispatch, state) => {
    return (type, qty) => {

        if(type == 'increase'){
            const employee_quantity = parseInt(state.employee_quantity)
            if((employee_quantity + qty) <= MAX_EMPLOYEE_QUANTITY){
                dispatch({ 
                    type: 'SET_EMPLOYEE_QTY', 
                    payload: { type, qty } 
                })
            }else{
                Alert.alert(
                    "Ha ocurrido un error",
                    `La cantidad maxima de empleados permitida es de ${MAX_EMPLOYEE_QUANTITY}`,
                    [
                        {
                            text: "Aceptar"
                        },
                    ]
                )
            }
            
        }else{
            dispatch({ 
                type: 'SET_EMPLOYEE_QTY', 
                payload: { type, qty } 
            })
        }
    }
}

const handleEmployeeInputChange = (dispatch) => {
    return async (id, value, name) => {
        dispatch({ 
            type: 'SET_EMPLOYEE_INPUT_VALUE', 
            payload: { id, value, name } 
        })
    }
}

const initIncomeTypeDefaultState = (dispatch) => {
    return async () => {
        try {
            dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token
            const car_colors = await httpClient.get(`car_colors`, {'Authorization': token});
            if(car_colors){
                dispatch({
                    type: 'SET_CAR_COLORS', 
                    payload: { car_colors } 
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

const handleGenerateEmployeesObjectByQty = (dispatch) => {
    return async (employee_quantity) => {
        dispatch({ 
            type: 'GENERATE_EMPLOYEES_OBJECTS_BY_QTY', 
            payload: { employee_quantity } 
        })
    }
}

export const { Context, Provider } = createDataContext(
    incomeTypeReducer, 
    { 
        clearState,
        handleAddEntry,
        handleDeleteEmployee,
        handleDeleteEntryItem,
        handleLoadEntryTypeData,
        handleDeleteAllEmployees,
        handleSetEmployeeQuantity,
        handleEmployeeInputChange,
        initIncomeTypeDefaultState,
        handleEntryTypeContentRender,
        handleGenerateEmployeesObjectByQty,
    },
    initialState
);