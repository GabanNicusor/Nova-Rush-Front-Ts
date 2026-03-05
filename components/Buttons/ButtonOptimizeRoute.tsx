import React from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

import {Fontisto} from '@react-native-vector-icons/fontisto';

interface IStyles {
    button: ViewStyle;
    buttonText: TextStyle;
    icon: TextStyle;
}

interface ButtonOptimizeRouteProps {
    onPress: () => void;
    title: string;
    disabled?: boolean;
    style?: ViewStyle | ViewStyle[] | undefined;
    textStyle?: TextStyle | TextStyle[] | undefined;
}

export default function ButtonOptimizeRoute({
                                                                     onPress,
                                                                     title,
                                                                     disabled = false,
                                                                     style,
                                                                     textStyle
                                                                 }: ButtonOptimizeRouteProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style]}
            disabled={disabled}
        >
            <Fontisto name="search" size={15} color="white" style={styles.icon}/>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create<IStyles>({
    button: {
        justifyContent: 'center',
        flexDirection: 'row',

        position: 'absolute',
        zIndex: 10,

        width: '90%',
        padding: 12,

        borderWidth: 1,
        borderRadius: 15,
        marginVertical: 5,

        shadowColor: '#000',
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.8,
        shadowRadius: 1,

        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 8,
    },
});
