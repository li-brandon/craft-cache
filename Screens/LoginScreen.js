import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { GlobalStyles } from "../Constants/styles";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  function outputErrorCode(code) {
    console.log(code === 'auth/weak-password')
    console.log(code)
    switch (code) {
      case 'auth/email-already-exists':
        setErrorMessage("Email already exists!");
        break
      case 'auth/email-already-in-use':
        setErrorMessage("Email already exists!");
        break
      case "auth/weak-password":
        setErrorMessage('Password too short!password should be at least six number!')
        break
      default:
        setErrorMessage(code.substring(5))
    }

  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("User Profile");
      }
    });
    return unsubscribe;
  }, []);
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(email + " logged in!");
        // ...
      })
      .catch((error) => {
        outputErrorCode(error.code);
      });
  };
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("reigisered successfully:" + email);
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        outputErrorCode(error.code);
      });
  };
  const handleBack = function () {
    navigation.goBack("UserProfile");
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Text style={styles.textStyle}>{errorMessage}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Please input your Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password should be At least six characters"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textStyle: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold'
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0728f9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0728f9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "blue",
    fontWeight: "700",
    fontSize: 16,
  },
});
