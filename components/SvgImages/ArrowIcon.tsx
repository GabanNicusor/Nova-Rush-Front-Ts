import React, {useEffect, useRef} from "react";
import {Animated, StyleSheet, View, ViewStyle} from "react-native";
import Svg, {Image} from "react-native-svg";


interface IStyles {
    container: ViewStyle;
}

interface ArrowIconProps {
    yaw: number;
    width?: number;
    height?: number;
    style?: ViewStyle;
}


export default function ArrowIcon({
                                      yaw,
                                      width = 100,
                                      height = 100,
                                      style
                                  }: ArrowIconProps) {
    const imageSource = require("../../assets/images/arrow.png");

    const rotateAnim = useRef<Animated.Value>(new Animated.Value(yaw)).current;

    useEffect(() => {
        Animated.spring(rotateAnim, {
            toValue: yaw,
            stiffness: 100,
            damping: 15,
            mass: 1,
            useNativeDriver: true,
        }).start();
    }, [yaw, rotateAnim]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={[styles.container, style]}>
            <Animated.View style={{transform: [{rotate: rotateInterpolate}]}}>
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

const styles = StyleSheet.create<IStyles>({
    container: {
        justifyContent: "center",
        alignItems: "center",
    }
});

