import { Alert } from 'react-native';

export function throwAlertError(title, msg, onCloseCallback) {
    let message = '';
    if(typeof msg !== 'object'){
        message = msg;
    }else{
        for(let value of msg){
            message += `${value}\n`
        }
    }

    Alert.alert(
        title,
        message,
        [{ 
            text: "OK", 
            onPress: onCloseCallback
        }]
    ) 
}