import {Animated, Button, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import React, {useRef, useState} from 'react';

interface IStyle {
    container: ViewStyle;
    contentContainer: ViewStyle;
    card: ViewStyle;
    cardTitle: TextStyle;
    label: TextStyle;
    field: ViewStyle;
    input: TextStyle;
    textArea: TextStyle;
}

interface AddressDetailsCardProps {
    name: string;
    phoneNumber: string;
    notes: string;
    setName: (text: string) => void;
    setNumber: (text: string) => void;
    setNotes: (text: string) => void;
    style?: ViewStyle;
}

export default function AddressDetailsCard({
                                               name,
                                               phoneNumber,
                                               notes,
                                               setName,
                                               setNumber,
                                               setNotes,
                                               style
                                           }: AddressDetailsCardProps) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const animation = useRef<Animated.Value>(new Animated.Value(0)).current;

    const height = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 330],
    });

    const toggle = (): void => {
        const toValue = expanded ? 0 : 1;
        setExpanded(!expanded);

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={[styles.card, style]}>
            <Button
                title={expanded ? 'Close Details' : 'See Details'}
                onPress={toggle}
                color="#007AFF"
            />

            <Animated.View style={[styles.container, {height}]}>
                <View style={styles.contentContainer}>
                    <Text style={styles.cardTitle}>Customer Info</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter Name"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setNumber}
                            placeholder="Enter Phone Number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Notes</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Additional Info"
                            multiline
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create<IStyle>({
    container: {
        overflow: 'hidden',
    },
    contentContainer: {
        paddingTop: 16,
    },

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
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 5,
    },

    field: {
        marginBottom: 12,
    },

    input: {
        padding: 12,
        fontSize: 16,

        backgroundColor: '#f1f3f5',
        borderRadius: 10,
        color: '#333',
    },

    textArea: {
        height: 90,

        textAlignVertical: 'top',
    },
});
