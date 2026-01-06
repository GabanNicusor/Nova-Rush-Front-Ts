import {
  Animated,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ViewStyle,
} from 'react-native';
import React, { useRef, useState } from 'react';

// --- Type Definitions ---

interface AddressDetailsCardProps {
  name: string;
  number: string;
  notes: string;
  // Use function types instead of Setter<string> to match your Pager callbacks
  setName: (text: string) => void;
  setNumber: (text: string) => void;
  setNotes: (text: string) => void;
  style?: ViewStyle; // Use ViewStyle directly for props
}

/**
 * An expandable card component.
 * In this architecture, setName/Number/Notes are debounced callbacks
 * handled by the Parent (PagerBottomSheet).
 */
const AddressDetailsCard: React.FC<AddressDetailsCardProps> = ({
  name,
  number,
  notes,
  setName,
  setNumber,
  setNotes,
  style,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const animation = useRef<Animated.Value>(new Animated.Value(0)).current;

  // content height for the expanded state
  const EXPANDED_HEIGHT = 330;

  const toggle = (): void => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false, // Height cannot use native driver
    }).start();
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, EXPANDED_HEIGHT],
  });

  return (
    <View style={[styles.card, style]}>
      <Button
        title={expanded ? 'Close Details' : 'See Details'}
        onPress={toggle}
        color="#007AFF"
      />

      <Animated.View style={[styles.container, {height} ]}>
        <View style={styles.contentContainer}>
          <Text style={styles.cardTitle}>Customer Info</Text>

          {/* Name Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName} // Triggers handleChange in Pager
              placeholder="Enter Name"
            />
          </View>

          {/* Phone Number Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber} // Triggers handleChange in Pager
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Notes Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes} // Triggers handleChange in Pager
              placeholder="Additional Info"
              multiline
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentContainer: {
    paddingTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f1f3f5',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
});

export default AddressDetailsCard;
