import React, { useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { Context as IncomeTypeContext} from './../../context/IncomeTypeContext';
import { Input, Icon, Button } from 'react-native-elements'
import ColorList from './../ColorList';
import useHandleOnChangeTextInput from './../../hooks/useHandleOnChangeTextInput';
import { ProviderSchema } from './../../config/schemas';
import { PROVIDER_ENTRY_TYPE } from './../../config/defines';
import EntryListProvider from '../EntryListProvider';
import tw from 'tailwind-react-native-classnames';

const ProviderForm = ({ data, employeeQty, carColors }) => {
    const { handleAddEntry, handleDeleteEntryItem } = useContext(IncomeTypeContext);
    const [inputState, handleInputChange, clearFields] = useHandleOnChangeTextInput(ProviderSchema);

    useEffect(() => {
        clearFields()
    }, [data]);

    useEffect(() => {
        console.log('Optimizar el ProviderForm cuando se capturan datos en el form')
    });
    
    return (
        <>
            <View style={tw`mb-2 flex flex-row`}>
                <Text style={tw`mb-2`}>Nombre del proveedor</Text>
                <Text style={{ color: 'red', marginLeft: 5 }}>*</Text>
            </View>
            <Input
                leftIcon={<Icon type='font-awesome' name='user' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Ej. Izzi, Jardinería Jaime, Constructora Coner."
                value={inputState.name}
                onChangeText={(value) => handleInputChange(value, 'name')}
            />
            <Text style={tw`mb-2`}>Motivo de visita</Text>
            <Input
                maxLength={250}
                autoCapitalize={"words"}
                autoComplete={"off"} s
                inputStyle={tw`ml-3 text-sm`}
                leftIcon={<Icon type='font-awesome' name='briefcase' size={25} color='black' />}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Instalacion de internet, Jardinería."
                value={inputState.reason}
                onChangeText={(value) => handleInputChange(value, 'reason')}
            />
            <Text style={tw`mb-2`}>Descripción del equipo</Text>
            <Input
                maxLength={250}
                autoCapitalize={"words"}
                autoComplete={"off"}
                leftIcon={<Icon type='font-awesome' name='wrench' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Equipo, Palas, Extenciones. "
                value={inputState.equip_description}
                onChangeText={(value) => handleInputChange(value, 'equip_description')}
            />
            <View style={tw`mb-2 flex flex-row`}>
                <Text style={tw`mb-2`}>Modelo del carro</Text>
                <Text style={{ color: 'red', marginLeft: 5 }}>*</Text>
            </View>
            <Input
                leftIcon={<Icon type='font-awesome' name='car' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Ej. Yaris, Suzuki / Peatón."
                value={inputState.car_model}
                onChangeText={(value) => handleInputChange(value, 'car_model')}
            />
            <ColorList 
                data={carColors}
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
            <EntryListProvider 
                data={data}
                employeeQty={employeeQty}
                deleteItem={(id) => handleDeleteEntryItem(id)} />
        </>
    )
}

export default React.memo(ProviderForm)
