import { View, Text, Button, StyleSheet } from "react-native";
import ExpensesOutput from "../Components/ExpensesOutput/ExpensesOutput";
import { Dummy_expenses } from "../Data/ExpensesData";
import { useSelector, useDispatch } from 'react-redux';
import { useContext, useState, useEffect } from "react";
import { ExpensesContext } from "../Data/expenses-context";
import HomePageScreen from "./HomePageScreen";
import { GlobalStyles } from "../Constants/styles";
import { auth, db } from "../firebase";
import { LoginContext } from "../Contexts/LoginContext";
function FrontPageScreen({ navigation, route }) {
    const { loggedIn, setloggedIn } = useContext(LoginContext);
    return (
        <View style={styles.container}>
            {/* if user logged in, show HomePageScreen. Otherwise redirect user to Login */}
            {loggedIn ? <HomePageScreen navigation={navigation} /> : navigation.navigate('Login')}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    textContainer: {
        margin: 10,
        // justifyContent: 'center',
        // alignContent: "center",
    },
    text: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: GlobalStyles.colors.error500
    }
})
export default FrontPageScreen;
