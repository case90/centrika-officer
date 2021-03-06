import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'

const StreetList = ({ data, value, onPress }) => {

    return (
        <View style={tw`flex-row flex-wrap`}>
            {
                data.map((item) => {
                    return (
                        <TouchableOpacity 
                            key={item.id} 
                            style={tw`mb-3 w-1/4 items-center`}
                            onPress={() => onPress(item.id)}>
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

export default React.memo(StreetList)

const styles = StyleSheet.create({
    activeItem: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: '#ee8920',
        borderColor: '#ee8920',
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
