import React, {useState} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

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
    header: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    inputWrapper: ViewStyle;
    input: TextStyle;
    listContent: ViewStyle;
    resultCard: ViewStyle;
    resultText: TextStyle;
    iconWrapper: ViewStyle;
    footer: ViewStyle;
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
    const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
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
        const fullAddress = selectedAddress.address_complete || selectedAddress.address;
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
                const lat = selectedAddress.latitude ?? (selectedAddress.coordinates ? selectedAddress.coordinates[0] : 0);
                const lon = selectedAddress.longitude ?? (selectedAddress.coordinates ? selectedAddress.coordinates[1] : 0);
                const res = await addNewAddress(fullAddress, lat, lon);
                const newAddressId = await getAddressStartIdByAddress(fullAddress);
                if (newAddressId) {
                    await addUserStartAddress(user_id, newAddressId);
                    if (res) success = true;
                }
                const currentDate: string = new Date().toISOString().split('T')[0];
                dispatch(setUserStartAddress({id: newAddressId, createdAt: currentDate , address_complete: fullAddress,latitude: lat, longitude: lon }));
            }
            if (success) navigation.navigate('MainApp');
        } catch (error) {
            console.error('Error saving address:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Start Point</Text>
                    <Text style={styles.subtitle}>Where are you departing from?</Text>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={query}
                            onChangeText={handleSearch}
                            placeholder="Search address..."
                            placeholderTextColor="#999"
                            autoCorrect={false}
                        />
                    </View>

                    <FlatList
                        data={results}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        contentContainerStyle={styles.listContent}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={styles.resultCard}
                                onPress={() => handleAddressSelect(item)}
                            >
                                <View style={styles.iconWrapper}>
                                    <Text style={{fontSize: 14}}>📍</Text>
                                </View>
                                <Text style={styles.resultText} numberOfLines={2}>
                                    {item.address_complete || item.address}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            (!selectedAddress || loading) && styles.disabledButton,
                        ]}
                        onPress={saveAddress}
                        disabled={!selectedAddress || loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Saving...' : 'Confirm Location'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC', // Light, modern grey-blue background
    },
    header: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A1C1E',
    },
    subtitle: {
        fontSize: 16,
        color: '#6C757D',
        marginTop: 4,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    inputWrapper: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        marginTop: 15,
        marginBottom: 20,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        // Shadow for Android
        elevation: 3,
    },
    input: {
        height: 55,
        fontSize: 16,
        color: '#333',
    },
    listContent: {
        paddingBottom: 20,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EDF1F7',
    },
    iconWrapper: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    resultText: {
        flex: 1,
        fontSize: 15,
        color: '#444',
        lineHeight: 20,
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    saveButton: {
        height: 56,
        backgroundColor: '#007AFF', // Modern iOS Blue
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#C5CED9',
        shadowOpacity: 0,
        elevation: 0,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
    },
});
