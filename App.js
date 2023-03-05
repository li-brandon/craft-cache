import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "./Contexts/MyContext";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import FrontPageScreen from "./Screens/FrontPageScreen";
import ExplorePageScreen from "./Screens/ExplorePageScreen";
import AddProjectScreen from "./Screens/AddProjectScreen";
import ManageExpensesScreen from "./Screens/ManageExpensesScreen";
import InventoryPageScreen from "./Screens/InventoryPageScreen";
import ItemDetailScreen from "./Screens/ItemDetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { GlobalStyles } from "./Constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { store } from "./Data/store";
import { Provider } from "react-redux";
import { LoginContext } from "./Contexts/LoginContext";
import IconButton from "./Components/UI/IconButton";
// import ExpensesContextProvider from "./Data/expenses-context";
import { getAuth } from "firebase/auth";
import ProjectsPageScreen from "./Screens/ProjectsPageScreen";
import LoginScreen from "./Screens/LoginScreen";
import UserProfileScreen from "./Screens/UserProfileScreen";
import EditProfileScreen from "./Screens/EditProfileScreen";
import ResetPasswordScreen from "./Screens/ResetPasswordScreen";
const auth = getAuth();
import RegisterScreen from "./Screens/RegisterScreen";
import InventoryDetailScreen from "./Screens/InventoryDetailScreen";
import AddInventoryScreen from "./Screens/AddInventoryScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ToManage(navigation) {
  return navigation.navigate("Login");
}

function ToProfile(navigation) {
  return navigation.navigate("User Profile");
}
// const rightIcon = loggedIn ? "log-out-outline" : "log-in-outline";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const getAuthState = function () {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  };
  getAuthState();
  // console.log(isloggedIn)
  const { loggedIn, setloggedIn } = useContext(LoginContext);
  const FrontPage = function () {
    return (
      <Tab.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: GlobalStyles.colors.primary50 },
          headerTintColor: GlobalStyles.colors.gray700,
          tabBarStyle: { backgroundColor: GlobalStyles.colors.primary50 },
          tabBarActiveTintColor: GlobalStyles.colors.gray700,
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="log-in-outline"
              color={tintColor}
              size={24}
              onPress={ToManage.bind(this, navigation)}
            />
          ),
          headerLeft: ({ tintColor }) => (
            <IconButton
              icon="person-circle-outline"
              color={tintColor}
              size={24}
              onPress={isloggedIn ? ToProfile.bind(this, navigation) : ToManage.bind(this, navigation)}
            />
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={FrontPageScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Add Project"
          component={AddProjectScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Projects"
          component={ProjectsPageScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="folder-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryPageScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={isloggedIn ? UserProfileScreen : LoginScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };
  return (
    <Provider store={store}>
      <MyContext.Provider
        value={{ projects, setProjects, inventory, setInventory }}
      >
        <LoginContext.Provider
          value={{ loggedIn: isloggedIn, setloggedIn: setIsLoggedIn }}
        >
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: GlobalStyles.colors.primary500,
                },
                headerTintColor: "white",
                tabBarStyle: {
                  backgroundColor: GlobalStyles.colors.primary500,
                },
                tabBarActiveTintColor: GlobalStyles.colors.accent500,
              }}
            >
              <Stack.Screen
                name="Front Page"
                component={FrontPage}
                options={{
                  headerShown: false,
                  headerBackVisible: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Detail" component={ItemDetailScreen} />
              <Stack.Screen
                name="Inventory Detail"
                component={InventoryDetailScreen}
              />
              <Stack.Screen name="User Profile" component={UserProfileScreen} />
              <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
              <Stack.Screen
                name="Add Inventory"
                component={AddInventoryScreen}
              />
              <Stack.Screen
                name="Reset Password"
                component={ResetPasswordScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </LoginContext.Provider>
      </MyContext.Provider>
    </Provider>
    // {/* </ExpensesContextProvider> */ }
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
