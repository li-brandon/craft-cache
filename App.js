import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import { AllExpensesScreen, ManageExpensesScreen, RecentExpensesScreen } from './Screens/AllExpensesScreen';
import AllExpensesScreen from './Screens/AllExpensesScreen';
import ManageExpensesScreen from './Screens/ManageExpensesScreen';
import RecentExpensesScreen from './Screens/RecentExpensesScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { GlobalStyles } from './Constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { store } from './Data/store';
import { Provider } from 'react-redux';
import IconButton from './Components/UI/IconButton';
import ExpensesContextProvider from './Data/expenses-context';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function ToManage(navigation) {
  return navigation.navigate('Manage Page',
    {
    }
  );
}
const FrontPage = function () {
  const isUser = true;
  return (
    <Tab.Navigator screenOptions={({ navigation }) => ({
      headerStyle: { backgroundColor: GlobalStyles.colors.primary500, },
      headerTintColor: 'white',
      tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500, },
      tabBarActiveTintColor: GlobalStyles.colors.accent500,
      headerRight: isUser ? ({ tintColor }) => (
        <IconButton icon="add" color={tintColor} size={24} onPress={ToManage.bind(this, navigation)} />
        // <IconButton name="add" color={tintColor} size={24} onPress={ToManage} />
      ) : null,
    })}>
      <Tab.Screen name="AllExpenses" component={AllExpensesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name='hourglass' size={size} color={color} />
        }}
      />
      <Tab.Screen name="RecentExpenses" component={RecentExpensesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name='calendar' size={size} color={color} />
        }} />

    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <Provider store={store}>
      {/* <ExpensesContextProvider> */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500, },
          headerTintColor: 'white',
          tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500, },
          tabBarActiveTintColor: GlobalStyles.colors.accent500,
        }}>
          <Stack.Screen name="Front Page" component={FrontPage}
            options={{
              headerShown: false,
              headerBackVisible: false
            }}
          />
          <Stack.Screen name="Manage Page" component={ManageExpensesScreen}
            options={{
              presentation: 'modal'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    // {/* </ExpensesContextProvider> */ }
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
