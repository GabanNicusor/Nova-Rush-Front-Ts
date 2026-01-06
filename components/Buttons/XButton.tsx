import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  ViewStyle, // For style definitions
  StyleProp
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

// 1. Define the props interface
interface XButtonProps {
  onPress: () => void; // A function to handle the close action
}

// 2. Apply the interface to the component
const XButton: React.FC<XButtonProps> = ({ onPress }) => (
  // Use StyleProp<ViewStyle> to correctly type the style
  <Animated.View style={styles.XButton as StyleProp<ViewStyle>}>
    <TouchableOpacity onPress={onPress}>
      {/* Using Ionicons for a clear, outlined close/X symbol */}
      <Ionicons name="close-circle-outline" size={40} color="black" />
    </TouchableOpacity>
  </Animated.View>
);

// 3. Define styles
const styles = StyleSheet.create({
  XButton: {
    position: 'absolute',
    right: 10,
    top: -3,
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 50,
    elevation: 5,
    zIndex: 10,
  }
});

export default XButton;
