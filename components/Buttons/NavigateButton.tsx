import React from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

interface IStyles {
    button: ViewStyle;
    buttonText: TextStyle;
}

interface NavigateButtonProps {
    onPress: () => void;
}

export default function NavigateButton({onPress}: NavigateButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Navigate</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create<IStyles>({
    button: {
        alignItems: 'center',
        justifyContent: 'center',

        zIndex: 10,

        width: '90%',
        paddingVertical: '3%',
        paddingHorizontal: 24,

        backgroundColor: '#4A90E2',
        shadowColor: '#000',

        borderRadius: 15,

        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,

        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

