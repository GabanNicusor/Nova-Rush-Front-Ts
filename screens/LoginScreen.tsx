import React, {useState} from 'react';
import {useAppDispatch} from '@/state/store';
import {Alert, Button, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle} from 'react-native';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import sendUserCredentialsToAuthenticate from "../service/Auth/sendUserCredentialsToAuthenticate";
import getUserId from "../service/User/Get/getUserId";
import getUserAddressList from "../service/RouteAddressList/Get/getUserAddressList";
import getUserAddressStart from "../service/Address/Get/getUserAddressStart";

import {setAddressListId, setCodeExpirationTimestamp, setRouteList, setUserStartAddress} from "@/state/navSlice";
import getUserEmailTimeStamp from "../service/User/Get/getUserEmailTimeStamp";

interface IStyles {
    container: ViewStyle;
    title: TextStyle;
    input: TextStyle;
    divider: ViewStyle;
    footer: ViewStyle;
}

type RootStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    EmailVerificationScreen: { email: string };
    StartAddressScreen: undefined;
    MainApp: undefined;
};

export default function LoginScreen() {
    const [emailOrUsername, setEmailOrUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();

    const handleLogin = async (): Promise<void> => {
        try {
            const response = await sendUserCredentialsToAuthenticate(emailOrUsername, password);
            if ('token' in response && response.token && response.token !== 'false' && response.token.length > 0) {
                const user_id = await getUserId();

                if (user_id) {
                    const routeList = await getUserAddressList(user_id);
                    dispatch(setRouteList(routeList));
                    dispatch(setAddressListId(routeList[0].id));

                    try {
                        const startAddress = await getUserAddressStart(user_id);

                        if (startAddress) {
                            dispatch(setUserStartAddress(startAddress));
                            navigation.navigate("MainApp");
                        } else {
                            navigation.navigate("StartAddressScreen");
                        }
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (error) {
                        Alert.alert("Error", "Something went wrong while checking start address.");
                    }
                }
            } else {
                Alert.alert('Authentication Failed', 'Account not found or not activated.');
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert('Invalid credentials', 'Please check your username and password.');
        }
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailVerification = async (): Promise<void> => {
        if (isValidEmail(email)) {
            const code = await getUserEmailTimeStamp(email);
            dispatch(setCodeExpirationTimestamp(code ?? -1))
            navigation.navigate("EmailVerificationScreen", {email});
        } else {
            Alert.alert('❎ Invalid Email 📧', 'Please check your email address');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Email or Username"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin}/>

            <View style={styles.divider}/>

            <TextInput
                style={styles.input}
                placeholder="Verify Email if not activated"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Button
                title="Go to Email Verification"
                onPress={handleEmailVerification}
            />

            <View style={styles.footer}>
                <Button
                    title="Go to Register"
                    onPress={() => navigation.navigate("RegisterScreen")}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,

        backgroundColor: '#f2f2f2',
    },

    title: {
        marginBottom: 24,

        fontSize: 24,
        fontWeight: 'bold',
    },

    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,

        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },

    divider: {
        height: 20,
    },

    footer: {
        marginTop: 10,
    },
});
