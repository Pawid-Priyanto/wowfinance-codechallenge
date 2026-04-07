import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from "./screens/Login"
import HomeScreen from "./screens/Home"
import DetailScreen from "./screens/Detail"

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      {/* Halaman Home: Kita matikan tombol 'Back' bawaan supaya user nggak bisa balik ke Login pakai gesture */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Pokemon Explorer',
            headerBackVisible: false,
            headerTitleAlign: 'center'
          }} 
        />
        
        {/* Halaman Detail */}
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Pokemon Detail' }} 
        />
    </Stack.Navigator> 
  </NavigationContainer>

)

export default App;