import React, { useContext, useEffect } from 'react'
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import Scanner from './../components/Scanner';
import { Context as InvitationContext} from './../context/InvitationContext';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from 'react-native-elements'

const ScannerScreen = () => {

    const navigation = useNavigation();
    const { 
        state, 
        clearState,
        fetchInvitationById, 
        laodInvitationByGuestId,
        setScannerVisibilityState 
    } = useContext(InvitationContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            clearState()
        });
        return unsubscribe;
    }, [])

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
                                    onPress={() => laodInvitationByGuestId(item.id, state.data)}
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
        console.log(state.fetchingData )
        return (
            <View style={tw`flex-1 p-3`}>
                {
                    state.data 
                    ?
                        !state.fetchingData 
                        ?
                        getDetailContent()
                        :
                        <ActivityIndicator size="large" color="#ee8920" style={tw`mt-5`} />
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
