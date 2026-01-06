import React, { useRef, useEffect } from "react";
import { View, Animated, ViewStyle } from "react-native";
import Svg, { Image } from "react-native-svg";

// --- Interfaces ---

interface ArrowIconProps {
  /** The rotation angle in degrees */
  yaw: number;
  /** Width of the icon, defaults to 100 */
  width?: number;
  /** Height of the icon, defaults to 100 */
  height?: number;
  /** Optional container style */
  style?: ViewStyle;
}

// --- Component ---

const ArrowIcon: React.FC<ArrowIconProps> = ({
                                               yaw,
                                               width = 100,
                                               height = 100,
                                               style
                                             }) => {
  // Arrow image local asset
  const imageSource = require("../../assets/images/arrow.png");

  // Persistent animation reference - explicitly typed for Animated.Value
  const rotateAnim = useRef<Animated.Value>(new Animated.Value(yaw)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: yaw,
      stiffness: 100,
      damping: 15, // Slightly increased damping for smoother navigation feel
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [yaw, rotateAnim]);

  // Interpolate rotation. 
  // We keep the range simple, but Animated handles values outside the range via extrapolation.
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
};

export default ArrowIcon;