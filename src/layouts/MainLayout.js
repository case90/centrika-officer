import React, { useContext } from 'react'
import { View, SafeAreaView } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Context as AuthContext} from './../context/AuthContext';
import HomeScreen from './../screens/HomeScreen'

const Drawer = createDrawerNavigator();

const MainLayout = () => {
    const { signout } = useContext(AuthContext);

    const CustomDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label="Cerrar Sesión"
                    onPress={() => signout()}
                />
            </DrawerContentScrollView>
        )
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-blue-300`}>
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
                    <Drawer.Screen name="Inicio" component={HomeScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default MainLayout
