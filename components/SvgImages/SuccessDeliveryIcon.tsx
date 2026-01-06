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

interface SuccessDeliveryIconProps {
  /** Callback function triggered when the success icon is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /** Size of the icon, defaults to 40 */
  size?: number;
  /** Optional style for the outer container */
  style?: ViewStyle;
}

// --- Component ---

const SuccessDeliveryIcon: React.FC<SuccessDeliveryIconProps> = ({
  onPress,
  size = 40,
  style,
}) => {
  // Reference to the local success asset
  const imageSource: ImageSourcePropType = require('../../assets/images/success-delivery.png');

  return (
    <View style={[styles.container, style]}>
      <Animated.View>
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

export default SuccessDeliveryIcon;
