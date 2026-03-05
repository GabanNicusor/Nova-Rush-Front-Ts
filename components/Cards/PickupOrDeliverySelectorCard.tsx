import React, {useState} from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle,} from 'react-native';
import {OrderType, OrderTypeDisplay} from '@/types/enums/OrderType';

interface IStyles {
    container: ViewStyle;
    label: TextStyle;
    toggleContainer: ViewStyle;
    optionButton: ViewStyle;
    selectedOption: ViewStyle;
    optionText: TextStyle;
    selectedText: TextStyle;
}

interface OrderItem {
    OrderType?: OrderType;

    [key: string]: any;
}

interface PickupOrDeliverySelectorCardProps {
    item: OrderItem;
    setSelectedOrderType: (type: OrderTypeDisplay) => void;
}

const displayToEnum: Record<OrderTypeDisplay, OrderType> = {
    'Delivery': OrderType.DELIVERY,
    'Pickup': OrderType.PICKUP,
    'Both': OrderType.BOTH,
};

const enumToDisplay: Record<OrderType, OrderTypeDisplay> = {
    [OrderType.PICKUP]: 'Pickup',
    [OrderType.DELIVERY]: 'Delivery',
    [OrderType.BOTH]: 'Both',
};

export default function PickupOrDeliverySelectorCard({
                                                         item,
                                                         setSelectedOrderType
                                                     }: PickupOrDeliverySelectorCardProps) {
    const [orderType, setOrderType] = useState<OrderType>(item.orderType);

    const handleChange = (option: OrderTypeDisplay): void => {
        const newValue = displayToEnum[option];
        setOrderType(newValue);
        setSelectedOrderType(enumToDisplay[newValue]);
    };

    const options: OrderTypeDisplay[] = ['Delivery', 'Pickup', 'Both'];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Order Type</Text>
            <View style={styles.toggleContainer}>
                {options.map(option => {

                    const isSelected = orderType === displayToEnum[option];

                    return (
                        <TouchableOpacity
                            key={option}
                            activeOpacity={0.7}
                            style={[styles.optionButton, isSelected && styles.selectedOption]}
                            onPress={() => handleChange(option)}
                        >
                            <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        padding: 16,
        marginVertical: 12,

        backgroundColor: '#fff',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,

        elevation: 3,
    },

    label: {
        marginBottom: 12,

        fontSize: 18,
        fontWeight: '600',
    },

    toggleContainer: {
        flexDirection: 'row',

        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
    },

    optionButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',

        backgroundColor: '#f2f2f2',
    },

    selectedOption: {
        backgroundColor: '#007AFF',
    },

    optionText: {
        fontSize: 16,
        color: '#333',
    },

    selectedText: {
        color: '#fff',
        fontWeight: '600',
    },
});
