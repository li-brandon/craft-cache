import { ScrollView, Text, StyleSheet, AsyncStorage } from "react-native";
import React, { useEffect, useState, createContext } from "react";
import Project from "../Components/ProjectsPage/Project";
// import MyContext from "../Contexts/MyContext";

function ProjectsPageScreen({ navigation, route }) {
  // TODO: Fake JSON data. Will have to make it so that projects are from database
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project 1",
      type: "crochet",
      tools: "shovel",
      materials: "paper",
      pattern: "idk",
      description: "This is project 1",
      startDate: "01/01/2023",
      lastUpdated: "01/01/2023",
      status: "In progress",
      posted: true,
    },
    {
      id: 2,
      name: "Project 2",
      type: "crochet",
      tools: "hammer",
      materials: "rock",
      pattern: "idk patterns",
      description:
        "This is project 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      startDate: "01/05/2023",
      lastUpdated: "01/06/2023",
      status: "Finished",
      posted: false,
    },
    {
      id: 3,
      name: "Project 3",
      type: "crochet",
      tools: "sledgehammer",
      materials: "scissors",
      pattern: "idk patterns",
      description:
        "This is project 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      startDate: "02/19/2023",
      lastUpdated: "02/23/2023",
      status: "In Progress",
      posted: true,
    },
  ]);

  // TODO: This will be used to check if there are new projects passed from the AddProjectScreen
  // REMOVE THIS LATER
  const { newProject } = route.params || {};

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

    // Instead of fetching from database, we will just check if there are new projects passed
    // from the AddProjectScreen for now. If there are, we will add them to the projects state
    if (newProject) {
      setProjects([...projects, newProject]);
    }
  }, [newProject]);

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
