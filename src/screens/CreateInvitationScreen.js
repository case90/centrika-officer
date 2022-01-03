import React, { useContext, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Button, Icon } from 'react-native-elements';
import { Context as InvitationFormContext} from './../context/InvitationFormContext';
import InvitedForm from './../components/invitation/InvitedForm';
import ProviderForm from './../components/invitation/ProviderForm';
import ServiceForm from './../components/invitation/ServiceForm';
import DateRange from './../components/DateRange';
import { INVITED_ENTRY_TYPE, SERVICE_ENTRY_TYPE, PROVIDER_ENTRY_TYPE } from './../config/defines';
import tw from 'tailwind-react-native-classnames';

const CreateInvitationScreen = ({ route, navigation }) => {
    const { 
        state, 
        store,
        clearState,
        loadInvitation,
        initDefaultState,
        handleSelectedDates,
        handleEntryTypeContentRender 
    } = useContext(InvitationFormContext);

    useEffect(() => {
        if(route.params?.data){
            loadInvitation(route.params?.data);
        }
            
        if(!state.car_colors || !state.neighbor_id || !state.address_id){
            initDefaultState();
        }
            
        const unsubscribe = navigation.addListener('blur', () => {
            clearState()
        });

        return unsubscribe;
            
    }, [route.params?.timestamp, navigation])

    const renderEntryTypeContent = () => {
        switch(state.incoming_type_id){
            case 1:
                return <InvitedForm />
            case 2:
                return <ServiceForm />
            case 3:
                return <ProviderForm />
        }
    }

    const renderContent = () => {
        return (
            <ScrollView 
            showsVerticalScrollIndicator={false}>
                <View style={tw`p-4`}>
                    <Text style={tw`text-black text-base font-thin`}>Nombre del vecino</Text>
                    <Text style={tw`text-gray-500 text-base font-thin mb-2`}>{state.neighbor_name}</Text>
                    <Text style={tw`text-black text-base font-thin`}>Dirección</Text>
                    <Text style={tw`text-gray-500 text-base font-thin mb-2`}>{state.address_text}</Text>
                    <DateRange 
                        titleInitialDate="Fecha de entrada"
                        titleFinalDate="Fecha de salida"
                        clearDates={state.data.length !== 0 ? false : true}
                        onChangeInitialDate={(date) => {
                            date ? handleSelectedDates(date, 'initial_date') : null;
                        }}
                        onChangeFinalDate={(date) => {
                            date ? handleSelectedDates(date, 'final_date') : null;
                        }}
                    />
                    <Text style={tw`text-black text-xl font-thin mb-2`}>Tipo de entrada</Text>
                    <View style={tw`flex-row justify-between mb-4`}>
                        <Button
                            containerStyle={tw`w-1/3`}
                            buttonStyle={state.incoming_type_id === INVITED_ENTRY_TYPE ? styles.primaryButton : styles.secondaryButton}
                            titleStyle={state.incoming_type_id === INVITED_ENTRY_TYPE ? styles.primaryTitleButton : styles.secondaryTitleButton}
                            icon={<Icon name="user" type='font-awesome' size={15} color={state.incoming_type_id === INVITED_ENTRY_TYPE ? "#ffffff" : "#118ea6"} />}
                            title="Invitado"
                            onPress={() => handleEntryTypeContentRender(INVITED_ENTRY_TYPE)}
                        />
                        <Button
                            containerStyle={tw`w-1/3`}
                            buttonStyle={state.incoming_type_id === SERVICE_ENTRY_TYPE ? styles.primaryButton : styles.secondaryButton}
                            titleStyle={state.incoming_type_id === SERVICE_ENTRY_TYPE ? styles.primaryTitleButton : styles.secondaryTitleButton}
                            icon={<Icon name="truck" type='font-awesome' size={15} color={state.incoming_type_id === SERVICE_ENTRY_TYPE ? "#ffffff" : "#118ea6"} />}
                            title="Servicio"
                            onPress={() => handleEntryTypeContentRender(SERVICE_ENTRY_TYPE)}
                        />
                        <Button
                            containerStyle={tw`w-1/3`}
                            buttonStyle={state.incoming_type_id === PROVIDER_ENTRY_TYPE ? styles.primaryButton : styles.secondaryButton}
                            titleStyle={state.incoming_type_id === PROVIDER_ENTRY_TYPE ? styles.primaryTitleButton : styles.secondaryTitleButton}
                            icon={<Icon name="car" type='font-awesome' size={15} color={state.incoming_type_id === PROVIDER_ENTRY_TYPE ? "#ffffff" : "#118ea6"} />}
                            title="Proveedor"
                            onPress={() => handleEntryTypeContentRender(PROVIDER_ENTRY_TYPE)}
                        />
                    </View>
                    <View style={tw`mb-8`}>
                        {renderEntryTypeContent()}
                    </View>  
                    <View style={tw`flex-row justify-between mb-8`}>
                        <Button
                            containerStyle={tw`w-5/12`}
                            buttonStyle={[{backgroundColor: 'gray'}]}
                            title="Regresar"
                            onPress={() => navigation.goBack()}
                        />
                        <Button
                            containerStyle={tw`w-5/12`}
                            buttonStyle={[{backgroundColor: '#118ea6'}]}
                            title="Generar QR"
                            onPress={() => store(state)}
                        />
                    </View>               
                </View>
            </ScrollView>
        );
    }

    return (
        !state.fetchingData
        ?
            !state.error 
            ? 
                renderContent() 
            : 
                <View style={tw`flex-1 p-5 justify-center items-center`}>
                    <Text style={tw`text-center text-lg mb-3`}>
                        {state.message}
                    </Text>
                    <Button
                        containerStyle={{width: 120}}
                        buttonStyle={[{backgroundColor: '#118ea6'}]}
                        title="Actualizar"
                        onPress={() => !route.params?.data ? initDefaultState() : loadInvitation(route.params?.data)}
                    />
                </View>
        :
            <ActivityIndicator size="large" color="#118EA6" style={tw`mt-5`} />
    )
}

const styles = StyleSheet.create({
    primaryButton: {
        borderWidth: 1,
        borderColor: '#118ea6',
        backgroundColor: '#118ea6'
    },
    primaryTitleButton: {
        paddingLeft: 5, 
        fontSize: 14
    },
    secondaryButton: {
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: '#118ea6'
    },
    secondaryTitleButton: {
        paddingLeft: 5, 
        fontSize: 14, 
        color: '#118ea6'
    }
});

export default CreateInvitationScreen
