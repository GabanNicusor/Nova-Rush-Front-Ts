import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import NavigationIcon from '../SvgImages/NavigationIcon';

// --- Type Definitions ---

interface NavigationCardProps {
  onPress: () => void; // A function that is called when the card/icon is pressed
}

// ---
const NavigationCard: React.FC<NavigationCardProps> = ({ onPress }) => {
  return (
    <View style={styles.card as StyleProp<ViewStyle>}>
      {/* NavigationIcon is assumed to be an SVG component that accepts the onPress handler */}
      <NavigationIcon onPress={onPress} />
      <Text style={{ textAlign: 'center' } as StyleProp<TextStyle>}>
        Navigate
      </Text>
    </View>
  );
};
export default NavigationCard;

// 3. Define styles with explicit types
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: 130,
    height: 90,
  } as ViewStyle,
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  } as TextStyle,
  cardInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    color: '#333',
  } as TextStyle,
  // Note: cardTitle and cardInput styles are defined but not used in the component's render function.
});
