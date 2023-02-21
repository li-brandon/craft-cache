import React, { useState, useContext} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import { MyContext } from "../Contexts/MyContext";

const AddProjectScreen = ({ navigation }) => {

  const { projects, setProjects } = useContext(MyContext);


  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [tools, setTools] = useState("");
  const [materials, setMaterials] = useState("");
  const [pattern, setPattern] = useState("");
  const [description, setDescription] = useState("");

  const handleAddProject = () => {
    const newProject = {
      name: name,
      type: type,
      tools: tools,
      materials: materials,
      pattern: pattern,
      description: description,
    };

    const date = getCurrentDate();

    newProject.startDate = date;
    newProject.lastUpdated = date;
    newProject.status = "In progress";
    newProject.posted = false;

    // newProject's id the last project id + 1
    if (!projects) {
      newProject.id = 1;
    } else {
      newProject.id = projects[projects.length - 1].id + 1;
    }

    // TODO: save new project to database  
    saveProject(newProject);
    // clear input fields
    clearFields();
  };

  const saveProject = (newProject) => {
    if (!projects) {
      setProjects([newProject]);
    } else {
      setProjects([...projects, newProject]); // add new project to projects array in Context
    }
  
    Alert.alert("Project added successfully!");
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    
    const formattedDate = `${month}/${day}/${year}`;
    
    return formattedDate;
  }

  

  const clearFields = () => {
    setName("");
    setType("");
    setTools("");
    setMaterials("");
    setPattern("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a new project</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Project type"
          value={type}
          onChangeText={(text) => setType(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tools"
          value={tools}
          onChangeText={(text) => setTools(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Materials"
          value={materials}
          onChangeText={(text) => setMaterials(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Pattern"
          value={pattern}
          onChangeText={(text) => setPattern(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddProject}>
        <Text style={styles.buttonText}>Add Project</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddProjectScreen;
