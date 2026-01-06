import React from 'react';
import {
  View,
  Animated,
  ViewStyle,
  ImageSourcePropType,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import Svg, { Image } from 'react-native-svg';

// --- Interfaces ---

interface NavigationIconProps {
  /** Callback triggered when the icon is tapped */
  onPress?: (event: GestureResponderEvent) => void;
  /** Size of the icon (width and height), defaults to 40 */
  size?: number;
  /** Optional container style */
  style?: ViewStyle;
}

// --- Component ---

const NavigationIcon: React.FC<NavigationIconProps> = ({
  onPress,
  size = 40,
  style,
}) => {
  // Explicitly type the asset for safety
  const imageSource: ImageSourcePropType = require('../../assets/images/navigation-arrow.png');

  return (
    <View style={[styles.container, style]}>
      <Animated.View>
        {/* Note: Using onPress directly on Svg works in react-native-svg,
                   but ensure you have a large enough touch target for UX.
                */}
        <Svg width={size} height={size} onPress={onPress}>
          <Image
            href={imageSource}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});

export default NavigationIcon;
