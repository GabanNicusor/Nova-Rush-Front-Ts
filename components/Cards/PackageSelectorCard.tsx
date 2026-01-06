import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Fontisto } from '@react-native-vector-icons/fontisto';

// --- Type Definitions ---

// Define the structure of the item prop
interface PackageItem {
  packages: number; // The initial number of packages
  [key: string]: any; // Allow other properties
}

// Define the component's props
interface PackageSelectorCardProps {
  item: PackageItem;
  setSelectedPackage: (count: number) => void;
}

// ---

const PackageSelectorCard: React.FC<PackageSelectorCardProps> = ({
  item,
  setSelectedPackage,
}) => {
  // Create an array of numbers from 1 to 300
  const packageNumbers: number[] = Array.from({ length: 300 }, (_, i) => i + 1);

  // State is typed as number
  const [packages, setPackages] = useState<number>(item.packages);

  const handleChange = (value: number | unknown) => {
    // Cast the value from Picker to number
    const newPackageCount = value as number;

    setPackages(newPackageCount);
    setSelectedPackage(newPackageCount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Packages</Text>
      {/* The icon is positioned absolutely/relative to the parent container */}
      <Fontisto name="shopping-package" size={24} color="#007AFF" style={styles.icon} />

      <View style={styles.textContainer}>
        <Picker
          selectedValue={packages}
          onValueChange={value => handleChange(value)}
          style={styles.pickerTextStyle}
          itemStyle={styles.pickerItem}
          dropdownIconColor="#007AFF"
        >
          {packageNumbers.map(num => (
            <Picker.Item key={num} label={`${num}`} value={num} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default PackageSelectorCard;

// 3. Define styles with explicit types
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 12,
  },
  icon: {
    marginRight: 16,
    left: 100,
  }, // Icons often use TextStyle for style props in RN
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  pickerTextStyle: {
    justifyContent: 'center',
    height: 40,
    width: 110,
    overflow: 'hidden',
  },
  pickerItem: {
    fontSize: 16,
  },
});
