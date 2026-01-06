import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

// --- Type Definitions ---

interface AddressNameCardProps {
  address: string;
}

// ---

const AddressNameCard: React.FC<AddressNameCardProps> = ({ address }) => {
  return (
    <View style={styles.card as StyleProp<ViewStyle>}>
      <Text style={styles.cardTitle as StyleProp<TextStyle>}>
        Delivery Location
      </Text>
      {/* The TextInput is used here as a styled, read-only display element */}
      <TextInput
        style={styles.cardInput as StyleProp<TextStyle>}
        value={address}
        editable={false} // Prevents user input
        selectTextOnFocus={false} // Prevents keyboard from popping up on tap
      />
    </View>
  );
};

// 3. Define styles with explicit types
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  } as TextStyle,
  cardInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    color: '#333',
  } as TextStyle,
});

export default AddressNameCard;
