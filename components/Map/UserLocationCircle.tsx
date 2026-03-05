import React from 'react';
import {LatLng, Marker} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';

interface Coordinate extends LatLng {
    latitude: number;
    longitude: number;
}

interface UserLocationCircleProps {
    userLocation: Coordinate;
}

export default function UserLocationCircle({userLocation}: UserLocationCircleProps) {
    return (
        <Marker
            coordinate={userLocation}
            anchor={{x: 0.5, y: 0.5}}
            flat={true}
            tracksViewChanges={false}
        >
            <View style={styles.outerCircle}>
                <View style={styles.innerCircle}/>
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    outerCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,

        borderRadius: 12,
        backgroundColor: 'rgba(67, 97, 238, 0.3)',
    },
    innerCircle: {
        width: 14,
        height: 14,

        borderRadius: 7,
        backgroundColor: '#4361EE',
        borderWidth: 2,
        borderColor: 'white',

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
});
