import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Image } from 'react-native-svg';

// --- Interfaces ---

interface StaticSvgImageProps {
  /** The text instruction for the maneuver (e.g., "Turn left") */
  instruction: string;
  /** The distance to the maneuver, usually in meters */
  distance: string | number;
  /** The required image asset (from require("../../...")) */
  imageSource: ImageSourcePropType;
}

// --- Component ---

const StaticSvgImage: React.FC<StaticSvgImageProps> = ({
  instruction,
  distance,
  imageSource,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        <Svg width={90} height={90}>
          <Image
            href={imageSource}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </Svg>
        <Text style={styles.modalTitle} numberOfLines={2}>
          {`${instruction} In ${distance}m`}
        </Text>
      </View>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // Keeping your original positioning
    left: 100,
    paddingTop: 70,
  } as ViewStyle,
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.65,
    shadowRadius: 4,
    width: 200,
    height: 200,
    justifyContent: 'center',
  } as ViewStyle,
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  } as TextStyle,
});

export default StaticSvgImage;
