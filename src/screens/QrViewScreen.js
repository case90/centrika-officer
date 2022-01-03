import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Button } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';

const QrViewScreen = ({ route }) => {
    const navigation = useNavigation();

    return (
        <ScrollView style={tw`p-5`}>

            <View style={tw`items-center`}>
                <QRCode size={250} value={`${route.params?.data.data.id}`} />
            </View>
            <View style={tw`flex-row justify-between mb-5 mt-5 px-10`}>
                <Button
                    containerStyle={{ width: 120 }}
                    buttonStyle={[{ backgroundColor: 'gray' }]}
                    title="Copiar"
                    onPress={() => console.log('Copiar')}
                />
                <Button
                    containerStyle={{ width: 120 }}
                    buttonStyle={[{ backgroundColor: '#118EA6' }]}
                    title="Enviar QR"
                    onPress={() => console.log('EnviarQR')}
                />
            </View>
            <View style={{ paddingLeft: 10, paddingRight:10 }}>
                <Text style={tw`text-black text-xl font-thin mb-1`}>El vecino será responsable de</Text>
                <Text style={tw` text-base font-thin mb-1`}>1-.Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                <Text style={tw` text-base font-thin mb-1`}>2-.Donec neque est, porta nec posuere ac, rutrum ac mi. </Text>
                <Text style={tw` text-base font-thin mb-1`}>3-.Aliquam ac fermentum odio. </Text>
                <Text style={tw` text-base font-thin mb-1`}>4-.Aliquam sapien nulla, sodales eget faucibus lacinia, bibendum nec ante.</Text>
                <Text style={tw` text-base font-thin mb-1`}>5-.Nunc consequat lorem et justo vestibulum tristique. Vestibulum vel orci vitae leo tincidunt tincidunt sed in risus.</Text>
                <Text style={tw` text-base font-thin mb-1`}>6-.Vivamus molestie laoreet elit pharetra pretium. Nunc a leo sed justo suscipit consequat at non erat.</Text>
            </View>
            <View style={tw`items-center mt-5 mb-14`}>
                <Button
                    containerStyle={{ width: 200 }}
                    buttonStyle={[{ backgroundColor: '#118ea6' }]}
                    title="Terminar"
                    onPress={() => navigation.navigate('Inicio')}
                />
            </View>

        </ScrollView>
     
    )
}

export default QrViewScreen