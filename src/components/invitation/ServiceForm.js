import React, { useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { Context as EntranceContext} from './../../context/EntranceContext';
import { Input, Icon, Button } from 'react-native-elements'
import ColorList from './../ColorList';
import useHandleOnChangeTextInput from './../../hooks/useHandleOnChangeTextInput';
import { ServiceSchema } from './../../config/schemas';
import { SERVICE_ENTRY_TYPE } from './../../config/defines';
import EntryList from '../EntryList';
import tw from 'tailwind-react-native-classnames';

const ServiceForm = () => {
    const { state, handleAddEntry, handleDeleteEntryItem } = useContext(EntranceContext);
    const [inputState, handleInputChange, clearFields] = useHandleOnChangeTextInput(ServiceSchema);

    useEffect(() => {
        clearFields()
    }, [state.data]);
    
    return (
        <>
            <Text style={tw`mb-2`}>Empresa</Text>
            <Input
                leftIcon={<Icon type='font-awesome' name='building' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Empresa"
                value={inputState.name}
                onChangeText={(value) => handleInputChange(value, 'name')}
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
                    onPress={() => handleAddEntry(inputState, SERVICE_ENTRY_TYPE)}
                />
            </View>
            <EntryList 
                data={state.data}
                deleteItem={(id) => handleDeleteEntryItem(id)} />
        </>
    )
}

export default ServiceForm
