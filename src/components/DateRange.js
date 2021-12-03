import React, { useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Input, Icon } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import useDatePicker from './../hooks/useDatePicker'
import tw from 'tailwind-react-native-classnames';

const DateRange = ({ titleDate, titleTime, onChangeDate, onChangeTime }) => {
    const { state, handleVisibility, handleOnChangePicker } = useDatePicker()

    const onChangePicker = (event, selectedDate) => {
        handleOnChangePicker(selectedDate, state.mode)
    }

    useEffect(() => {
        onChangeDate(state.date)
    }, [state.date]);

    useEffect(() => {
        onChangeTime(state.time)
    }, [state.time]);

    return (
        <View>
            <View style={tw`flex-row`}>
                <Input
                    leftIcon={
                        <TouchableOpacity onPress={() => handleVisibility('date')}>
                            <Icon type='font-awesome' name='calendar' size={25} color='black' />
                        </TouchableOpacity>
                    }
                    editable={false}
                    inputStyle={tw`text-center`}
                    containerStyle={tw`flex-1`}
                    label={titleDate}
                    labelStyle={{ color: '#133C60' }}
                    value={state.date ? state.date.toString() : null}
                />
                <Input
                    leftIcon={
                        <TouchableOpacity onPress={() => handleVisibility('time')}>
                            <Icon type='font-awesome' name='clock-o' size={25} color='black' />
                        </TouchableOpacity>
                    }
                    editable={false}
                    inputStyle={tw`text-center`}
                    containerStyle={tw`flex-1`}
                    label={titleTime}
                    labelStyle={{ color: '#133C60' }}
                    value={state.time ? state.time.toString() : null}
                />
            </View>
            {state.isVisible && (
                <DateTimePicker
                testID="tmpDate"
                dateFormat="year month day"
                value={state.tmpDate}
                mode={state.mode}
                is24Hour={true}
                display="default"
                onChange={onChangePicker}
                />
            )}
        </View>
    )
}

export default DateRange

const styles = StyleSheet.create({})
