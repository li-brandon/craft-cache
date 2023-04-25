import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "./Contexts/MyContext";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import FrontPageScreen from "./Screens/FrontPageScreen";
import HomePageScreen from "./Screens/HomePageScreen";
import ExplorePageScreen from "./Screens/ExplorePageScreen";
import AddProjectScreen from "./Screens/AddProjectScreen";
import ManageExpensesScreen from "./Screens/ManageExpensesScreen";
import InventoryPageScreen from "./Screens/InventoryPageScreen";
import ItemDetailScreen from "./Screens/ItemDetailScreen";
import SavedProjectsScreen from "./Screens/SavedProjectsScreen";
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
import ProfileScreen from "./Screens/ProfileScreen";
import CommentsScreen from "./Screens/CommentsScreen";
import ResetPasswordScreen from "./Screens/ResetPasswordScreen";
const auth = getAuth();
import RegisterScreen from "./Screens/RegisterScreen";
import InventoryDetailScreen from "./Screens/InventoryDetailScreen";
import AddInventoryScreen from "./Screens/AddInventoryScreen";
import ChatListItem from "./Components/ChatListPage";
import ChatListScreen from "./Screens/ChatListScreen";
import ChatScreen from "./Screens/ChatDetailScreen";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ToManage(navigation) {
  return navigation.navigate("Login");
}

function ToProfile(navigation) {
  return navigation.navigate("User Profile");
}

const FrontPage = function () {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#FEB85B" },
        headerTintColor: GlobalStyles.colors.gray700,
        tabBarStyle: { backgroundColor: "#FEB85B" },
        tabBarActiveTintColor: GlobalStyles.colors.gray700,

        headerLeft: ({ tintColor }) => (
          <IconButton
            icon="person-circle-outline"
            color="black"
            size={24}
            onPress={ToProfile.bind(this, navigation)}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExplorePageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="eye-outline" size={size} color={color} />
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
    </Tab.Navigator>
  );
};
export default function App() {
  const [projects, setProjects] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const getAuthState = function () {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      }
    });
  };
  getAuthState();
  // console.log(isloggedIn)
  const { loggedIn, setloggedIn } = useContext(LoginContext);
  return (
    <Provider store={store}>
      <MyContext.Provider
        value={{ projects, setProjects, inventory, setInventory }}
      >
        <LoginContext.Provider
          value={{ loggedIn: isloggedIn, setloggedIn: setIsLoggedIn }}
        >
          <NavigationContainer>
            {isloggedIn ? ( // if user is logged in, show these screens
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "#FEB85B",
                  },
                  headerTintColor: "black",
                  tabBarStyle: {
                    backgroundColor: "#FEB85B",
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
                  name="Home Page"
                  component={HomePageScreen}
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
                <Stack.Screen
                  name="User Profile"
                  component={UserProfileScreen}
                />
                <Stack.Screen
                  name="Edit Profile"
                  component={EditProfileScreen}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen
                  name="Add Inventory"
                  component={AddInventoryScreen}
                />
                <Stack.Screen
                  name="Reset Password"
                  component={ResetPasswordScreen}
                />
                <Stack.Screen
                  name="Saved Projects"
                  component={SavedProjectsScreen}
                />
                <Stack.Screen name="Chat List" component={ChatListScreen} />
                <Stack.Screen name="Chat Detail" component={ChatScreen} />
                <Stack.Screen name="Comments" component={CommentsScreen} />
              </Stack.Navigator>
            ) : (
              // If not logged in, show login screen and register screen
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "#FEB85B",
                  },
                  headerTintColor: "black",
                  tabBarStyle: {
                    backgroundColor: "#FEB85B",
                  },
                  tabBarActiveTintColor: GlobalStyles.colors.accent500,
                }}
              >
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
              </Stack.Navigator>
            )}
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
