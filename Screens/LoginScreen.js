import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import LoadingOverLay from "../Components/UI/LoadingOverLay";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { GlobalStyles } from "../Constants/styles";
import { async } from "@firebase/util";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  async function handleSignIn() {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(email + " logged in!");
      })
      .catch((error) => {
        outputErrorCode(error.code);
      });
    setIsLoading(false);
  };
  async function firebaseSignUp() {
    setIsLoading(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("reigisered successfully:" + email);
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        outputErrorCode(error.code);
      });
    setIsLoading(false)
  }
  const handleBack = function () {
    navigation.goBack("UserProfile");
  };
  // if (isFetching) {
  //   return <LoadingOverLay containerStyle={styles.container} />
  // }
  const handleSignUp = () => {
    Alert.alert("Sign Up", "Are you sure to Sign up?",
      [{ text: 'cancel', style: 'cancel' },
      { text: 'yes', onPress: () => { firebaseSignUp() } }])
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View>
      }
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
  loading: {
    position: 'absolute',
    left: 100,
    right: 100,
    top: 40,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center'
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
