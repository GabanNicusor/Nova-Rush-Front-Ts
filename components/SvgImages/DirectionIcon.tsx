import React from 'react';
import { StyleSheet, View, ViewStyle, ImageSourcePropType } from 'react-native';
import StaticSvgImage from './StaticSvgImage';

// --- Types ---

// Define possible maneuver types based on your map navigation data (e.g., Mapbox/OSRM)
type ManeuverType =
  | 'turn'
  | 'slight'
  | 'sharp'
  | 'continue'
  | 'depart'
  | 'merge'
  | 'roundabout'
  | 'fork'
  | 'ramp'
  | 'off ramp'
  | 'arrive';

type Modifier =
  | 'left'
  | 'right'
  | 'straight'
  | 'slight left'
  | 'slight right'
  | '';

interface DirectionIconProps {
  maneuverType: ManeuverType | string;
  modifier: Modifier | string;
  fullInstruction: string;
  distance: string | number;
}

// --- Component ---

const DirectionIcon: React.FC<DirectionIconProps> = ({
  maneuverType,
  modifier,
  fullInstruction,
  distance,
}) => {
  // Mapping keys to image assets instead of full components for better performance
  const assetMap: Record<string, ImageSourcePropType> = {
    'turn-left': require('../../assets/images/turn-left.png'),
    'turn-right': require('../../assets/images/turn-right.png'),
    'slight-left': require('../../assets/images/slight-left.png'),
    'slight-right': require('../../assets/images/slight-right.png'),
    'sharp-left': require('../../assets/images/turn-left.png'),
    'sharp-right': require('../../assets/images/turn-right.png'),
    'continue-straight': require('../../assets/images/up-arrow.png'),
    'depart-straight': require('../../assets/images/up-arrow.png'),
    'merge-left': require('../../assets/images/turn-left.png'),
    'merge-right': require('../../assets/images/turn-right.png'),
    'roundabout-': require('../../assets/images/roundabout.png'),
    'fork-left': require('../../assets/images/slight-left.png'),
    'fork-right': require('../../assets/images/slight-right.png'),
    'ramp-left': require('../../assets/images/ramp-exit-left.png'),
    'ramp-right': require('../../assets/images/ramp-exit-right.png'),
    'off ramp-slight left': require('../../assets/images/ramp-exit-left.png'),
    'off ramp-slight right': require('../../assets/images/ramp-exit-right.png'),
    'arrive-': require('../../assets/images/end.png'),
  };

  // Construct the lookup key
  const key = `${maneuverType}-${modifier || ''}`.trim();

  // Fallback to a default arrow if the specific maneuver isn't found
  const imageSource =
    assetMap[key] || require('../../assets/images/up-arrow.png');

  return (
    <View style={styles.overlay}>
      <StaticSvgImage
        instruction={fullInstruction}
        distance={distance}
        imageSource={imageSource}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
  } as ViewStyle,
});

export default DirectionIcon;
