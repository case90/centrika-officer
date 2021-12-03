import React from 'react'
import { StyleSheet } from 'react-native'
import { Input } from 'react-native-elements'

const InputForm = ({ name, placeholder, ...otherProps }) => {

    return (    
        <Input
            placeholder={placeholder}
            name={name}
            autoautoCapitalize='characters'
            color='#4A4B4D' 
            inputStyle={{fontSize: 13}}
            inputContainerStyle={styles.input}
            {...otherProps}
        />
    )
}       

export default InputForm

const styles = StyleSheet.create({
    input: { 
        backgroundColor: '#F2F2F2', 
        borderRadius: 35,
        paddingTop: 10, 
        paddingRight: 20,
        paddingBottom: 10,
        paddingLeft: 20,
        borderBottomWidth: 0
    }
})