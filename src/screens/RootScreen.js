import React, { useContext, useEffect } from 'react';
import { Context as AuthContext} from './../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import SplashScreen from './SplashScreen'

const RootScreen = () => {
    const { state, tryLocalSignin } = useContext(AuthContext);
    
    useEffect(() => {
        tryLocalSignin();
    }, [])
    
    if (state.fetchingData) {
        return <SplashScreen />;
    }

    return (
        state.user == null ? (
            <>
                <AuthLayout />
            </>
            ) : (
            <>
                <MainLayout />
            </>
        )
    )
}

export default RootScreen
