import React from "react";
import { MyContext } from "./Contexts/MyContext"
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FrontPageScreen from './Screens/FrontPageScreen';
import ExplorePageScreen from './Screens/ExplorePageScreen';
import AddProjectScreen from './Screens/AddProjectScreen';
import ManageExpensesScreen from './Screens/ManageExpensesScreen';
import InventoryPageScreen from './Screens/InventoryPageScreen';
import ItemDetailScreen from './Screens/ItemDetailScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { GlobalStyles } from './Constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { store } from './Data/store';
import { Provider } from 'react-redux';
import IconButton from './Components/UI/IconButton';
import ExpensesContextProvider from './Data/expenses-context';
import ProjectsPageScreen from './Screens/ProjectsPageScreen';
import LoginScreen from './Screens/LoginScreen';
import UserProfileScreen from './Screens/UserProfileScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function ToManage(navigation) {
  return navigation.navigate('Login');
}
const FrontPage = function () {
  const isUser = true;
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary50 },
        headerTintColor: GlobalStyles.colors.gray700,
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary50 },
        tabBarActiveTintColor: GlobalStyles.colors.gray700,
        headerRight: isUser
          ? ({ tintColor }) => (
              <IconButton
                icon="add"
                color={tintColor}
                size={24}
                onPress={ToManage.bind(this, navigation)}
              />
              // <IconButton name="add" color={tintColor} size={24} onPress={ToManage} />
            )
          : null,
      })}
    >
      <Tab.Screen
        name="Craft Cache"
        component={FrontPageScreen}
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
        name="AddProjectScreen"
        component={AddProjectScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProjectsPageScreen"
        component={ProjectsPageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="InventoryPageScreen"
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
  // TODO: replace this with a fetch call to the database
  const [projects, setProjects] = React.useState([
    {
      id: 1,
      name: "Project 1",
      type: "crochet",
      tools: "shovel",
      materials: "paper",
      pattern: "idk",
      description: "This is project 1",
      startDate: "01/01/2023",
      lastUpdated: "01/01/2023",
      status: "In progress",
      posted: true,
    },
    {
      id: 2,
      name: "Project 2",
      type: "crochet",
      tools: "hammer",
      materials: "rock",
      pattern: "idk patterns",
      description:
        "This is project 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      startDate: "01/05/2023",
      lastUpdated: "01/06/2023",
      status: "Finished",
      posted: false,
    },
    {
      id: 3,
      name: "Project 3",
      type: "crochet",
      tools: "sledgehammer",
      materials: "scissors",
      pattern: "idk patterns",
      description:
        "This is project 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      startDate: "02/19/2023",
      lastUpdated: "02/23/2023",
      status: "In Progress",
      posted: true,
    },
  ]);
  return (
    <Provider store={store}>
      <MyContext.Provider value={{ projects, setProjects }}>
        {/* <ExpensesContextProvider> */}
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
              headerTintColor: "white",
              tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
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
          <Stack.Screen name="Detail" component={ItemDetailScreen}
          />
          <Stack.Screen name="Login" component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="UserProfile" component={UserProfileScreen}
            options={{ headerShown: false }}
          />
          </Stack.Navigator>
        </NavigationContainer>
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
