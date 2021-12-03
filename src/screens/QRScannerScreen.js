import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Icon } from 'react-native-elements'
import { Context as QRScannerContext} from '../context/QRScannerContext';
import PermissionWarningDenied from './../components/scanner/PermissionWarningDenied'

const QRScannerScreen = () => {
    const { 
        state, 
        setScannedStatus,
        handleBarCodeScanned,
        requestBarcodeScannerPermissions 
    } = useContext(QRScannerContext);

    useEffect(() => {
        requestBarcodeScannerPermissions();
    }, []);

    return (
        <View style={styles.container}>
            {!state.hasPermission ?
                <PermissionWarningDenied 
                    message={state.message} 
                    requestBarcodeScannerPermissions={requestBarcodeScannerPermissions} />
            :
                <BarCodeScanner
                    onBarCodeScanned={state.scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject} >
                        <View style={{ flex: 3, backgroundColor: opacity }} />
                        <View style={{ flex: 4, flexDirection: 'row' }}>
                            <View style={{ flex: 1, backgroundColor: opacity }} />
                            <View style={{ flex: 5, backgroundColor: 'transparent' }} />
                            <View style={{ flex: 1, backgroundColor: opacity }} />
                        </View>
                        <View style={{ flex: 3, backgroundColor: opacity, justifyContent: 'center', alignItems: 'center' }}>
                            {state.scanned && !state.fetchingData ?
                                <TouchableOpacity onPress={() => setScannedStatus(!state.scanned)}>
                                    <Icon raised name='qrcode' type='font-awesome' color='black' />
                                </TouchableOpacity>
                            :
                                null}

                            { state.fetchingData && <ActivityIndicator size="large" color="#ffffff" /> }

                            {
                                (!state.isValidCode && state.scanned) &&
                                Alert.alert(
                                    "Error de QR",
                                    state.message,
                                    [{ 
                                        text: "OK", 
                                        onPress: () => setScannedStatus(!state.scanned)
                                    }]
                                )
                            }

                        </View>
                </BarCodeScanner>
            }
        </View>
    )
}

export default QRScannerScreen

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})
