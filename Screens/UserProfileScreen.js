import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native'
import React, { useContext } from 'react'
import { getAuth, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { LoginContext } from '../Contexts/LoginContext';
const UserProfileScreen = ({ navigation, route }) => {


    // const email = route.params['email'];
    const { loggedIn, setloggedIn } = useContext(LoginContext);
    const signOutHandler = () => {
        signOut(auth).then(() => {
            console.log('Sign-out successful.');
            navigation.replace('Front Page');
            setloggedIn(false);
        }).catch((error) => {
            // An error happened.
        });
    }
    const handleBack = function () {
        navigation.goBack();
    }
    return (
        <View style={styles.container}>
            <Text>email:{auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={signOutHandler}
                style={styles.button}
            >
                <Text style={styles.buttonText}>sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleBack}
                style={styles.button}
            >
                <Text style={styles.buttonText}>To Front Page</Text>
            </TouchableOpacity>

        </View >
    )
}

export default UserProfileScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    button: {
        backgroundColor: '#0728f9',
        width: '100%',
        padding: 15,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
