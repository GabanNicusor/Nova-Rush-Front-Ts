import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';


interface IStyles {
    container: ViewStyle;
    scrollContainer: ViewStyle;
    card: ViewStyle;
    title: TextStyle;
    field: ViewStyle;
    label: TextStyle;
    input: TextStyle;
    textArea: TextStyle;
    ratingContainer: ViewStyle;
    emojiContainer: ViewStyle;
    emoji: TextStyle;
    good: TextStyle;
    neutral: TextStyle;
    bad: TextStyle;
    selected: ViewStyle;
    saveButton: ViewStyle;
    saveButtonText: TextStyle;
}

type RatingType = 'good' | 'neutral' | 'bad' | null;

interface VotesState {
    good: number;
    neutral: number;
    bad: number;
}

export default function AddressDetailsScreen() {
    const [name, setName] = useState<string>('John Doe');
    const [address, setAddress] = useState<string>(
        '123 Main Street, New York, NY',
    );
    const [number, setNumber] = useState<string>('+1 234 567 890');
    const [notes, setNotes] = useState<string>('');
    const [rating, setRating] = useState<RatingType>(null);
    const [votes, setVotes] = useState<VotesState>({
        good: 10,
        neutral: 5,
        bad: 3,
    });

    const handleVote = (type: Exclude<RatingType, null>): void => {
        setVotes(prevVotes => ({
            ...prevVotes,
            [type]: prevVotes[type] + 1,
        }));
        setRating(type);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Address Details</Text>

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
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Enter Address"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={number}
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

                    <Text style={styles.label}>Customer Rating</Text>
                    <View style={styles.ratingContainer}>
                        {(['good', 'neutral', 'bad'] as const).map(type => {
                            const icons = {good: '😊', neutral: '😐', bad: '😠'};
                            return (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => handleVote(type)}
                                    style={[
                                        styles.emojiContainer,
                                        rating === type && styles.selected,
                                    ]}
                                >
                                    <Text style={[styles.emoji, styles[type]]}>
                                        {`${icons[type]} ${votes[type]}`}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    card: {
        width: '100%',
        padding: 20,

        backgroundColor: 'white',
        borderRadius: 15,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 5,

        elevation: 4,
    },

    title: {
        marginBottom: 15,

        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },

    field: {
        marginBottom: 15,
    },

    label: {
        marginBottom: 5,

        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },

    input: {
        padding: 12,

        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },

    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },

    emojiContainer: {
        padding: 10,
        borderRadius: 10,
    },

    emoji: {
        fontSize: 30,
    },

    good: {
        color: 'green',
    },

    neutral: {
        color: 'orange',
    },

    bad: {
        color: 'red',
    },

    selected: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: 'green',
    },

    saveButton: {
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,

        backgroundColor: '#4A90E2',
        borderRadius: 10,

        elevation: 3,
    },

    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
