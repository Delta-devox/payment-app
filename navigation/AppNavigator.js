import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import AmountScreen from "../screens/AmountScreen";
import AuthScreen from "../screens/AuthScreen";
import SuccessScreen from "../screens/SuccessScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Amount" component={AmountScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
