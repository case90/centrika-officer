import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames';

const ColorList = ({ data, value, getSelectedColor }) => {

    return (
        <View style={tw`flex-row flex-wrap`}>
            {
                data.map((item) => {
                    return (
                        <TouchableOpacity 
                            key={item.id} 
                            style={tw`mb-3 w-1/4 items-center`}
                            onPress={() => getSelectedColor(item.id)}>
                            <View 
                                style={[ { borderColor:item.background_color }, value === item.id ? styles.activeItem : styles.itemStyle ]}>
                                <Icon type='font-awesome' name={item.icon} size={25} color={value === item.id ? '#fff' : item.background_color} />
                            </View>
                            <Text style={tw`text-center text-black`}>{item.description}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

export default ColorList

const styles = StyleSheet.create({
    activeItem: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: '#118ea6',
        borderColor: '#118ea6',
    },
    itemStyle: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 15,
    }
})
