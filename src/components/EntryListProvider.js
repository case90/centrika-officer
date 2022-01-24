import React, { useEffect, useReducer } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import IntegerInput from './IntegerInput';

const initialState = { 
    employeeQty: null,
    employees: []
};

const entryProviderReducer = (state = initialState, action) => {
    switch(action.type){
        case 'CLEAR_STATE':
            return initialState
        case 'SET_INITIAL_DATA':
            return { 
                ...state, 
                employees: action.payload.employees,
                employeeQty: action.payload.employeeQty,
            }
        case 'SET_EMPLOYEE_QTY':
            return { 
                ...state, 
                employeeQty: action.payload.employeeQty,
            }
        default:
            return state
    }
}

const EntryListProvider = ({ data, deleteItem, employeeQty, employees }) => {

    const [state, dispatch] = useReducer(entryProviderReducer, initialState);

    const handleDeleteEmployee = (key) => {
        /**
         * On delete employee from form
         */
    }

    const handleSetFields = (employeeQty) => {
        dispatch({ 
            type: 'SET_EMPLOYEE_QTY', 
            payload: { 
                employeeQty: (employeeQty > 0 || employeeQty)  ? employeeQty : 1,  
            } 
        })
        
    }

    const setEmployeesData = (employeeQty, employees) => {
        dispatch({ 
            type: 'SET_INITIAL_DATA', 
            payload: { employeeQty, employees } 
        })
    }

    useEffect(() => {
        if(state.employees.length === 0)
            setEmployeesData(employeeQty, employees);
    }, [])

    const renderForm = () => {
        if(state.employeeQty && state.employees){

            return (
                <View>
                    <View style={tw`border-b mb-3 border-gray-300`}>
                        <Text style={tw`text-black text-xl font-thin pb-3`}>Alta de Empleados</Text>
                        <Text style={tw`text-black mb-3 text-base font-thin`}>Cantidad de empleados</Text>
                        <IntegerInput 
                            value={`${state.employeeQty}`} 
                            onChangeText={(value) => handleSetFields(value)}
                        />
                    </View>
                    {
                        Array.from({length: state.employeeQty}, (e, i) => {
                            return (
                                <View key={i} style={tw`border-b border-gray-300 mb-3`}>
                                    <Text style={tw`text-black mb-3 text-base font-thin`}>Empleado {i + 1}</Text>
                                    <View style={tw``}>
                                        <Text style={tw`text-black mb-3 text-base font-thin`}>Nombre</Text>
                                        <Input
                                            inputStyle={tw`ml-3 text-sm`}
                                            inputContainerStyle={tw`border pl-2 pr-2 rounded-md`}
                                            containerStyle={tw`p-0`}
                                            labelStyle={{ color: '#133C60' }}
                                            placeholder="Nombre"
                                            value={`Valor ${i}`}
                                        />
                                        <Text style={tw`text-black mb-3 text-base font-thin`}>Apellido</Text>
                                        <Input
                                            inputStyle={tw`ml-3 text-sm`}
                                            inputContainerStyle={tw`border pl-2 pr-2 rounded-md`}
                                            containerStyle={tw`p-0`}
                                            labelStyle={{ color: '#133C60' }}
                                            placeholder="Apellido"
                                            value={`Valor ${i}`}
                                        />
                                    </View>
                           
                                    <Button
                                        title={'Eliminar empleado'}
                                        containerStyle={tw`flex-1 mb-5`}
                                        buttonStyle={{ backgroundColor: '#ee8920' }}
                                        onPress={() => handleDeleteEmployee(i)}
                                    />
                                </View>
                            )
                        })
                    }
                </View>
            )
        }
    }

    return (
        <View style={tw`mt-5`}>
            {
                data.map((item) => {
                    return (
                        <View 
                            key={item.id}
                            style={tw``}>
                            <View 
                                style={tw`flex-row items-center mb-3 pl-5 pr-5 pt-2 pb-2 bg-gray-200 border border-gray-300`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-black text-lg font-thin`}>{item.name}</Text>
                                    <View style={tw`flex-row`}>
                                        <View style={tw`flex-row items-center`}>
                                            <Text style={tw`text-black text-sm font-thin`}>Placas:</Text>
                                            <Text style={tw`text-gray-500 text-sm font-thin ml-1`}>{item.car_tag}</Text>
                                        </View>
                                        <View style={tw`ml-3 flex-row items-center`}>
                                            <Text style={tw`text-black text-sm font-thin`}>Modelo:</Text>
                                            <Text style={tw`text-gray-500 text-sm font-thin ml-1`}>{item.car_model}</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    key={item.id}
                                    onPress={() => deleteItem(item.id)}>
                                    <Icon type='font-awesome' name='trash' size={25} color='red'/>
                                </TouchableOpacity>
                            </View>
                            {renderForm()}
                        </View>
                    )
                })
            }
        </View>
    )
}

export default EntryListProvider
