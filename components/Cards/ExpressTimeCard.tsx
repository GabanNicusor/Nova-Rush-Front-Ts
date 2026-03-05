import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle,} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ExpressType} from '@/types/enums/ExpressType';

type ExpressTimeValue = 1 | 8 | 9 | 10 | 12;

interface IStyles {
    container: ViewStyle;
    label: TextStyle;
    pickerWrapper: ViewStyle;
    pickerClipper: ViewStyle;
    picker: TextStyle;
    item: TextStyle;
}

interface ExpressItem {
    expressType: ExpressType;

    [key: string]: any;
}

interface ExpressTimeCardProps {
    item: ExpressItem;
    setSelectedExpress: (time: ExpressTimeValue) => void;
}

const colorMap: Record<ExpressTimeValue, string> = {
    1: 'black',
    8: 'red',
    9: 'purple',
    10: '#ff6600',
    12: 'green',
};

const typeToTimeMap: Record<ExpressType, number> = {
    [ExpressType.STANDARD]: 1,
    [ExpressType.EIGHT]: 8,
    [ExpressType.NINE]: 9,
    [ExpressType.TEN]: 10,
    [ExpressType.TWELVE]: 12,
}

export default function ExpressTimeCard({
                                            item,
                                            setSelectedExpress,
                                        }: ExpressTimeCardProps) {

    const times: ExpressTimeValue[] = [1, 8, 9, 10, 12];

    const initialTime: ExpressTimeValue = useMemo(() => {
        const type = item.expressType;
        if (type !== undefined && type in typeToTimeMap) {
            return typeToTimeMap[type] as ExpressTimeValue;
        }
        return 1;
    }, [item.expressType]);

    const [selected, setSelected] = useState<ExpressTimeValue>(initialTime);

    const handleChange = (itemValue: ExpressTimeValue | unknown) => {
        const newTime = itemValue as ExpressTimeValue;
        setSelected(newTime);
        setSelectedExpress(newTime);
    };

    useEffect(() => {
        setSelected(initialTime);
    }, [initialTime]);


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Express</Text>
            <View style={styles.pickerWrapper}>
                <View style={styles.pickerClipper}>
                    <Picker
                        selectedValue={selected}
                        onValueChange={handleChange}
                        style={styles.picker}
                        itemStyle={[styles.item, {color: colorMap[selected]}]}
                    >
                        {times.map((time) => (
                            <Picker.Item
                                key={time}
                                label={time === 1 ? "--:--" : `${time}:00 h`}
                                value={time}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        height: 80,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#fff',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,

        elevation: 3,
    },

    label: {
        marginRight: 16,

        fontSize: 22,
        fontWeight: '600',
    },

    pickerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    pickerClipper: {
        height: 40,
        justifyContent: 'center',

        overflow: 'hidden',
    },

    picker: {
        height: 120,
        width: 200,
        justifyContent: 'center',
    },

    item: {
        fontSize: 30,
    },
});
