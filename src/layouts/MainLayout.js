import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Context as AuthContext} from './../context/AuthContext';
import { Provider as EntranceProvider } from './../context/EntranceContext'
import { Provider as InvitationProvider } from './../context/InvitationContext'
import { Provider as IncomeTypeProvider } from './../context/IncomeTypeContext'
import { navigationRef } from './../helpers/rootNavigation'
import HomeScreen from './../screens/HomeScreen'
import EntranceCreateFormScreen from './../screens/EntranceCreateFormScreen'
import ScannerScreen from './../screens/ScannerScreen'

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
                    label="Crear entrada"
                    onPress={() => props.navigation.navigate('EntranceCreateForm')}
                />
                <DrawerItem
                    label="Salir"
                    onPress={() => signout()}
                />
            </DrawerContentScrollView>
        )
    }

    return (
        <EntranceProvider>
            <InvitationProvider>
                <IncomeTypeProvider>
                    <SafeAreaView style={tw`flex-1 bg-blue-300`}>
                        <NavigationContainer ref={navigationRef} >
                            <Drawer.Navigator 
                                initialRouteName="Inicio" 
                                screenOptions={{
                                    headerStyle: {
                                        backgroundColor: '#ee8920'
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
                                    name="EntranceCreateForm" 
                                    component={EntranceCreateFormScreen} 
                                    options={{
                                        title: 'Crear entrada',
                                    }}
                                />
                                <Drawer.Screen 
                                    name="Scanner" 
                                    component={ScannerScreen} 
                                    options={{
                                        title: 'Escaner',
                                    }}
                                />
                            </Drawer.Navigator>
                        </NavigationContainer>
                    </SafeAreaView>
                </IncomeTypeProvider>
            </InvitationProvider>
        </EntranceProvider>
    )
}

export default MainLayout
