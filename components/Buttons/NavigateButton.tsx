import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

// 1. Define the props interface
interface NavigateButtonProps {
  onPress: () => void; // A function that is called when the button is pressed
}

// 2. Apply the interface to the component
const NavigateButton: React.FC<NavigateButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Navigate</Text>
    </TouchableOpacity>
  );
};

// 3. Define styles with explicit type annotation for better type inference
const styles = StyleSheet.create({
  // Use ViewStyle for the container style
  button: {
    width: '90%',
    backgroundColor: '#4A90E2',
    paddingVertical: '3%',
    paddingHorizontal: 24,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  } as ViewStyle, // Type casting for better component integration
  // Use TextStyle for the text style
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle, // Type casting for better component integration
});

export default NavigateButton;
