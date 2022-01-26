import React, { useContext, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements';
import { Context as EntranceContext} from './../context/EntranceContext';
import { Context as IncomeTypeContext} from './../context/IncomeTypeContext';
import InvitedForm from './../components/invitation/InvitedForm';
import ProviderForm from './../components/invitation/ProviderForm';
import ServiceForm from './../components/invitation/ServiceForm';
import StreetList from './../components/StreetList';
import { INVITED_ENTRY_TYPE, SERVICE_ENTRY_TYPE, PROVIDER_ENTRY_TYPE } from './../config/defines';
import tw from 'tailwind-react-native-classnames';

const EntranceCreateFormScreen = ({ route, navigation }) => {
    const { 
        state: entranceState, 
        store,
        clearState,
        loadInvitation,
        handleSelectedStreet,
        initEntranceDefaultState,
    } = useContext(EntranceContext);

    const { 
        state: incomeState,
        handleLoadEntryTypeData,
        initIncomeTypeDefaultState,
        handleEntryTypeContentRender
    } = useContext(IncomeTypeContext);

    useEffect(() => {
        if(route.params?.data){
            loadInvitation(route.params?.data);
            handleLoadEntryTypeData(route.params?.data);
        }

        if(entranceState.streets.length === 0){
            initEntranceDefaultState();
        }

        if(incomeState.car_colors.length === 0){
            initIncomeTypeDefaultState();
        }
            
        const unsubscribe = navigation.addListener('blur', () => {
            clearState()
        });

        return unsubscribe;
            
    }, [route.params, navigation])

    const renderEntryTypeContent = () => {
        switch(incomeState.incoming_type_id){
            case 1:
                return (
                    <InvitedForm 
                        data={incomeState.data} 
                        carColors={incomeState.car_colors} 
                    />
                )
            case 2:
                return (
                    <ServiceForm 
                        data={incomeState.data} 
                        carColors={incomeState.car_colors} 
                    />
                )
            case 3:
                return(
                    <ProviderForm 
                        data={incomeState.data} 
                        employeeQty={incomeState.employee_quantity} 
                        carColors={incomeState.car_colors} 
                    />
                )
        }
    }

    const renderContent = () => {
        return (
            <ScrollView 
            showsVerticalScrollIndicator={false}>
                <View style={tw`p-4`}>
                    <Text style={tw`text-black mb-3 text-lg font-bold`}>Agregar entrada</Text>
                    <Button
                        containerStyle={tw`w-3/6 mb-3`}
                        buttonStyle={styles.primaryButton}
                        titleStyle={styles.primaryTitleButton}
                        icon={<Icon name="qrcode" type='font-awesome' size={15} color={"#ffffff"} />}
                        title="Escanear QR"
                        onPress={() => navigation.navigate('Scanner')}
                    />
                    <Text style={tw`text-black mb-3 text-base font-thin`}>Buscar placas de carro</Text>
                    <Input
                        rightIcon={<Icon type='font-awesome' name='search' size={25} color='#ee8920' />}
                        inputStyle={tw`ml-3 text-sm`}
                        inputContainerStyle={tw`border pl-2 pr-2 rounded-md`}
                        containerStyle={tw`flex-1 p-0`}
                        labelStyle={{ color: '#133C60' }}
                        placeholder="Seleccione fecha"
                        value="RMK123"
                    />
                    <Text style={tw`text-black mb-3 text-base font-thin`}>Calle</Text>
                    <StreetList
                        data={entranceState.streets}
                        value={entranceState.street_id}
                        onPress={(item) => handleSelectedStreet(item)}
                    />
                    <Text style={tw`text-black mb-3 text-base font-thin`}>Número</Text>
                    <Input
                        rightIcon={<Icon type='font-awesome' name='search' size={25} color='#ee8920' />}
                        inputStyle={tw`ml-3 text-sm`}
                        inputContainerStyle={tw`border pl-2 pr-2 rounded-md`}
                        containerStyle={tw`flex-1 p-0`}
                        labelStyle={{ color: '#133C60' }}
                        placeholder="Seleccione fecha"
                        value="RMK123"
                    />
                    <Text style={tw`text-black text-xl font-thin mb-2`}>Tipo de entrada</Text>
                    <View style={tw`flex-row justify-between mb-4`}>
                        <Button
                            containerStyle={tw`w-1/3`}
                            buttonStyle={incomeState.incoming_type_id === INVITED_ENTRY_TYPE ? styles.primaryButton : styles.secondaryButton}
                            titleStyle={incomeState.incoming_type_id === INVITED_ENTRY_TYPE ? styles.primaryTitleButton : styles.secondaryTitleButton}
                            icon={<Icon name="user" type='font-awesome' size={15} color={incomeState.incoming_type_id === INVITED_ENTRY_TYPE ? "#ffffff" : "#ee8920"} />}
                            title="Invitado"
                            onPress={() => handleEntryTypeContentRender(INVITED_ENTRY_TYPE)}
                        />
                        <Button
                            containerStyle={tw`w-1/3`}
                            buttonStyle={incomeState.incoming_type_id === SERVICE_ENTRY_TYPE ? styles.primaryButton : styles.secondaryButton}
                            titleStyle={incomeState.incoming_type_id === SERVICE_ENTRY_TYPE ? styles.primaryTitleButton : styles.secondaryTitleButton}
                            icon={<Icon name="truck" type='font-awesome' size={15} color={incomeState.incoming_type_id === SERVICE_ENTRY_TYPE ? "#ffffff" : "#ee8920"} />}
                            title="Servicio"
                            onPress={() => handleEntryTypeContentRender(SERVICE_ENTRY_TYPE)}
                        />
                        <Button
                            containerStyle={tw`w-1/3`}
                            buttonStyle={incomeState.incoming_type_id === PROVIDER_ENTRY_TYPE ? styles.primaryButton : styles.secondaryButton}
                            titleStyle={incomeState.incoming_type_id === PROVIDER_ENTRY_TYPE ? styles.primaryTitleButton : styles.secondaryTitleButton}
                            icon={<Icon name="car" type='font-awesome' size={15} color={incomeState.incoming_type_id === PROVIDER_ENTRY_TYPE ? "#ffffff" : "#ee8920"} />}
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
                            buttonStyle={[{backgroundColor: '#ee8920'}]}
                            title="Guardar Entrada"
                            onPress={() => store(entranceState)}
                        />
                    </View>               
                </View>
            </ScrollView>
        );
    }

    return (
        !entranceState.fetchingData
        ?
            !entranceState.error 
            ? 
                renderContent() 
            : 
                <View style={tw`flex-1 p-5 justify-center items-center`}>
                    <Text style={tw`text-center text-lg mb-3`}>
                        {entranceState.message}
                    </Text>
                    <Button
                        containerStyle={{width: 120}}
                        buttonStyle={[{backgroundColor: '#ee8920'}]}
                        title="Actualizar"
                        onPress={() => !route.params?.data ? initDefaultState() : loadInvitation(route.params?.data)}
                    />
                </View>
        :
            <ActivityIndicator size="large" color="#ee8920" style={tw`mt-5`} />
    )
}

const styles = StyleSheet.create({
    primaryButton: {
        borderWidth: 1,
        borderColor: '#ee8920',
        backgroundColor: '#ee8920'
    },
    primaryTitleButton: {
        paddingLeft: 5, 
        fontSize: 14
    },
    secondaryButton: {
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: '#ee8920'
    },
    secondaryTitleButton: {
        paddingLeft: 5, 
        fontSize: 14, 
        color: '#ee8920'
    }
});

export default EntranceCreateFormScreen
