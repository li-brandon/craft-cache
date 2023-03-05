import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
// import hat from "../assets/flower-bucket-hat.jpg";

const Project = ({ project, navigation }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Detail", {
            project: project,
            navigation: navigation,
          });
        }}
      >
        <View style={styles.project}>
          <View>
            <View style={styles.projectName}>
              <Text style={styles.projectNameText}>{project.name}</Text>
            </View>
            <View style={styles.projectInfoAndImage}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectInfoText}>
                  Project Type: {project.type}
                </Text>
                <Text style={styles.projectInfoText}>
                  {/* Goes through array of tools and outputs them in a readable way */}
                  Tools:{" "}
                  {project.tools.map((tool, index) => {
                    if (index === project.tools.length - 1) {
                      return tool;
                    } else {
                      return tool + ", ";
                    }
                  })}
                </Text>
                <Text style={styles.projectInfoText}>
                  {/* Goes through array of materials and outputs them in a readable way */}
                  Materials:{" "}
                  {project.materials.map((material, index) => {
                    if (index === project.materials.length - 1) {
                      return material;
                    } else {
                      return material + ", ";
                    }
                  })}
                </Text>
                <Text style={styles.projectInfoText}>
                  Pattern: {project.pattern}
                </Text>
                <Text style={styles.projectInfoText}>
                  Description: {project.description}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: project.image }} />
              </View>
            </View>
            <View style={styles.projectStatusAndPostStatus}>
              <View style={styles.projectStatus}>
                <Text style={styles.projectStatusText}>
                  Started: {project.startDate}
                </Text>
                <Text style={styles.projectStatusText}>
                  Last Updated: {project.lastUpdated}
                </Text>
                <Text style={styles.projectStatusText}>
                  Status: {project.inProgress ? "In progress" : "Finished"}
                </Text>
              </View>
              <View style={styles.postStatus}>
                {project.posted ? ( // If project is posted, show "POSTED" text
                  <Text style={styles.postStatusText}>POSTED</Text>
                ) : (
                  // If project is not posted, show "NOT POSTED" text
                  <Text style={styles.postStatusText}>NOT POSTED</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Project;

const styles = StyleSheet.create({
  project: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 5,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },

  projectName: {
    marginBottom: 5,
  },

  projectNameText: {
    fontSize: 17,
  },

  projectInfoAndImage: {
    flexDirection: "row",
    marginBottom: 5,
  },

  projectInfo: {
    width: "60%",
  },

  projectInfoText: {
    fontSize: 13,
  },

  imageContainer: {
    width: "40%",
    alignItems: "center",
  },

  image: {
    width: 130,
    height: 140,
    borderRadius: 10,
  },

  projectStatusAndPostStatus: {
    flexDirection: "row",
  },

  projectStatus: {
    width: "60%",
  },

  postStatus: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },

  projectStatusText: {
    fontSize: 13,
    color: "grey",
  },

  postStatusText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
