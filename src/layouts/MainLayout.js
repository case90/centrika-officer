import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Context as AuthContext} from './../context/AuthContext';
import { Provider as InvitationFormProvider } from './../context/InvitationFormContext'
import { navigationRef } from './../helpers/rootNavigation'
import HomeScreen from './../screens/HomeScreen'
import ScannerScreen from './../screens/ScannerScreen'
import CreateInvitationScreen from './../screens/CreateInvitationScreen'

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
                    label="Escaner"
                    onPress={() => props.navigation.navigate('Scanner')}
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
                            name="Scanner" 
                            component={ScannerScreen} 
                            options={{
                                title: 'Crear invitación',
                            }}
                        />
                    </Drawer.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </InvitationFormProvider>
    )
}

export default MainLayout
