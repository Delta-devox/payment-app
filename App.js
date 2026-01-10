import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TransactionProvider } from "./context/TransactionContext";
import { MoneyProvider } from "./context/MoneyContext";
import AppNavigator from "./navigation/AppNavigator";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";

export default function App() {
  return (
    <MoneyProvider>
      <TransactionProvider>
        <NotificationProvider>
        <NavigationContainer>
          <AppNavigator />
          <Notification />
        </NavigationContainer>
        </NotificationProvider>
      </TransactionProvider>
    </MoneyProvider>
  );
}
