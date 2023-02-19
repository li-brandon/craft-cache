import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const EditProfileScreen = ({ navigation }) => {
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
    // TODO: save new project to database but right now it will just log it to the console
    console.log(newProject);
    saveProject(newProject);
    // clear input fields
    clearFields();
  };

  const saveProject = (newProject) => {
    // send project to ProjectsPageScreen.js using navigation
    navigation.navigate("ProjectsPageScreen", {
      newProject: newProject,
    });
  };

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
        <Text style={styles.buttonText}>Save Changes</Text>
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

export default EditProfileScreen;
