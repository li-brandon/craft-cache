import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, createContext, useContext } from "react";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../firebase";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";

import hat from "../Components/assets/flower-bucket-hat.jpg";

const UserProfileScreen = ({ navigation, route }) => {
  // TODO: Verify if the user is logged in or not and display appropriate screen

  const { projects, setProjects } = useContext(MyContext);

  return (
    <View>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("Edit Profile")}
      />
      <Image style={styles.image} source={hat} />
      <Text>Username</Text>
      <Text>Published Projects:</Text>

      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* map over projects and render Project component */}
        {projects.map((project, index) => (
          <Project key={index} project={project} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );

  // // const email = route.params['email'];
  // const signOutHandler = () => {
  //     signOut(auth).then(() => {
  //         console.log('Sign-out successful.');
  //         navigation.replace('Front Page');
  //     }).catch((error) => {
  //         // An error happened.
  //     });
  // }
  // const handleBack = function () {
  //     navigation.goBack();
  // }
  // return (
  //     <View style={styles.container}>
  //         <Text>email:{auth.currentUser?.email}</Text>
  //         <TouchableOpacity
  //             onPress={signOutHandler}
  //             style={styles.button}
  //         >
  //             <Text style={styles.buttonText}>sign out</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //             onPress={handleBack}
  //             style={styles.button}
  //         >
  //             <Text style={styles.buttonText}>To Front Page</Text>
  //         </TouchableOpacity>

  //     </View >
  // )
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  button: {
    backgroundColor: "#0728f9",
    width: "100%",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});
