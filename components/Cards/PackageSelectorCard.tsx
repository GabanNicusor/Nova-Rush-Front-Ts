import React, {useState} from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle,} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Fontisto} from '@react-native-vector-icons/fontisto';


interface IStyles {
    container: ViewStyle;
    icon: TextStyle;
    textContainer: ViewStyle;
    label: TextStyle;
    pickerTextStyle: TextStyle;
    pickerItem: TextStyle;
}

interface PackageItem {
    packages: number;

    [key: string]: any;
}

interface PackageSelectorCardProps {
    item: PackageItem;
    setSelectedPackage: (count: number) => void;
}

export default function PackageSelectorCard({
                                                item,
                                                setSelectedPackage,
                                            }: PackageSelectorCardProps) {
    const packageNumbers: number[] = Array.from({length: 300}, (_, i) => i + 1);

    const [packages, setPackages] = useState<number>(item.packages);

    const handleChange = (value: number | unknown) => {
        const newPackageCount = value as number;
        setPackages(newPackageCount);
        setSelectedPackage(newPackageCount);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Packages</Text>
            <Fontisto name="shopping-package" size={24} color="#007AFF" style={styles.icon}/>

            <View style={styles.textContainer}>
                <Picker
                    selectedValue={packages}
                    onValueChange={value => handleChange(value)}
                    style={styles.pickerTextStyle}
                    itemStyle={styles.pickerItem}
                    dropdownIconColor="#007AFF"
                >
                    {packageNumbers.map(num => (
                        <Picker.Item key={num} label={`${num}`} value={num}/>
                    ))}
                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        //DIMENSION & BOX MODEL
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        marginVertical: 12,

        //COLOR & BORDER & DESIGN
        backgroundColor: '#fff',
        borderRadius: 16,

        //SHADOW PROPS
        // iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Android
        elevation: 3,
    },

    icon: {
        //DIMENSION & BOX MODEL
        marginRight: 16,
        left: 100,
    },

    textContainer: {
        //DIMENSION & BOX MODEL
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    label: {
        //DIMENSION & BOX MODEL
        marginBottom: 4,

        //COLOR & BORDER & DESIGN
        fontSize: 16,
        fontWeight: '600',
    },

    pickerTextStyle: {
        //DIMENSION & BOX MODEL
        height: 40,
        width: 110,
        justifyContent: 'center',

        //COLOR & BORDER & DESIGN
        overflow: 'hidden',
    },

    pickerItem: {
        //COLOR & BORDER & DESIGN
        fontSize: 16,
    },
});
