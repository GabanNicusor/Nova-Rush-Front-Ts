import React, {useState, useMemo, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextStyle,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ExpressType} from '../../types/enums/ExpressType';

type ExpressTimeValue = 1 | 8 | 9 | 10 | 12;

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
// ... (imports and types remain the same)

const ExpressTimeCard: React.FC<ExpressTimeCardProps> = ({
                                                             item,
                                                             setSelectedExpress,
                                                         }) => {
    // Position 0 in this array is "--:--"
    const times: ExpressTimeValue[] = [1, 8, 9, 10, 12];

    const initialTime: ExpressTimeValue = useMemo(() => {
        // 1. Get the raw value from the item
        const type = item.expressType;
        // 2. Direct mapping: If it exists in our map (including STANDARD), return it
        if (type !== undefined && type in typeToTimeMap) {
            return typeToTimeMap[type] as ExpressTimeValue;
        }
        // 3. Fallback specifically to 0 (STANDARD) if data is missing or invalid
        return 1;
    }, [item.expressType]);

    const [selected, setSelected] = useState<ExpressTimeValue>(initialTime);

    // This ensures that when the data changes (or the Pager swipes),
    // the picker moves to the correct position.
    useEffect(() => {
        setSelected(initialTime);
    }, [initialTime]);

    const handleChange = (itemValue: ExpressTimeValue | unknown) => {
        const newTime = itemValue as ExpressTimeValue;
        setSelected(newTime);
        setSelectedExpress(newTime);
    };

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
                                value={time} // Must be 0 for STANDARD to match 'selected'
                            />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        height: 80,
        alignItems: 'center',
        flexDirection: 'row',
    },
    label: {
        fontSize: 22,
        marginRight: 16,
        fontWeight: '600',
    },
    pickerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerClipper: {
        height: 40,
        overflow: 'hidden',
        justifyContent: 'center',
    } ,
    picker: {
        height: 120,
        width: 200,
        justifyContent: 'center',
    },
    item: {
        fontSize: 30,
    },
});

export default ExpressTimeCard;
