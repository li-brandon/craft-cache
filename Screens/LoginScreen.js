import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";

import LoadingOverLay from "../Components/UI/LoadingOverLay";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { LoginContext } from "../Contexts/LoginContext";
import yarn from "../Components/assets/yarn.png";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loggedIn, setloggedIn } = useContext(LoginContext);

  function outputErrorCode(code) {
    switch (code) {
      case "auth/email-already-exists":
        setErrorMessage("Email already exists!");
        break;
      case "auth/email-already-in-use":
        setErrorMessage("Email already exists!");
        break;
      case "auth/weak-password":
        setErrorMessage(
          "Password too short!password should be at least six number!"
        );
        break;
      default:
        setErrorMessage(code.substring(5));
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setloggedIn(true);
        navigation.replace("Front Page");
      } else {
        setloggedIn(false);
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
  }

  async function firebaseSignUp() {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  const handleBack = function () {
    navigation.goBack("UserProfile");
  };

  const handleResetPassword = function () {
    navigation.navigate("Reset Password");
  };

  // if (isFetching) {
  //   return <LoadingOverLay containerStyle={styles.container} />
  // }
  const handleSignUp = () => {
    // Alert.alert("Sign Up", "Are you sure to Sign up?", [
    //   { text: "cancel", style: "cancel" },
    //   {
    //     text: "yes",
    //     onPress: () => {
    //       firebaseSignUp();
    //     },
    //   },
    // ]);
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Craft Cache</Text>
        <Image style={styles.image} source={yarn} />
      </View>

      <View>
        <Text style={styles.textStyle}>{errorMessage}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
        <Text style={styles.inputTitle}>Password</Text>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          placeholder="Strong Password"
          value={password}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignIn}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={handleResetPassword}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Reset Password</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          onPress={handleBack}
          style={[styles.button, styles.cancelButtonOutline]}
        >
          <Text style={styles.cancelButtonOutlineText}>Cancel</Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEB85B",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  textStyle: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
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
    marginBottom: 20,
  },
  inputTitle: {
    fontWeight: "700",
    fontSize: 16,
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
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  loading: {
    position: "absolute",
    left: 100,
    right: 100,
    top: 40,
    bottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButtonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "red",
    borderWidth: 2,
  },
  cancelButtonOutlineText: {
    color: "red",
    fontWeight: "700",
    fontSize: 16,
  },
});
