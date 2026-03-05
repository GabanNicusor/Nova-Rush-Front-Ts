import React from 'react';
import {Animated, StyleSheet, TouchableOpacity, ViewStyle} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

interface IStyle {
    XButton: ViewStyle;
}

interface XButtonProps {
    onPress: () => void;
}

export default function XButton({onPress}: XButtonProps) {
    return (
        <Animated.View style={styles.XButton}>
            <TouchableOpacity onPress={onPress}>
                <Ionicons name="close-circle-outline" size={40} color="black"/>
            </TouchableOpacity>
        </Animated.View>
    );
};


const styles = StyleSheet.create<IStyle>({
    XButton: {
        position: 'absolute',
        zIndex: 10,
        right: 10,
        top: -3,

        padding: 1,
        backgroundColor: 'white',
        borderRadius: 50,

        elevation: 5,
    }
});

