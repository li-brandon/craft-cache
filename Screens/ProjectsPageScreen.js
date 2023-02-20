import { ScrollView, Text, StyleSheet, AsyncStorage } from "react-native";
import React, { useEffect, useState, createContext, useContext } from "react";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";

import { collection, getDocs, query, where } from "firebase/firestore";

function ProjectsPageScreen({ navigation }) {
  const { projects, setProjects } = useContext(MyContext);

  const user = "9WMhukGezkVDYncWcfTV"; // TODO: user id is hardcoded for now

  useEffect(() => {
    // fetch projects from database for the current user
    // create temp array to store projects
    const tempProjects = [];
    const q = query(collection(db, "projects"), where("user", "==", user));
    getDocs(q).then((querySnapshot) => {
      // push each project fetched from db to tempProjects including the id of the project
      querySnapshot.forEach((doc) => {
        tempProjects.push({ ...doc.data(), id: doc.id });
      });
      setProjects(tempProjects);
    });

  }, []);

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
