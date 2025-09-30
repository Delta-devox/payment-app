import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TransactionProvider } from "./context/TransactionContext";

import AppNavigator from "./navigation/AppNavigator";



export default function App() {
  return (
    <TransactionProvider>
    <NavigationContainer>
   <AppNavigator />
    </NavigationContainer>
    </TransactionProvider>
  );
}
