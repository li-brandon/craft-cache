import { View, Text, StyleSheet, Image } from "react-native";
// import hat image from images folder
import hat from "../images/flower-bucket-hat.jpg";

function ProjectsPageScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.project}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "60%" }}>
            <Text style={{ fontWeight: "bold" }}>Flower Bucket Hat</Text>
            <View style={styles.projectInfo}>
              <Text style={styles.projectInfoText}>Type: </Text>
              <Text style={styles.projectInfoText}>Tool(s): </Text>
              <Text style={styles.projectInfoText}>Materials: </Text>
              <Text style={styles.projectInfoText}>Pattern: </Text>
              <Text style={styles.projectInfoText}>Description: </Text>
            </View>
          </View>
          <View
            style={{
              width: "40%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
            }}
          >
            <Image style={styles.image} source={hat} />
            <Text style={styles.postedStatus}>POSTED</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white", //GlobalStyles.colors.primary50,
  },

  project: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },

  projectInfo: {
    marginTop: 5,
    marginBottom: 5,
  },

  projectInfoText: {
    fontSize: 11,
  },

  image: {
    width: 120,
    height: 110,
    borderRadius: 10,
  },

  postedStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default ProjectsPageScreen;
