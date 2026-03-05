import React from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle,} from 'react-native';
import NavigationIcon from '../SvgImages/NavigationIcon';

interface IStyles {
    card: ViewStyle;
    cardTitle: TextStyle;
    cardInput: TextStyle;
    textStyle: TextStyle;
}

interface NavigationCardProps {
    onPress: () => void;
}

export default function NavigationCard({onPress}: NavigationCardProps) {
    return (
        <View style={styles.card}>
            <NavigationIcon onPress={onPress}/>
            <Text style={styles.textStyle}>
                Navigate
            </Text>
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    card: {
        width: 130,
        height: 90,
        padding: 16,

        backgroundColor: '#fff',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,

        elevation: 3,
    },

    cardTitle: {
        marginBottom: 10,

        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    cardInput: {
        padding: 12,

        fontSize: 16,
        backgroundColor: '#f1f3f5',
        borderRadius: 10,
        color: '#333',
    },

    textStyle: {
        textAlign: 'center'
    }
});
