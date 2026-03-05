import React from 'react';
import {StyleSheet, Text, TextInput, TextStyle, View, ViewStyle} from 'react-native';

interface AddressNameCardProps {
    address: string;
}

interface IStyles {
    card: ViewStyle;
    cardTitle: TextStyle;
    cardInput: TextStyle;
}

export default function AddressNameCard({address}: AddressNameCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>
                Delivery Location
            </Text>
            <TextInput
                style={styles.cardInput}
                value={address}
                editable={false}
                selectTextOnFocus={false}
            />
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    card: {
        padding: 16,

        backgroundColor: '#fff',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,

        elevation: 3,
    },

    cardTitle: {
        marginBottom: 10,

        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    cardInput: {
        padding: 12,

        fontSize: 16,
        backgroundColor: '#f1f3f5',
        borderRadius: 10,
        color: '#333',
    },
});
