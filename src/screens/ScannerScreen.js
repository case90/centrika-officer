import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import Scanner from './../components/Scanner';
import { Context as InvitationContext} from './../context/InvitationContext';
import tw from 'tailwind-react-native-classnames';

const ScannerScreen = () => {

    const { state, fetchInvitationById } = useContext(InvitationContext);
    console.log(state)

    const handleOnScanner = (data) => {
        console.log(data)
    }

    const handleOnCloseScanner = () => {
        console.log('Se cerro el scanner')
    }

    const renderScanner = () => {
        return (
            <Scanner 
                onScanner={(id) => fetchInvitationById(id)} 
                onPressCloseButton={handleOnCloseScanner}
            />
        );
    }

    const renderInvitationDetail = () => {
        return (
            <View style={tw`flex-1 bg-green-300`}>
                <Text>
                    Textito
                </Text>
            </View>
        );
    }

    return (
        <View style={tw`flex flex-1`}>
            { true ? renderScanner() : renderInvitationDetail() }
        </View>
    )
}

export default ScannerScreen
