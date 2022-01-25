import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';

const IntegerInput = ({ value, onPress }) => {
    return (
        <View style={tw`flex-row border border-gray-500 rounded-md mb-5`}>
            <TouchableOpacity 
                style={tw`w-2/12`}
                onPress={() => onPress('decrease', 1)}>
                <View style={[tw`flex-1 justify-center  rounded-md pt-2 pb-2`, { backgroundColor: '#ee8920' }]}>
                    <Icon type='font-awesome' name="minus" size={25} color="white" />
                </View>
            </TouchableOpacity>
            <TextInput
                style={tw`w-8/12 text-center text-xl text-black`}
                editable={false}
                value={value ? value : '1'}
            />
            <TouchableOpacity 
                style={tw`w-2/12`}
                onPress={() => onPress('increase', 1)}>
                <View style={[tw`flex-1 justify-center  rounded-md pt-2 pb-2`, { backgroundColor: '#ee8920' }]}>
                    <Icon type='font-awesome' name="plus" size={25} color="white" />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default IntegerInput
