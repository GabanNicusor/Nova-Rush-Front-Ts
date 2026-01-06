import React from 'react';
import {
  View,
  Animated,
  ViewStyle,
  ImageSourcePropType,
  GestureResponderEvent,
} from 'react-native';
import Svg, { Image } from 'react-native-svg';

// --- Interfaces ---

interface FailedDeliveryIconProps {
  /** Callback function triggered when the icon is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /** Optional size prop to make the component reusable */
  size?: number;
  /** Optional style for the container View */
  style?: ViewStyle;
}

// --- Component ---

const FailedDeliveryIcon: React.FC<FailedDeliveryIconProps> = ({
  onPress,
  size = 40,
  style,
}) => {
  // Explicitly type the required asset
  const imageSource: ImageSourcePropType = require('../../assets/images/failed-delivery.png');

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

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
};

export default FailedDeliveryIcon;
