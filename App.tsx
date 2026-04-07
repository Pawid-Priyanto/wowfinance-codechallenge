import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; 
import { Buffer } from "buffer";

import LoginScreen from "./screens/Login"
import HomeScreen from "./screens/Home"
import DetailScreen from "./screens/Detail"
import SplashScreen from "./screens/Splash"

const Stack = createNativeStackNavigator();

const App = () => {

const validateToken = async (navigationRef: any) => {
  const token = await AsyncStorage.getItem('@user_token');
  if (!token) return;

  try {
    const parts = token.split('.');
    if (parts.length < 2) return;

   
    const decodedPayload = Buffer.from(parts[1], 'base64').toString('utf8');
    const payload = JSON.parse(decodedPayload);
    
    const now = Math.floor(Date.now() / 1000);
    const sisaWaktu = payload.exp - now;
    console.log("Sisa waktu:", sisaWaktu);

    if (now > payload.exp) {
      const currentRoute = navigationRef?.getCurrentRoute();
      if (currentRoute?.name === 'Login' || currentRoute?.name === 'Splash') return;

      await AsyncStorage.multiRemove(['@user_token', '@user_email']);

      Alert.alert(
        "Sesi Berakhir", 
        "Sesi Anda telah habis, silakan login kembali.",
        [{ 
          text: "OK", 
          onPress: () => {
           
            navigationRef?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } 
        }],
        { cancelable: false }
      );
    }
  } catch (e) {
    console.log("Gagal validasi token:", e);
  }
};

  let navRef: any = null;

  return (
    <ThemeProvider>
      <NavigationContainer 
        ref={(ref: any) => (navRef = ref)}
        onStateChange={() => {
          if (navRef) validateToken(navRef);
        }}
      >
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'Pokemon Explorer',
              headerBackVisible: false,
              headerTitleAlign: 'center'
            }} 
          />
          <Stack.Screen 
            name="Detail" 
            component={DetailScreen} 
            options={{ title: 'Pokemon Detail' }} 
          />
        </Stack.Navigator> 
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;