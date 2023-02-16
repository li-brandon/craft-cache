import { ScrollView, Text, StyleSheet, AsyncStorage } from "react-native";
import React, { useEffect, useState } from "react";
import Project from "../Components/ProjectsPage/Project";

function ProjectsPageScreen({ navigation }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {

    // TODO: code below will load projects from database and set to state
    // const loadProjects = async () => {
    //   try {
    //     const projectsData = await AsyncStorage.getItem("projects");
    //     if (projectsData) {
    //       setProjects(JSON.parse(projectsData));
    //     }
    //   } catch (error) {
    //     console.error("Error loading projects: ", error);
    //   }
    // };

    // loadProjects();

    console.log("ProjectsPageScreen useEffect")
  }, []);

  return (
    <ScrollView style={styles.container}>
      
      
      {/* TODO: code below will map over projects and render Project component *
       {projects.map((project, index) => (
        <Project key={index} project={project} navigation={navigation} />
      ))} */}

      <Project navigation={navigation} />
      <Project navigation={navigation} />
      <Project navigation={navigation} />

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
