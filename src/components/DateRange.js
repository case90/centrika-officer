import React, { useEffect, useReducer } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Input, Icon } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import tw from 'tailwind-react-native-classnames';

const initialState = { 
    initial_date: null,
    final_date: null,
    tmpDate: null,
    dateType: 'initial_date',
    isVisible: false
};

const datePickerReducer = (state = initialState, action) => {
    switch(action.type){
        case 'CLEAR_STATE':
            return initialState
        case 'HIDE_PICKER':
            return { ...state, isVisible: false }
        case 'SET_INITIAL_DATA':
            return { ...state, initial_date: action.payload.initial_date }
        case 'SET_VISIBILITY_STATE':
            let tmpDate = new Date();
            if(state.initial_date || state.final_date)
                tmpDate = getSelectedDateByUser(action.payload);

            return { 
                ...state, 
                tmpDate,
                isVisible: action.payload.isVisible,  
                dateType: action.payload.dateType 
            }
        case 'SET_INITIAL_DATE_VALUE':
            return { 
                ...state, 
                initial_date: action.payload.initial_date,
                tmpDate: action.payload.tmpDate,
                isVisible: false 
            }
        case 'SET_FINAL_DATE_VALUE':
            return { 
                ...state, 
                final_date: action.payload.final_date,
                tmpDate: action.payload.tmpDate,
                isVisible: false 
            }
        default:
            return state
    }
}

const getSelectedDateByUser = (payload) => {
    const initial_date = payload.dateType === 'initial_date' ? payload.dateInputValue : new Date();
    const final_date   = payload.dateType === 'final_date' ? payload.dateInputValue : new Date();
    const tmpDate = payload.dateType === 'initial_date' ? initial_date : final_date;
    let formatDate = new Date();
    if(tmpDate){
        formatDate = new Date( moment(tmpDate, 'DD-MM-YYYY').add(1, 'days').format('YYYY-MM-DD') );
    }
    return formatDate;
}

const DateRange = ({ titleInitialDate, titleFinalDate, clearDates,  onChangeInitialDate, onChangeFinalDate }) => {

    const [state, dispatch] = useReducer(datePickerReducer, initialState);

    const getFormatedDate = (date, format) => {
        return moment(date).format(format)   
    }

    const handleVisibility = (dateType, dateInputValue) => {
        dispatch({ 
            type: 'SET_VISIBILITY_STATE', 
            payload: { 
                isVisible: true,
                dateInputValue,
                dateType 
            } 
        })
    }

    const clearState = () => {
        dispatch({ type: 'CLEAR_STATE' })
    }

    const handleOnChangePicker = (selectedDate, dateType) => {
        const currentDate = selectedDate || state.date;
        if(selectedDate){
            if(dateType === 'initial_date'){
                dispatch({ 
                    type: 'SET_INITIAL_DATE_VALUE', 
                    payload: {
                        initial_date: getFormatedDate(currentDate, 'DD-MM-YYYY'),
                        tmpDate: new Date(selectedDate)
                    } 
                })
            }else{
                dispatch({ 
                    type: 'SET_FINAL_DATE_VALUE', 
                    payload: {
                        final_date: getFormatedDate(currentDate, 'DD-MM-YYYY'),
                        tmpDate: new Date(selectedDate)
                    } 
                })
            }
        }else{
            dispatch({ type: 'HIDE_PICKER' })
        }
    }

    const onChangePicker = (event, selectedDate) => {
        handleOnChangePicker(selectedDate, state.dateType)
    }

    useEffect(() => {
        onChangeInitialDate(state.initial_date)
    }, [state.initial_date]);

    useEffect(() => {
        onChangeFinalDate(state.final_date)
    }, [state.final_date]);

    useEffect(() => {
        clearState()
    }, [clearDates]);

    return (
        <View>
            <View style={tw`flex`}>
                <Text style={tw`mb-2`}>{titleInitialDate}</Text>
                <TouchableOpacity onPress={() => handleVisibility('initial_date', state.initial_date ? state.initial_date.toString() : null)}>
                    <Input
                        leftIcon={<Icon type='font-awesome' name='calendar' size={25} color='black' />}
                        editable={false}
                        inputStyle={tw`ml-3 text-sm`}
                        inputContainerStyle={tw`border pl-2 rounded-md`}
                        containerStyle={tw`flex-1 p-0`}
                        labelStyle={{ color: '#133C60' }}
                        placeholder="Seleccione fecha"
                        value={state.initial_date ? state.initial_date.toString() : null}
                    />
                </TouchableOpacity>
                <Text style={tw`mb-2`}>{titleFinalDate}</Text>
                <TouchableOpacity onPress={() => handleVisibility('final_date', state.final_date ? state.final_date.toString() : null)}>
                    <Input
                        leftIcon={<Icon type='font-awesome' name='calendar' size={25} color='black' />}
                        editable={false}
                        inputStyle={tw`ml-3 text-sm`}
                        inputContainerStyle={tw`border pl-2 rounded-md`}
                        containerStyle={tw`flex-1 p-0`}
                        labelStyle={{ color: '#133C60' }}
                        placeholder="Seleccione fecha"
                        value={state.final_date ? state.final_date.toString() : null}
                    />
                </TouchableOpacity>
            </View>
            {state.isVisible && (
                <DateTimePicker
                    testID="tmpDate"
                    dateFormat="year month day"
                    value={state.tmpDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChangePicker}
                />
            )}
        </View>
    )
}

export default DateRange
