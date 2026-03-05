import React from "react";
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {OrderType} from "@/types/enums/OrderType";
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IStyles {
    wrapper: ViewStyle;
    badge: ViewStyle;
    badgeSelected: ViewStyle;
    stopText: TextStyle;
    iconGroup: ViewStyle;
    arrow: ViewStyle;
    arrowSelected: ViewStyle;
}

interface ExpandableMarkerProps {
    is_selected: boolean;
    stop_number: string | number;
    delivery_state: OrderType;
}

export default function ExpandableMarker({is_selected, stop_number, delivery_state}: ExpandableMarkerProps) {
    const isDelivery = delivery_state === 1;
    const isPickup = delivery_state === 2;
    const isBoth = delivery_state === 3;

    return (
        <View style={styles.wrapper}>
            <View style={[styles.badge, is_selected && styles.badgeSelected]}>
                <Text style={styles.stopText}>{stop_number}</Text>

                {(isDelivery || isPickup || isBoth) && (
                    <View style={styles.iconGroup}>
                        {(isDelivery || isBoth) && (
                            <Ionicons name="arrow-down" size={16} color="#00FF28"/>
                        )}
                        {(isPickup || isBoth) && (
                            <Ionicons name="arrow-up" size={16} color="#FFB703"/>
                        )}
                    </View>
                )}
            </View>
            <View style={[styles.arrow, is_selected && styles.arrowSelected]}/>
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
    },

    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 44,
        height: 30,
        paddingHorizontal: 8,

        backgroundColor: '#5900F0',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'transparent',

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,

        elevation: 4,
    },

    badgeSelected: {
        backgroundColor: '#9000FF',
        borderColor: '#00FF28',
    },

    stopText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },

    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 6,
        paddingLeft: 4,

        borderLeftWidth: 2,
        borderLeftColor: 'white',
    },

    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderTopWidth: 8,
        marginTop: -1,

        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FF8800',
    },

    arrowSelected: {
        borderTopColor: '#9000FF',
    },
});
