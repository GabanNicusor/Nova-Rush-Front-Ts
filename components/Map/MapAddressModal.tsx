import React, {Dispatch, SetStateAction, useEffect, useRef,} from 'react';
import {
    Animated,
    Button,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';

interface IStyles {
    overlay: ViewStyle;
    modalContent: ViewStyle;
    modalTitle: TextStyle;
    input: TextStyle;
}

interface MapAddressModalProps {
    visible: boolean;
    addressInput: string;
    setAddressInput: Dispatch<SetStateAction<string>>;
    handleSaveAddress: () => void;
    handleCloseModal: () => void;
}

export default function MapAddressModal({
                                            visible,
                                            addressInput,
                                            setAddressInput,
                                            handleSaveAddress,
                                            handleCloseModal
                                        }: MapAddressModalProps) {
    const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [visible, fadeAnim]);

    if (!visible) return null;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {opacity: fadeAnim}
                    ]}
                >
                    <Text style={styles.modalTitle}>Add Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter address"
                        value={addressInput}
                        onChangeText={setAddressInput}
                    />
                    <Button title="Save Address" onPress={handleSaveAddress}/>
                    <View style={{marginTop: 10}}>
                        <Button title="Cancel" onPress={handleCloseModal}/>
                    </View>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create<IStyles>({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    modalContent: {
        width: "80%",
        padding: 20,
        alignItems: "center",

        backgroundColor: "white",
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,

        elevation: 5,
    },

    modalTitle: {
        marginBottom: 10,

        fontSize: 18,
        fontWeight: "bold",
    },

    input: {
        width: "100%",
        height: 40,
        paddingLeft: 10,
        marginBottom: 10,

        borderColor: "gray",
        borderWidth: 1,
        fontSize: 16,
    },
});
