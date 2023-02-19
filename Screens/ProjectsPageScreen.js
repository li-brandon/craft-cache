import { ScrollView, Text, StyleSheet, AsyncStorage } from "react-native";
import React, { useEffect, useState, createContext, useContext } from "react";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";

function ProjectsPageScreen({ navigation }) {
  const { projects, setProjects } = useContext(MyContext);

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
