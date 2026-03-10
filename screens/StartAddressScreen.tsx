import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import getUserId from '../service/User/Get/getUserId';
import findAddressSuggestion from '../service/Address/Fetch/findAddressSuggestion';
import addNewAddress from '../service/Address/Add/addNewAddress';
import getAddressStartIdByAddress from '../service/Address/Get/getAddressStartIdByAddress';
import addUserStartAddress from '../service/Address/Add/addUserStartAddress';
import {setUserStartAddress} from "@/state/navSlice";
import {useAppDispatch} from "@/state/store";

interface IStyles {
    container: ViewStyle;
    contentContainer: ViewStyle;
    title: TextStyle;
    input: TextStyle;
    result: TextStyle;
    saveButton: ViewStyle;
    disabledButton: ViewStyle;
    saveButtonText: TextStyle;
}

interface AddressSuggestion {
    id?: string;
    address?: string;
    address_complete?: string;
    latitude?: number;
    longitude?: number;
    coordinates?: [number, number];
}

type RootStackParamList = {
    MainApp: undefined;
    StartAddressScreen: undefined;
};


export default function StartAddressScreen() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<AddressSuggestion[]>([]);
    const [selectedAddress, setSelectedAddress] =
        useState<AddressSuggestion | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
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
                const lat =
                    selectedAddress.latitude ??
                    (selectedAddress.coordinates ? selectedAddress.coordinates[0] : 0);
                const lon =
                    selectedAddress.longitude ??
                    (selectedAddress.coordinates ? selectedAddress.coordinates[1] : 0);

                const res = await addNewAddress(fullAddress, lat, lon);
                const newAddressId = await getAddressStartIdByAddress(fullAddress);

                if (newAddressId) {
                    await addUserStartAddress(user_id, newAddressId);
                    if (res) success = true;
                }
                const currentDate: string = new Date().toISOString().split('T')[0];

                dispatch(setUserStartAddress({id: newAddressId, createdAt: currentDate , address_complete: fullAddress,latitude: lat, longitude: lon }));
            }
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
                    renderItem={({item}) => (
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

const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,

        backgroundColor: '#fff',
    },

    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },

    title: {
        marginBottom: 20,
        textAlign: 'center',

        fontSize: 18,
        fontWeight: 'bold',
    },

    input: {
        height: 40,
        paddingLeft: 10,
        marginBottom: 10,

        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },

    result: {
        padding: 10,

        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },

    saveButton: {
        width: '100%',
        padding: 15,
        alignItems: 'center',

        backgroundColor: '#4CAF50',
        borderRadius: 8,

        elevation: 2,
    },

    disabledButton: {
        backgroundColor: '#aaa',
    },

    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
