import React, { useEffect, useContext } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Context as IncomeTypeContext} from './../../context/IncomeTypeContext';
import { Input, Icon, Button } from 'react-native-elements'
import ColorList from './../ColorList';
import { Dropdown } from 'react-native-element-dropdown';
import useHandleOnChangeTextInput from './../../hooks/useHandleOnChangeTextInput';
import { ServiceSchema } from './../../config/schemas';
import { SERVICE_ENTRY_TYPE } from './../../config/defines';
import EntryList from '../EntryList';
import tw from 'tailwind-react-native-classnames';

const ServiceForm = ({ data, carColors }) => {
    const { state, handleAddEntry, handleDeleteEntryItem } = useContext(IncomeTypeContext);
    const [inputState, handleInputChange, clearFields] = useHandleOnChangeTextInput(ServiceSchema);

    useEffect(() => {
        clearFields()
    }, [data]);
    
    return (
        <>
            <View style={tw`mb-2 flex flex-row`}>
                <Text style={tw`mb-2`}>Empresa</Text>
                <Text style={{ color: 'red', marginLeft: 5 }}>*</Text>
            </View>
            <Input
                leftIcon={<Icon type='font-awesome' name='building' size={25} color='black' />}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                placeholder="Ej. DHL, Soriana, Uber eats."
                value={inputState.name}
                onChangeText={(value) => handleInputChange(value, 'name')}
            />
            <Text style={tw`mb-2`}>Motivo de visita</Text>
            <Dropdown
                maxHeight={300}
                style={styles.dropdown}
                search
                valueField="value"
                searchPlaceholder="Buscar..."
                placeholderStyle={{color : 'gray'}}
                selectedTextStyle={{color: 'black'}}
                placeholder="Motivo de visita"
                labelField="reason"
                data={state.reason_list}
                onChange={item => {
                    handleInputChange(item.value, 'reason_id')
                }}
                value={inputState.reason_id}
                renderLeftIcon={() =>( 
                    <Icon type='font-awesome' name='shopping-cart' size={25} color='black'  marginRight={16}/>
                )}
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
                placeholder="Ej. Paquete, Pedido de comida, Super."
                value={inputState.equip_description}
                onChangeText={(value) => handleInputChange(value, 'equip_description')}
            />
            <Text style={tw`mb-2`}>Modelo del carro</Text>
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
                    onPress={() => handleAddEntry(inputState, SERVICE_ENTRY_TYPE)}
                />
            </View>
            <EntryList 
                data={data}
                deleteItem={(id) => handleDeleteEntryItem(id)} />
        </>
    )
}

export default React.memo(ServiceForm)

const styles = StyleSheet.create({
    dropdown: {
        borderColor: 'gray',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        color: 'gray',
        paddingHorizontal: 8,
        marginBottom: 25
    },
});