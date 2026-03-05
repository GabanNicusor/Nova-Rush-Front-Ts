import React from 'react';
import {Animated, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

interface IStyle {
    recenterButton: ViewStyle;
}

interface RecenterButtonProps {
    onPress: () => void;
    position: Animated.Value | Animated.AnimatedInterpolation<string | number>;
}

export default function RecenterButton({
                                           onPress,
                                           position,
                                       }: RecenterButtonProps) {
    return (
        <Animated.View
            style={
                [
                    styles.recenterButton,
                    {bottom: position},
                ]
            }
        >
            <TouchableOpacity onPress={onPress}>
                <Ionicons name="locate-outline" size={30} color="black"/>
            </TouchableOpacity>
        </Animated.View>
    );
};


const styles = StyleSheet.create<IStyle>({
    recenterButton: {

        position: 'absolute',
        right: 20,
        padding: 10,

        backgroundColor: 'white',

        borderRadius: 50,

        elevation: 5,
    },
});

