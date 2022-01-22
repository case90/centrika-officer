import React, { useContext } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import Scanner from './../components/Scanner';
import { Context as InvitationContext} from './../context/InvitationContext';
import tw from 'tailwind-react-native-classnames';
import { Button, Icon } from 'react-native-elements'

const ScannerScreen = () => {

    const { 
        state, 
        fetchInvitationById, 
        laodInvitationByGuestId,
        setScannerVisibilityState 
    } = useContext(InvitationContext);

    const renderScanner = () => {
        return (
            <Scanner 
                onScanner={(id) => fetchInvitationById(id)} 
                onPressCloseButton={() => setScannerVisibilityState(!state.scannerVisibilityState)}
            />
        );
    }

    const getDetailContent = () => {
        return (
            <>
                <View style={tw`flex-row mb-3`}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-lg	font-bold`}>Vecino: </Text>
                        <Text>{state.data.address.neighbor.name}</Text>
                    </View>
                    <View style={tw`flex-1 items-center`}>
                        <Text style={tw`text-lg	font-bold`}>Dirección: </Text>
                        <Text>{state.data.address.street.description} {state.data.address.number}</Text>
                    </View>
                </View>
                <ScrollView style={tw`flex-1 mb-3`}>
                    {
                        state.data.data.map(item => {
                            return (
                                <TouchableOpacity 
                                    style={tw`flex-1 mb-3 p-3 border shadow-sm border-gray-300 rounded-lg`} key={item.id}
                                    onPress={() => laodInvitationByGuestId(item.id)}
                                >
                                    <Text style={tw`font-bold`}>{item.name}</Text>
                                    <View style={tw`flex-row`} key={item.id}>
                                        <Text style={tw``}>{item.car_model} {item.car_tag}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
                <View style={tw`items-center`}>
                    <Button
                        title="Escanerar nuevo código"
                        icon={<Icon name="qrcode" type='font-awesome' size={20} color={"#ffffff"} />}
                        buttonStyle={{
                            backgroundColor: '#ee8920',
                            borderRadius: 3,
                        }}
                        titleStyle={tw`ml-1 text-base p-1`}
                        containerStyle={tw`w-8/12`}
                        onPress={() => setScannerVisibilityState(!state.scannerVisibilityState)}
                    />
                </View>
                
            </>
        );
    }

    const renderInvitationDetail = () => {
        return (
            <View style={tw`flex-1 p-3`}>
                {
                    state.data 
                    ?
                    getDetailContent()
                    :
                    <Text style={tw`text-lg	text-center mb-3`}>No hay datos, porfavor escanear un código QR valido.</Text>
                }
                
            </View>
        );
    }

    return (
        <View style={tw`flex flex-1`}>
            { state.scannerVisibilityState ? renderScanner() : renderInvitationDetail() }
        </View>
    )
}

export default ScannerScreen
