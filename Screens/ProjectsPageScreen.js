import { ScrollView, Text, StyleSheet } from "react-native";
import Project from "../Components/ProjectsPage/Project";
function ProjectsPageScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Project navigation={navigation}/>
      <Project navigation={navigation}/>
      <Project navigation={navigation}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white", //GlobalStyles.colors.primary50,
  },

});

export default ProjectsPageScreen;
