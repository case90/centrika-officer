import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';

const EntryList = ({ data, deleteItem }) => {
    return (
        <View style={tw`mt-5`}>
            {
                data.map((item) => {
                    return (
                        <View 
                            key={item.id}
                            style={tw`flex-row items-center pl-5 pr-5 pt-2 pb-2 bg-gray-200 mb-1 border border-gray-300`}>
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
                    )
                })
            }
        </View>
    )
}

export default EntryList
