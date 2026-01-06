import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle, // Used for the style prop of TouchableOpacity
  TextStyle, // Used for the style prop of Text
} from 'react-native';

import { Fontisto } from '@react-native-vector-icons/fontisto';


// 1. Define the props interface
interface ButtonOptimizeRouteProps {
  onPress: () => void;
  title: string;
  disabled?: boolean; // Optional prop
  // Style props can be an object, an array of styles, or undefined
  style?: ViewStyle | ViewStyle[] | undefined;
  textStyle?: TextStyle | TextStyle[] | undefined;
}

// 2. Apply the interface to the component
const ButtonOptimizeRoute: React.FC<ButtonOptimizeRouteProps> = ({
  onPress,
  title,
  disabled = false, // Give 'disabled' a default value for better TS handling
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      // The disabled state is handled by the component,
      // but we need to pass the prop
      onPress={onPress}
      style={[styles.button, style]}
      disabled={disabled}
    >
      {/* The icon name 'sync' corresponds to the optimization symbol (refresh/route calculation) */}
      <Fontisto name="search" size={15} color="white" style={styles.icon} />
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

// 3. Keep the StyleSheet unchanged, as it's pure JavaScript/JSON
const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginVertical: 5,
    width: '90%',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
});

export default ButtonOptimizeRoute;
