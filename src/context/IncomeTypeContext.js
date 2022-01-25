import { Alert } from 'react-native'
import createDataContext from './createDataContext'
import { INVITED_ENTRY_TYPE, PROVIDER_ENTRY_TYPE } from '../config/defines';

const initialState = {
    error: false,
    message: "",
    fetchingData: false,
    incoming_type_id: INVITED_ENTRY_TYPE,
    employee_quantity: 0,
    data: [],
    employees: [],
    car_colors: [],
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
                employee_quantity: action.payload.data.employee_quantity, 
                data: newData 
            }
        case 'SET_INITIAL_DATA':
            return { 
                ...state, 
                employees: populateEmployeeArray(action.payload.employeeQty),
                employeeQty: action.payload.employeeQty,
            }
        case 'DELETE_ALL_EMPLOYEES':
            return { 
                ...state, 
                employees: [],
                employeeQty: 0,
            }
        case 'DELETE_EMPLOYEE':
            const filteredEmployees = state.employees.filter((item) => item.id != action.payload.id)
            return { 
                ...state,
                employeeQty: filteredEmployees.length,
                employees: filteredEmployees
            }
        case 'SET_EMPLOYEE_QTY':
            const employeeQty = calculateEmployeeQty(action.payload.type, state.employeeQty, action.payload.qty)
            const employees = populateEmployeeArray(employeeQty)
            return { 
                ...state, 
                employees,
                employeeQty
            }
        case 'RENDER_ENTRY_TYPE_CONTENT':
            return { 
                ...state, 
                incoming_type_id: action.payload.incoming_type_id,
                data: []
            }
        case 'GENERATE_EMPLOYEES_OBJECTS_BY_QTY':
            return { 
                ...state, 
                employees: populateEmployeeArray(action.payload.employeeQty),
                employeeQty: action.payload.employeeQty,
            }
        default:
            return state
    }

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

const handleDeleteAllEmployees = (dispatch) => {
    return async () => {
        dispatch({ type: 'DELETE_ALL_EMPLOYEES' })
    }
}

const handleSetEmployeeQuantity = (dispatch) => {
    return async (type, qty) => {
        dispatch({ 
            type: 'SET_EMPLOYEE_QTY', 
            payload: { type, qty } 
        })
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
    return async (employeeQty) => {
        dispatch({ 
            type: 'GENERATE_EMPLOYEES_OBJECTS_BY_QTY', 
            payload: { employeeQty } 
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
        handleDeleteAllEmployees,
        handleSetEmployeeQuantity,
        handleEntryTypeContentRender,
        handleGenerateEmployeesObjectByQty,
    },
    initialState
);