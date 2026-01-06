import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';

// External
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppDispatch } from '../state/store';
import {setAddressList, setAddressListId} from '../state/navSlice'

// Service
import createNewRouteList from '../service/RouteAddressList/Create/createNewRouteList';
import getUserId from '../service/User/Get/getUserId'
import getAddressesByListId from '../service/RouteAddressList/Get/getAddressesByListId'
// --- Types ---

type DateChoice = 'today' | 'tomorrow' | 'custom';

type RootStackParamList = {
  MainApp: undefined;
  // Add other screens as needed
};

// --- Component ---

const RouteListDrawerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  // State
  const [routeName, setRouteName] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [dateChoice, setDateChoice] = useState<DateChoice>('today');

  /**
   * Handles the date picker change event
   */
  const handleDateChange = (event: DateTimePickerEvent, date?: Date): void => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      setDateChoice('custom');
    }
  };

  /**
   * Returns the full weekday name for a given date
   */
  const getDayName = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  /**
   * Logic to save the new route list
   */
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
        dispatch(setAddressList(await getAddressesByListId(response.id)));
        dispatch(setAddressListId(response.id))
        navigation.navigate('MainApp');
      }
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
        style={[styles.saveButton, { backgroundColor: '#6c757d' }]}
        onPress={() => navigation.navigate('MainApp')}
      >
        <Text style={styles.saveButtonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  } as ViewStyle,
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  } as TextStyle,
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  } as TextStyle,
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  selectedButton: {
    backgroundColor: '#4CAF50',
  } as ViewStyle,
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  } as TextStyle,
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
});

export default RouteListDrawerScreen;
