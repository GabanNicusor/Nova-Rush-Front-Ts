import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, NavigationProp } from '@react-navigation/native';

// --- Interfaces & Types ---

type RatingType = 'good' | 'neutral' | 'bad' | null;

interface VotesState {
  good: number;
  neutral: number;
  bad: number;
}

// Replace 'any' with your actual RootStackParamList if available
type RootStackParamList = {
  MainApp: undefined;
  AddressDetails: undefined;
  ListScreen: undefined;
};

// --- Component ---

const AddressDetailsScreen: React.FC = () => {
  // Hooks
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State
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

  // Handlers
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
              const icons = { good: '😊', neutral: '😐', bad: '😠' };
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

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as ViewStyle,
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  card: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  } as ViewStyle,
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  } as TextStyle,
  field: {
    marginBottom: 15,
  } as ViewStyle,
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  } as TextStyle,
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  } as TextStyle,
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  } as TextStyle,
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  } as ViewStyle,
  emojiContainer: {
    padding: 10,
    borderRadius: 10,
  } as ViewStyle,
  emoji: {
    fontSize: 30,
  } as TextStyle,
  good: { color: 'green' } as TextStyle,
  neutral: { color: 'orange' } as TextStyle,
  bad: { color: 'red' } as TextStyle,
  selected: {
    backgroundColor: '#e8f5e9', // Light green
    borderWidth: 1,
    borderColor: 'green',
  } as ViewStyle,
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  } as ViewStyle,
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
});

export default AddressDetailsScreen;
