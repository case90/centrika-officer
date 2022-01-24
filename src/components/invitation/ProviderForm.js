import React, { useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { Context as EntranceContext} from './../../context/EntranceContext';
import { Input, Icon, Button } from 'react-native-elements'
import ColorList from './../ColorList';
import useHandleOnChangeTextInput from './../../hooks/useHandleOnChangeTextInput';
import { ProviderSchema } from './../../config/schemas';
import { PROVIDER_ENTRY_TYPE } from './../../config/defines';
import EntryList from '../EntryList';
import tw from 'tailwind-react-native-classnames';

const ProviderForm = () => {
    const { state, handleAddEntry, handleDeleteEntryItem } = useContext(EntranceContext);
    const [inputState, handleInputChange, clearFields] = useHandleOnChangeTextInput(ProviderSchema);

    useEffect(() => {
        clearFields()
    }, [state.data]);
    
    return (
        <>
            <Text style={tw`mb-2`}>Nombre del proveedor</Text>
            <Input
                leftIcon={<Icon type='font-awesome' name='user' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Nombre del proveedor"
                value={inputState.name}
                onChangeText={(value) => handleInputChange(value, 'name')}
            />
            <Text style={tw`mb-2`}>Número de empleados</Text>
            <Input
                leftIcon={<Icon type='font-awesome' name='users' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Número de empleado"
                value={inputState.employee_quantity}
                onChangeText={(value) => handleInputChange(value, 'employee_quantity')}
            />
            <Text style={tw`mb-2`}>Equipo</Text>
            <Input
                leftIcon={<Icon type='font-awesome' name='handshake-o' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Equipo"
                value={inputState.reason}
                onChangeText={(value) => handleInputChange(value, 'reason')}
            />
            <Text style={tw`mb-2`}>Placas del carro</Text>
            <Input
                leftIcon={<Icon type='font-awesome' name='file-text' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Placas del carro"
                value={inputState.car_tag}
                onChangeText={(value) => handleInputChange(value, 'car_tag')}
            />
            <Text style={tw`mb-2`}>Modelo del carro</Text>
            <Input
                leftIcon={<Icon type='font-awesome' name='car' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Modelo del carro"
                value={inputState.car_model}
                onChangeText={(value) => handleInputChange(value, 'car_model')}
            />
            <ColorList 
                data={state.car_colors}
                value={inputState.car_color_id}
                onPress={(color) =>  handleInputChange(color, 'car_color_id')}
            />
            <View style={tw`flex items-end mt-3`}>
                <Button
                    containerStyle={tw`w-5/12`}
                    buttonStyle={[{backgroundColor: '#ee8920'}]}
                    titleStyle={tw`ml-3`}
                    icon={<Icon name="plus-square" type='font-awesome' size={15} color="#fff" />}
                    title="Agregar"
                    onPress={() => handleAddEntry(inputState, PROVIDER_ENTRY_TYPE)}
                />
            </View>
            <EntryList 
                data={state.data}
                deleteItem={(id) => handleDeleteEntryItem(id)} />
        </>
    )
}

export default ProviderForm
