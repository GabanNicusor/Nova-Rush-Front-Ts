import React, {useState, useEffect} from 'react';
import {Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useNavigation, RouteProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {useAppDispatch, useAppSelector} from "../state/store";
import {selectCodeExpirationTimestamp, setCodeExpirationTimestamp, clearCodeExpiration} from "../state/navSlice"; // Updated imports

import sendNewCodeRequest from "../service/Auth/sendNewCodeRequest";
import sendCodeVerification from "../service/Auth/sendCodeVerification";
import getUserEmailTimeStamp from "../service/User/Get/getUserEmailTimeStamp";

// --- Types ---
type RootStackParamList = {
    LoginScreen: undefined;
    EmailVerificationScreen: { email: string };
};

type EmailVerificationScreenRouteProp = RouteProp<RootStackParamList, 'EmailVerificationScreen'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'EmailVerificationScreen'>;

interface EmailVerificationProps {
    route: EmailVerificationScreenRouteProp;
}

// --- Component ---
const EmailVerificationScreen: React.FC<EmailVerificationProps> = ({route}) => {
    const {email} = route.params;

    const [code, setCode] = useState<string>('');
    const expirationTimestamp = useAppSelector(selectCodeExpirationTimestamp);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp>();

    // Calculate remaining seconds from server timestamp
    const getRemainingSeconds = (): number => {
        if (!expirationTimestamp) return 0;

        const expirationDate = new Date(expirationTimestamp); // Parses ISO string perfectly
        const now = new Date();
        const diffMs = expirationDate.getTime() - now.getTime();
        return Math.max(0, Math.floor(diffMs / 1000));
    };

    const [remainingSeconds, setRemainingSeconds] = useState<number>(getRemainingSeconds());

    // Update countdown every second
    useEffect(() => {
        setRemainingSeconds(getRemainingSeconds());

        if (remainingSeconds <= 0) return;

        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                const next = prev - 1;
                return next <= 0 ? 0 : next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [expirationTimestamp]); // Re-run only when expiration timestamp changes

    // Format MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleVerification = async (): Promise<void> => {
        try {
            const response = await sendCodeVerification(code.trim(), email);
            if (response != undefined && response.status === 200) {
                dispatch(clearCodeExpiration()); // Clean up on success
                navigation.navigate('LoginScreen');
            }
        } catch (error) {
            Alert.alert('❎ Invalid Code ❎', 'The code is incorrect or has expired. Please try again.');
        }
    };

    const requestNewCode = async (): Promise<void> => {
        if (remainingSeconds > 0) {
            Alert.alert('Please wait', `You can request a new code in ${formatTime(remainingSeconds)}`);
            return;
        }

        try {
            const response = await sendNewCodeRequest(email);

            if (response != undefined && response.ok || response != undefined && response.status === 200 ) {
                const timeStamp = await getUserEmailTimeStamp(email);

                if (timeStamp) {
                    dispatch(setCodeExpirationTimestamp(timeStamp)); // Store new server timestamp
                } else {
                    // Fallback: assume 15 minutes from now if server doesn't provide it
                    dispatch(setCodeExpirationTimestamp(Math.floor(Date.now() / 1000) + 900));
                }

                Alert.alert('✅ Success', 'A new verification code has been sent!');
            }
        } catch (error) {
        }
    };

    const canRequestNewCode = remainingSeconds === 0;

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
                    {canRequestNewCode ? (
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

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 56,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#fff',
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 4,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    timer: {
        marginTop: 20,
        color: '#d4380d',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default EmailVerificationScreen;
