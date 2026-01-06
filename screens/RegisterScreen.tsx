import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    ViewStyle,
    TextStyle,
} from 'react-native';

import {useNavigation, NavigationProp} from '@react-navigation/native';

import {setCodeExpirationTimestamp} from "../state/navSlice"
import {useAppDispatch} from '../state/store';

// Service
import sendUserCredentialsToRegister from '../service/Auth/sendUserCredentialsToRegister';
import getUserEmailTimeStamp from "../service/User/Get/getUserEmailTimeStamp";

// --- Interfaces & Types ---

type RootStackParamList = {
    LoginScreen: undefined;
    EmailVerificationScreen: { email: string };
    RegisterScreen: undefined;
};

// --- Component ---

const RegisterScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const dispatch = useAppDispatch();

    const handleRegister = async (): Promise<void> => {
        try {
            // Service call to register user
            const response = await sendUserCredentialsToRegister(
                username,
                email,
                password,
            );

            if (response) {
                const code = await getUserEmailTimeStamp(email);
                dispatch(setCodeExpirationTimestamp(code ?? -1))
                // Navigate to verification and pass the email parameter
                navigation.navigate('EmailVerificationScreen', {email});
            } else {
                Alert.alert(
                    'Registration Failed',
                    'A user with the same email or username already exists!',
                );
            }
        } catch (error) {
            console.error('Registration Error:', error);
            Alert.alert(
                'Connection Error',
                'Something went wrong. Please try again later.',
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <View style={styles.buttonContainer}>
                <Button title="Register" onPress={handleRegister}/>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="⬅️ Login"
                    onPress={() => navigation.navigate('LoginScreen')}
                    color="#6c757d"
                />
            </View>
        </View>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f2f2f2',
    } as ViewStyle,
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
    } as TextStyle,
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    } as TextStyle,
    buttonContainer: {
        width: '100%',
        marginTop: 10,
    } as ViewStyle,
});

export default RegisterScreen;
