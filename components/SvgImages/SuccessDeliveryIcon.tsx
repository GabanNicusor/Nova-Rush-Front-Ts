import React from 'react';
import {Animated, GestureResponderEvent, ImageSourcePropType, StyleSheet, View, ViewStyle} from 'react-native';
import Svg, {Image} from 'react-native-svg';

interface IStyles {
    container: ViewStyle;
}

interface SuccessDeliveryIconProps {
    onPress?: (event: GestureResponderEvent) => void;
    size?: number;
    style?: ViewStyle;
}

export default function SuccessDeliveryIcon({
                                                onPress,
                                                size = 40,
                                                style,
                                            }: SuccessDeliveryIconProps) {
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

const styles = StyleSheet.create<IStyles>({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

