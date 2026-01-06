import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';

// External
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, NavigationProp } from '@react-navigation/native';

// Service
import getUserId from '../service/User/Get/getUserId';
import findAddressSuggestion from '../service/Address/Fetch/findAddressSuggestion';
import addNewAddress from '../service/Address/Add/addNewAddress';
import getAddressStartIdByAddress from '../service/Address/Get/getAddressStartIdByAddress';
import addUserStartAddress from '../service/Address/Add/addUserStartAddress';

// --- Interfaces ---

interface AddressSuggestion {
  id?: string;
  address?: string;
  address_complete?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: [number, number]; // [lat, lon] or [lon, lat] depending on your API
}

type RootStackParamList = {
  MainApp: undefined;
  StartAddressScreen: undefined;
};

// --- Component ---

const StartAddressScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressSuggestion | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSearch = async (text: string): Promise<void> => {
    setQuery(text);
    if (text) {
      const suggestions = await findAddressSuggestion(text);
      setResults(suggestions || []);
    } else {
      setResults([]);
    }
  };

  const handleAddressSelect = (address: AddressSuggestion): void => {
    setSelectedAddress(address);
    setResults([]);
    setQuery(address.address_complete || address.address || '');
  };

  const saveAddress = async (): Promise<void> => {
    if (!selectedAddress) return;

    const fullAddress =
      selectedAddress.address_complete || selectedAddress.address;
    if (!fullAddress) return;

    try {
      setLoading(true);
      const user_id = await getUserId();
      if (!user_id) return;

      const address_id = await getAddressStartIdByAddress(fullAddress);

      let success = false;

      if (address_id) {
        const res = await addUserStartAddress(user_id, address_id);
        if (res) success = true;
      } else {
        // Determine coordinates based on available keys
        const lat =
          selectedAddress.latitude ??
          (selectedAddress.coordinates ? selectedAddress.coordinates[0] : 0);
        const lon =
          selectedAddress.longitude ??
          (selectedAddress.coordinates ? selectedAddress.coordinates[1] : 0);

        console.log("fullAddress" +  fullAddress)
        const res = await addNewAddress(fullAddress, lat, lon);
        const newAddressId = await getAddressStartIdByAddress(fullAddress);

        if (newAddressId) {
          await addUserStartAddress(user_id, newAddressId);
          if (res) success = true;
        }
      }
      console.log(success);
      if (success) {
        navigation.navigate('MainApp');
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Select an address where you are starting from
        </Text>

        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
          placeholder="Search address..."
          autoCorrect={false}
        />

        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAddressSelect(item)}>
              <Text style={styles.result}>
                {item.address_complete || item.address}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedAddress || loading) && styles.disabledButton,
          ]}
          onPress={saveAddress}
          disabled={!selectedAddress || loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Address'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  } as ViewStyle,
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  } as ViewStyle,
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  } as TextStyle,
  result: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  } as TextStyle,
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  } as ViewStyle,
  disabledButton: {
    backgroundColor: '#aaa',
  } as ViewStyle,
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
});

export default StartAddressScreen;
