import React from 'react';
import {ImageSourcePropType, StyleSheet, Text, TextStyle, View, ViewStyle,} from 'react-native';
import Svg, {Image} from 'react-native-svg';

interface IStyles {
    container: ViewStyle;
    modalContent: ViewStyle;
    modalTitle: TextStyle;
}

interface StaticSvgImageProps {
    instruction: string;
    distance: string | number;
    imageSource: ImageSourcePropType;
}

export default function StaticSvgImage({
                                           instruction,
                                           distance,
                                           imageSource,
                                       }: StaticSvgImageProps) {
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


const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 70,
        left: 100,
    },

    modalContent: {
        width: 200,
        height: 200,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'white',
        borderRadius: 10,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.65,
        shadowRadius: 4,

        elevation: 5,
    },

    modalTitle: {
        marginTop: 10,

        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
