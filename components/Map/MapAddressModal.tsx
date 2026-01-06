import React, {
    useEffect,
    useRef,
    SetStateAction,
    Dispatch,
} from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Keyboard,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';

// --- Type Definitions ---

interface MapAddressModalProps {
    visible: boolean;
    addressInput: string;
    setAddressInput: Dispatch<SetStateAction<string>>; // Setter function from useState<string>
    handleSaveAddress: () => void;
    handleCloseModal: () => void;
}

// ---

const MapAddressModal: React.FC<MapAddressModalProps> = ({
                                                             visible,
                                                             addressInput,
                                                             setAddressInput,
                                                             handleSaveAddress,
                                                             handleCloseModal
                                                         }) => {
    // useRef must be explicitly typed as Animated.Value<number>
    const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [visible, fadeAnim]); // Added fadeAnim to dependency array

    // Early exit if not visible, optimizing render performance
    if (!visible) return null;

    return (
        // Dismiss the keyboard when tapping anywhere outside the modal content
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.overlay as StyleProp<ViewStyle>}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        // The opacity style is handled by the Animated value
                        {opacity: fadeAnim}
                    ]}
                >
                    <Text style={styles.modalTitle as StyleProp<TextStyle>}>Add Address</Text>
                    <TextInput
                        style={styles.input as StyleProp<TextStyle>}
                        placeholder="Enter address"
                        value={addressInput}
                        onChangeText={setAddressInput}
                    />
                    <Button title="Save Address" onPress={handleSaveAddress}/>
                    {/* Add margin to separate buttons for better UI */}
                    {/* eslint-disable-next-line react-native/no-inline-styles */}
                    <View style={{marginTop: 10}}>
                        <Button title="Cancel" onPress={handleCloseModal}/>
                    </View>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default MapAddressModal;

// 3. Define styles with explicit types
const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    } as ViewStyle,
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    } as ViewStyle,
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    } as TextStyle,
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    } as TextStyle,
});
