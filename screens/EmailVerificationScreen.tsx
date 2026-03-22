import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp, useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {useAppDispatch, useAppSelector} from "@/state/store";
import {clearCodeExpiration, selectCodeExpirationTimestamp, setCodeExpirationTimestamp} from "@/state/navSlice"; // Updated imports
import sendNewCodeRequest from "../service/Auth/sendNewCodeRequest";
import sendCodeVerification from "../service/Auth/sendCodeVerification";
import getUserEmailTimeStamp from "../service/User/Get/getUserEmailTimeStamp";

interface IStyles {
    container: ViewStyle;
    header: TextStyle;
    subtitle: TextStyle;
    input: TextStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    timer: TextStyle;
}

type RootStackParamList = {
    LoginScreen: undefined;
    EmailVerificationScreen: { email: string };
};

type EmailVerificationScreenRouteProp = RouteProp<RootStackParamList, 'EmailVerificationScreen'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'EmailVerificationScreen'>;

interface EmailVerificationProps {
    route: EmailVerificationScreenRouteProp;
}

/** @route is just and way to send email as object using Stack */
export default function EmailVerificationScreen({route}: EmailVerificationProps) {
    const {email} = route.params;

    const [code, setCode] = useState<string>('');
    const [requestSend, setRequestSend] = useState<boolean>(false);

    const expirationTimestamp = useAppSelector(selectCodeExpirationTimestamp);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp>();

    const getRemainingSeconds = useCallback((): number => {
        if (!expirationTimestamp) return 0;
        const diff = new Date(expirationTimestamp).getTime() - Date.now();
        return Math.max(0, Math.floor(diff / 1000));
    }, [expirationTimestamp]);

    const [remainingSeconds, setRemainingSeconds] = useState<number>(getRemainingSeconds());

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleVerification = async (): Promise<void> => {
        try {
            const response = await sendCodeVerification(code.trim(), email);
            if (response !== undefined && response.status === 200) {
                dispatch(clearCodeExpiration());
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('❎ Invalid Code ❎', 'The code is incorrect or has expired. Please request a new code.');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Alert.alert('❎ Invalid Code ❎', 'The code is incorrect or has expired. Please request a new code.');
        }
    };

    const requestNewCode = async (): Promise<void> => {
        if (remainingSeconds > 0) {
            Alert.alert('Please wait', `You can request a new code in ${formatTime(remainingSeconds)}`);
            return;
        }
        setRequestSend(true);

        try {
            const response = await sendNewCodeRequest(email);

            if (response !== undefined && response.ok || response !== undefined && response.status === 200) {
                const timeStamp = await getUserEmailTimeStamp(email);

                if (timeStamp) {
                    dispatch(setCodeExpirationTimestamp(timeStamp)); // Store new server timestamp
                } else {
                    dispatch(setCodeExpirationTimestamp(Math.floor(Date.now() / 1000) + 900));
                }

                Alert.alert('✅ Success', 'A new verification code has been sent!');
                setRequestSend(false);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
        }
    };

    const canRequestNewCode = remainingSeconds === 0;

    useEffect(() => {
        const initial = getRemainingSeconds();
        setRemainingSeconds(initial);

        if (initial <= 0) return;

        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [expirationTimestamp, getRemainingSeconds]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Enter Verification Code</Text>

            <Text style={styles.subtitle}>We sent a code to {email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                maxLength={6}
                autoFocus
            />

            <TouchableOpacity style={styles.button} onPress={handleVerification}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, {marginTop: 20, opacity: canRequestNewCode ? 1 : 0.6, marginBottom: 20}]}
                onPress={requestNewCode}
                disabled={!canRequestNewCode}
            >
                <Text style={styles.buttonText}>
                    {requestSend ? (
                        'Loading ...'
                    ) : canRequestNewCode ? (
                        'Request New Code'
                    ) : (
                        <Text style={{color: '#FF4444', fontWeight: '600'}}>
                            Expires in {formatTime(remainingSeconds)}
                        </Text>
                    )}
                </Text>
            </TouchableOpacity>
            <Button
                title="⬅️ Login"
                onPress={() => navigation.navigate("LoginScreen")}
            />
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,

        backgroundColor: '#f5f5f5',
    },

    header: {
        marginBottom: 8,
        textAlign: 'center',

        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A1C1E',
    },

    subtitle: {
        marginBottom: 30,
        textAlign: 'center',

        fontSize: 16,
        color: '#666',
    },

    input: {
        width: '100%',
        height: 56,
        paddingHorizontal: 16,
        marginBottom: 24,
        textAlign: 'center',

        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 18,
        letterSpacing: 4,
    },

    button: {
        width: '100%',
        padding: 16,
        alignItems: 'center',

        backgroundColor: '#007BFF',
        borderRadius: 8,

        elevation: 2,
    },

    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },

    timer: {
        marginTop: 20,

        fontSize: 16,
        fontWeight: '500',
        color: '#d4380d',
    },
});
