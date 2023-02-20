import { ScrollView, Text, StyleSheet, AsyncStorage } from "react-native";
import React, { useState, createContext, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";

import { collection, getDocs, query, where } from "firebase/firestore";

function ProjectsPageScreen({ navigation }) {
  const { projects, setProjects } = useContext(MyContext);
  // TODO: user id is hardcoded for now
  const userID = "JzDTobXLRSPMIw7G86sjQxR9REd2"; 

  // useFocusEffect is similar to useEffect, but it is called when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // fetch projects from database for the current user
      const tempProjects = [];

      // query database for projects with userID matching current user
      const q = query(collection(db, "projects"), where("userID", "==", userID));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempProjects.push({ ...doc.data(), id: doc.id });
        });
        setProjects(tempProjects);
      });
      
    }, [])
  );

  return (
    // TODO: Change ScrollView to FlatList
    <ScrollView style={styles.container}>
      {/* map over projects and render Project component */}
      {projects.map((project, index) => (
        <Project key={index} project={project} navigation={navigation} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
});

export default ProjectsPageScreen;
