import React, { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Context as IncomeTypeContext} from './../context/IncomeTypeContext';
import { Icon, Input, Button } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import IntegerInput from './IntegerInput';

const EntryListProvider = ({ data, deleteItem, employeeQty }) => {

    const { 
        state,
        handleDeleteEmployee,
        handleDeleteAllEmployees,
        handleSetEmployeeQuantity, 
        handleGenerateEmployeesObjectByQty 
    } = useContext(IncomeTypeContext);

    useEffect(() => {
        if(employeeQty){
            handleGenerateEmployeesObjectByQty(employeeQty)
        }
    }, [employeeQty])

    const renderContent = () => {
        return (
            <View style={tw`mt-5`}>
                {data.map((item) => {
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
                            <View style={tw`border-b mb-3 border-gray-300`}>
                                <Text style={tw`text-black text-xl font-thin pb-3`}>Alta de Empleados</Text>
                                <Text style={tw`text-black mb-3 text-base font-thin`}>Cantidad de empleados</Text>
                                <IntegerInput 
                                    value={`${state.employeeQty}`} 
                                    onPress={(type, qty) => handleSetEmployeeQuantity(type, qty)}
                                />
                                {
                                    state.employeeQty > 0
                                    ?
                                    <View style={tw`flex-row justify-between`}>
                                        <Button
                                            title={'Eliminar todos'}
                                            containerStyle={tw`flex-1 mb-5`}
                                            buttonStyle={{ backgroundColor: 'gray' }}
                                            onPress={() => handleDeleteAllEmployees()}
                                        />
                                    </View>
                                    :
                                    null
                                }
                                
                            </View>
                        </View>
                    )
                })}
                <View>
                    {state.employees.map((employee) => {
                        return (
                            <View key={employee.id} style={tw`border-b border-gray-300 mb-3`}>
                                <View style={tw``}>
                                    <Text style={tw`text-black mb-3 text-base font-thin`}>Nombre</Text>
                                    <Input
                                        inputStyle={tw`ml-3 text-sm`}
                                        inputContainerStyle={tw`border pl-2 pr-2 rounded-md`}
                                        containerStyle={tw`p-0`}
                                        labelStyle={{ color: '#133C60' }}
                                        placeholder="Nombre"
                                        value={employee.name}
                                    />
                                    <Text style={tw`text-black mb-3 text-base font-thin`}>Apellido</Text>
                                    <Input
                                        inputStyle={tw`ml-3 text-sm`}
                                        inputContainerStyle={tw`border pl-2 pr-2 rounded-md`}
                                        containerStyle={tw`p-0`}
                                        labelStyle={{ color: '#133C60' }}
                                        placeholder="Apellido"
                                        value={employee.surname}
                                    />
                                </View>
                                <Button
                                    title={'Eliminar empleado'}
                                    containerStyle={tw`flex-1 mb-5`}
                                    buttonStyle={{ backgroundColor: '#ee8920' }}
                                    onPress={() =>  handleDeleteEmployee(employee.id) }
                                />
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

    return (data.length > 0 ? renderContent() : null)
}

export default EntryListProvider
