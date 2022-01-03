import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Context as InvitationListContext} from './../context/InvitationListContext';
import InvitedListItem from './../components/invitation/InvitedListItem';
import ProviderListItem from './../components/invitation/ProviderListItem';
import ServiceListItem from './../components/invitation/ServiceListItem';
import { INVITED_ENTRY_TYPE, SERVICE_ENTRY_TYPE, PROVIDER_ENTRY_TYPE } from './../config/defines';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

const InvitationListScreen = () => {
    const { state, fetchInvitations } = useContext(InvitationListContext);
    const navigation = useNavigation();

    useEffect(() => {
        
        const unsubscribe = navigation.addListener('focus', () => {
            fetchInvitations();
        });

        return unsubscribe;
        
    }, []);

    const renderContent = () => {
        return (
            <FlatList 
                data={state.invitations}
                initialNumToRender={3}
                maxToRenderPerBatch={15}
                updateCellsBatchingPeriod={50}
                keyExtractor={item => `${item.id}`}
                onEndReachedThreshold={0.5}
                onEndReached={() => console.log('load more')}
                renderItem={({ item }) => {
                    if(item.incoming_type_id == INVITED_ENTRY_TYPE){
                        return (
                            <InvitedListItem 
                                key={item.id} 
                                data={item} 
                                onPress={(data) => {
                                    const currentDate = new Date();
                                    const timestamp = currentDate.getTime();
                                    navigation.navigate('CreateInvitation', {data, timestamp})
                                }} 
                            />
                        )
                    }else if(item.incoming_type_id == SERVICE_ENTRY_TYPE){
                        return (
                            <ServiceListItem 
                                key={item.id} 
                                data={item} 
                                onPress={(data) => {
                                    const currentDate = new Date();
                                    const timestamp = currentDate.getTime();
                                    navigation.navigate('CreateInvitation', {data, timestamp})
                                }}
                            />
                        )
                    }else if(item.incoming_type_id == PROVIDER_ENTRY_TYPE){
                        return (
                            <ProviderListItem 
                                key={item.id} 
                                data={item} 
                                onPress={(data) => {
                                    const currentDate = new Date();
                                    const timestamp = currentDate.getTime();
                                    navigation.navigate('CreateInvitation', {data, timestamp})
                                }}
                            />
                        )
                    }
                }}
            />
                
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
                </View>
        :
            <ActivityIndicator size="large" color="#118EA6" style={tw`mt-5`} />
    )
}

export default InvitationListScreen
