import { View, Text, Button, StyleSheet } from "react-native";
import ExpensesOutput from "../Components/ExpensesOutput/ExpensesOutput";
import { Dummy_expenses } from "../Data/ExpensesData";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import { ExpensesContext } from "../Data/expenses-context";
import ProjectsPageScreen from "./ProjectsPageScreen";
import ExplorePageScreen from "./ExplorePageScreen";
import { GlobalStyles } from "../Constants/styles";
import { auth, db } from "../firebase";
import { LoginContext } from "../Contexts/LoginContext";
function FrontPageScreen({ navigation, route }) {
  // const expenseData = useContext(ExpensesContext);
  // const expenseData = useSelector((state) => state.itemList.expenses)
  // const [loggedIn, setloggedIn] = useState(true);
  // useEffect(() => {
  // const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //         setloggedIn(false);
  //     }
  // });
  //     return unsubscribe;
  // }, []);
  const { loggedIn, setloggedIn } = useContext(LoginContext);
  // console.log("loggedin: " + loggedIn);
  return (
    <View style={styles.container}>
      {!loggedIn && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>Please log in first!</Text>
        </View>
      )}
      <ExplorePageScreen navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  textContainer: {
    margin: 10,
    // justifyContent: 'center',
    // alignContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.error500,
  },
});

export default FrontPageScreen;
