import { StyleSheet, Text, View } from "react-native";
import React from "react";

export const LoginContext = React.createContext({
  loggedIn: false,
  setloggedIn: () => {},
});
