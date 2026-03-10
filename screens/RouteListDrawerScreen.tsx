import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, ViewStyle,} from 'react-native';

import DateTimePicker, {DateTimePickerEvent,} from '@react-native-community/datetimepicker';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '@/state/store';
import {setAddressDetailsList, setAddressList, setAddressListId, setPolylineCoordsList} from '@/state/navSlice'

import createNewRouteList from '../service/RouteAddressList/Create/createNewRouteList';
import getAddressesByListId from '../service/RouteAddressList/Get/getAddressesByListId'

interface IStyles {
    container: ViewStyle;
    label: TextStyle;
    input: TextStyle;
    dateButton: ViewStyle;
    selectedButton: ViewStyle;
    dateButtonText: TextStyle;
    saveButton: ViewStyle;
    saveButtonText: TextStyle;
}

type DateChoice = 'today' | 'tomorrow' | 'custom';

type RootStackParamList = {
    MainApp: undefined;
};


export default function RouteListDrawerScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();

    // State
    const [routeName, setRouteName] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [dateChoice, setDateChoice] = useState<DateChoice>('today');


    const handleDateChange = (event: DateTimePickerEvent, date?: Date): void => {
        setShowPicker(false);
        if (date) {
            setSelectedDate(date);
            setDateChoice('custom');
        }
    };

    const getDayName = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {weekday: 'long'};
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const handleSave = async (): Promise<void> => {
        let selectedDateString: string;

        if (dateChoice === 'today') {
            selectedDateString = new Date().toISOString().split('T')[0];
        } else if (dateChoice === 'tomorrow') {
            selectedDateString = new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
        } else {
            selectedDateString = selectedDate.toISOString().split('T')[0];
        }

        const finalRouteName =
            routeName.trim() === '' ? getDayName(selectedDate) : routeName;

        try {
            const response = await createNewRouteList(
                finalRouteName,
                selectedDateString,
                dispatch,
            );
            if (response) {

                dispatch(setAddressList([]));
                dispatch(setAddressListId(response.id));
                dispatch(setAddressDetailsList([]));
                dispatch(setPolylineCoordsList([]));
                navigation.navigate('MainApp');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Alert.alert(
                'Error',
                'Create New Route List failed. Something went wrong.',
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Route Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter route name"
                value={routeName}
                onChangeText={setRouteName}
            />

            <Text style={styles.label}>Select Date</Text>

            <TouchableOpacity
                style={[
                    styles.dateButton,
                    dateChoice === 'today' && styles.selectedButton,
                ]}
                onPress={() => setDateChoice('today')}
            >
                <Text style={styles.dateButtonText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.dateButton,
                    dateChoice === 'tomorrow' && styles.selectedButton,
                ]}
                onPress={() => setDateChoice('tomorrow')}
            >
                <Text style={styles.dateButtonText}>Tomorrow</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.dateButton,
                    dateChoice === 'custom' && styles.selectedButton,
                ]}
                onPress={() => {
                    setDateChoice('custom');
                    setShowPicker(true);
                }}
            >
                <Text style={styles.dateButtonText}>
                    {dateChoice === 'custom'
                        ? selectedDate.toLocaleDateString()
                        : 'Select a Date'}
                </Text>
            </TouchableOpacity>

            {dateChoice === 'custom' && showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Create Route</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.saveButton, {backgroundColor: '#6c757d'}]}
                onPress={() => navigation.navigate('MainApp')}
            >
                <Text style={styles.saveButtonText}>Go Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,
        padding: 20,

        backgroundColor: '#fff',
    },

    label: {
        marginBottom: 8,

        fontSize: 16,
        fontWeight: '600',
    },

    input: {
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 20,

        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },

    dateButton: {
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',

        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },

    selectedButton: {
        backgroundColor: '#4CAF50',
    },

    dateButtonText: {
        fontSize: 16,
        color: '#000',
    },

    saveButton: {
        padding: 15,
        marginTop: 20,
        alignItems: 'center',

        backgroundColor: '#4CAF50',
        borderRadius: 8,

        elevation: 2,
    },

    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
