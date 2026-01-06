import React from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle, // For defining styles
  StyleProp, // For the component style prop
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

// 1. Define the props interface
interface RecenterButtonProps {
  onPress: () => void;
  // The position is an Animated value, typically bound to a style property.
  position: Animated.Value | Animated.AnimatedInterpolation<string | number>;
}

// 2. Apply the interface to the component
const RecenterButton: React.FC<RecenterButtonProps> = ({
  onPress,
  position,
}) => (
  <Animated.View
    // We use StyleProp<ViewStyle> to correctly type the array of styles,
    // including the animated style.
    style={
      [
        styles.recenterButton as ViewStyle,
        { bottom: position },
      ] as StyleProp<ViewStyle>
    }
  >
    <TouchableOpacity onPress={onPress}>
      {/* Ionicons is used for the location/recenter symbol */}
      <Ionicons name="locate-outline" size={30} color="black" />
    </TouchableOpacity>
  </Animated.View>
);

// 3. Define styles
const styles = StyleSheet.create({
  recenterButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});

export default RecenterButton;
