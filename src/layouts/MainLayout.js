import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Context as AuthContext} from './../context/AuthContext';
import { Provider as InvitationFormProvider } from './../context/InvitationFormContext'
import { Provider as InvitationListProvider } from './../context/InvitationListContext'
import { navigationRef } from './../helpers/rootNavigation'
import HomeScreen from './../screens/HomeScreen'
import CreateInvitationScreen from './../screens/CreateInvitationScreen'
import QrViewScreen from './../screens/QrViewScreen'
import InvitationListScreen from './../screens/InvitationListScreen'

const Drawer = createDrawerNavigator();

const MainLayout = () => {
    const { signout } = useContext(AuthContext);

    const CustomDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label="Inicio"
                    onPress={() => props.navigation.navigate('Inicio')}
                />
                <DrawerItem
                    label="Nueva invitación"
                    onPress={() => props.navigation.navigate('CreateInvitation')}
                />
                <DrawerItem
                    label="Invitaciones anteriores"
                    onPress={() => props.navigation.navigate('InvitationList')}
                />
                <DrawerItem
                    label="Salir"
                    onPress={() => signout()}
                />
            </DrawerContentScrollView>
        )
    }

    return (
        <InvitationFormProvider>
            <InvitationListProvider>
                <SafeAreaView style={tw`flex-1 bg-blue-300`}>
                    <NavigationContainer ref={navigationRef} >
                        <Drawer.Navigator 
                            initialRouteName="Inicio" 
                            screenOptions={{
                                headerStyle: {
                                    backgroundColor: '#118ea6'
                                },
                                headerTitleStyle: {
                                    color: "#fff"
                                },
                                headerTintColor: '#fff'
                                
                            }}
                            drawerContent={(props) => <CustomDrawerContent {...props} />}
                        >
                            <Drawer.Screen 
                                name="Inicio" 
                                component={HomeScreen} 
                                options={{
                                    title: 'Inicio',
                                }}
                            />
                            <Drawer.Screen 
                                name="CreateInvitation" 
                                component={CreateInvitationScreen} 
                                options={{
                                    title: 'Crear invitación',
                                }}
                            />
                            <Drawer.Screen 
                                name="InvitationList" 
                                component={InvitationListScreen} 
                                options={{
                                    title: 'Invitaciones anteriores',
                                }}
                            />
                            <Drawer.Screen 
                                name="QrView" 
                                component={QrViewScreen} 
                                options={{
                                    title: 'QR View',
                                }}
                            />
                        </Drawer.Navigator>
                    </NavigationContainer>
                </SafeAreaView>
            </InvitationListProvider>
        </InvitationFormProvider>
    )
}

export default MainLayout
