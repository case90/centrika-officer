import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'

const ButtonFrom = ({ handleSubmit, ...otherProps }) => {
    return (
        <Button 
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer} 
            onPress={handleSubmit} 
            title="Enviar" 
            {...otherProps} />
    )
}

export default ButtonFrom

const styles = StyleSheet.create({
    button: { 
        backgroundColor: '#2a8ea6', 
        borderRadius: 35,
        paddingTop: 15,
        paddingBottom: 15
    },
    buttonContainer: { 
        backgroundColor: 'white', 
        borderRadius: 25,
        paddingRight: 10,
        paddingLeft: 10,
        borderBottomWidth: 0,
        marginBottom: 15
    }
})