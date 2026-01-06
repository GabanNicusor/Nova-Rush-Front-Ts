import React, { useState } from 'react';
import { useAppDispatch } from '../state/store';
import { Button, StyleSheet, Text, TextInput, View, Alert, ViewStyle, TextStyle } from 'react-native';

// External
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Service
import sendUserCredentialsToAuthenticate from "../service/Auth/sendUserCredentialsToAuthenticate";
import getUserId from "../service/User/Get/getUserId";
import getUserAddressList from "../service/RouteAddressList/Get/getUserAddressList";
import getAddressStartId from "../service/Address/Get/getAddressStartId";

// Redux
import {setCodeExpirationTimestamp, setRouteList, setAddressListId} from "../state/navSlice";
import getUserEmailTimeStamp from "../service/User/Get/getUserEmailTimeStamp";
import fetchAddressesForSelectedList from "../service/Address/Fetch/fetchAddressesForSelectedList";

// --- Interfaces ---

// Define your app's navigation structure
type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  EmailVerificationScreen: { email: string };
  StartAddressScreen: undefined;
  MainApp: undefined;
};

// --- Component ---

const LoginScreen: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await sendUserCredentialsToAuthenticate(emailOrUsername, password);
      // Check if token is valid (Assuming response.token is a string)
      if ('token' in response && response.token && response.token !== 'false' && response.token.length > 0) {
        const user_id = await getUserId();

        if (user_id) {
          const routeList = await getUserAddressList(user_id);
          dispatch(setRouteList(routeList));
          dispatch(setAddressListId(routeList[0].id));

          try {
            const startAddressId = await getAddressStartId(user_id);

            // Navigate based on whether the user has set a starting location
            // @ts-ignore
            if (startAddressId === false) {
              navigation.navigate("StartAddressScreen");
            } else {
              navigation.navigate("MainApp");
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
      // TypeScript now knows this requires an object with an 'email' string
      navigation.navigate("EmailVerificationScreen", { email });
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

      <Button title="Login" onPress={handleLogin} />

      <View style={styles.divider} />

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
  divider: {
    height: 20,
  } as ViewStyle,
  footer: {
    marginTop: 10,
  } as ViewStyle,
});

export default LoginScreen;
