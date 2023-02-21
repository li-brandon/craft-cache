import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import hat from "../assets/flower-bucket-hat.jpg";

const ProjectDetail = ({ project }) => {
  return (
    <View>
      <View style={styles.project}>
        <View>
          <View style={styles.projectName}>
            <Text style={styles.projectNameText}>{project.name}</Text>
          </View>
          <View style={styles.projectInfoAndImage}>
            <View style={styles.imageContainer}>
              {/* TODO: Must find a way to have image associated with its project */}
              <Image style={styles.image} source={hat} />
            </View>
            <View style={styles.postStatus}>
              {project.posted ? ( // If project is posted, show "POSTED" text
                <Text style={styles.postStatusText}>POSTED</Text>
              ) : (
                // If project is not posted, show "NOT POSTED" text
                <Text style={styles.postStatusText}>NOT POSTED</Text>
              )}
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
                  Status: {project.status}
                </Text>
              </View>
              <View style={styles.projectInfo}>
                <Text style={styles.projectInfoText}>
                  Project Type: {project.type}
                </Text>
                <Text style={styles.projectInfoText}>
                  Tools: {project.tools}
                </Text>
                <Text style={styles.projectInfoText}>
                  Materials: {project.materials}
                </Text>
                <Text style={styles.projectInfoText}>
                  Pattern: {project.pattern}
                </Text>
                <Text style={styles.projectInfoText}>
                  Description: {project.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProjectDetail;

const styles = StyleSheet.create({
  project: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 5,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
  },

  projectName: {
    marginBottom: 5,
    alignItems: "center",
  },

  projectNameText: {
    fontSize: 20,
  },

  projectInfoAndImage: {
    flexDirection: "column",
    marginBottom: 5,
  },

  projectInfo: {
    width: "100%",
  },

  projectInfoText: {
    fontSize: 13,
  },

  imageContainer: {
    width: "100%",
    alignItems: "center",
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },

  projectStatusAndPostStatus: {
    flexDirection: "column",
  },

  projectStatus: {
    width: "60%",
  },

  postStatus: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    width: "100%",
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
