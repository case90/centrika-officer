import React, { useContext, useCallback } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import StreetList from './../components/StreetList';
import tw from 'tailwind-react-native-classnames';
import { Context as EntranceContext} from './../context/EntranceContext';
import { Input, Button, Icon } from 'react-native-elements';

const NeighborForm = () => {
    const { 
        state, 
        fetchAddress,
        setAddressNumber,
        handleSelectedStreet,
        deleteNeighborAddress,
    } = useContext(EntranceContext);

    const onSelectAddress = useCallback((item) => {
        handleSelectedStreet(item)
    }, [state.street_id])

    return (
        <>
            <Text style={tw`text-black mb-3 text-base font-thin`}>Calle</Text>
            <StreetList
                data={state.streets}
                value={state.street_id}
                onPress={onSelectAddress}
            />
            <Text style={tw`text-black mb-3 text-base font-thin`}>Número</Text>
            <Input
                rightIcon={(
                    <TouchableOpacity
                        onPress={() => fetchAddress(state.number, state.street_id)}    
                    >
                        <Icon type='font-awesome' name='search' size={25} color='#ee8920' />
                    </TouchableOpacity>
                )}
                inputStyle={tw`ml-3 text-sm`}
                inputContainerStyle={tw`border pl-2 pr-2 rounded-md`}
                containerStyle={tw`flex-1 p-0`}
                labelStyle={{ color: '#133C60' }}
                maxLength={5}
                value={state.number}
                keyboardType='number-pad'
                placeholder="Escriba un número de casa"
                onChangeText={(number) => setAddressNumber(number)}
                onSubmitEditing={(e) => fetchAddress(e.nativeEvent.text, state.street_id)}
            />
            <View>
                {   
                    state.address
                    ?
                        state.address.map((item) => {
                            return (
                                <View key={item.id} style={tw`flex-row rounded-md mb-3 border border-gray-400 items-center`}>
                                    <TouchableOpacity 
                                        style={tw`rounded-l-md p-3 bg-red-700`}
                                        onPress={() => deleteNeighborAddress()}
                                    >
                                        <Icon type='font-awesome' name='trash' size={25} color='white' />
                                    </TouchableOpacity>
                                    <Text style={tw`ml-3 text-black`}>{item.neighbor.name}</Text>
                                </View>
                            )
                        })
                    :
                    null
                }
            </View>
        </>
    )
}

export default NeighborForm
