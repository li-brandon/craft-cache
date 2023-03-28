import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import userIcon from "../assets/user-icon.png";


export default function Post ({ project }) {

  return (
    <View style={styles.projectPost}>
      <View style={styles.userOfPostAndOptionsButton}>
        <View style={styles.userOfPost}>
          <View>
            <Image
              source={project.userImage ? { uri: project.userImage } : userIcon}
              style={styles.userImage}
              alt="User Icon"
            />
          </View>
          <Text style={styles.userName}>{project.username}</Text>
        </View>
        <View>
          <SimpleLineIcons name="options" size={20} />
        </View>
      </View>
      <View style={styles.projectImageContainer}>
        <Image
          source={{ uri: project.image }}
          style={styles.projectImage}
          alt="Project Image"
        />
      </View>
      <View style={styles.postInteractionIcons}>
        <View style={styles.likeCommentShareIcons}>
          <FontAwesome name="heart" style={styles.interactionIcon} />
          <FontAwesome name="comment-o" style={styles.interactionIcon} />
          <FontAwesome name="share-alt" style={styles.interactionIcon} />
        </View>
        <View>
          <FontAwesome name="bookmark" style={styles.saveIcon} />
        </View>
      </View>
      <View>
        <View style={styles.projectNameContainer}>
          <Text style={styles.projectNameText}>{project.name}</Text>
        </View>
        <View style={styles.projectInfoContainer}>
          <Text style={styles.projectInfoText}>Type:{" "}
            {project.type.map((type, index) => {
                if (index === project.type.length - 1) {
                    return type;
                } else {
                    return type + ", ";
                }
            })}
          </Text>
          <Text style={styles.projectInfoText}>Tool(s):{" "}
            {project.tools.map((tool, index) => {
                if (index === project.tools.length - 1) {
                    return tool;
                } else {
                    return tool + ", ";
                }
            })}
          </Text>
          <Text style={styles.projectInfoText}>
            Materials:{" "}
            {project.materials.map((material, index) => {
                if (index === project.materials.length - 1) {
                    return material;
                } else {
                    return material + ", ";
                }
            })}
          </Text>
          <Text style={styles.projectInfoText}>Pattern: {project.pattern}</Text>
          <Text style={styles.projectInfoText}>
            Description: {project.description}
          </Text>
        </View>
        <View style={styles.projectStatusContainer}>
          <Text style={styles.projectStatusText}>Started: {project.startDate}</Text>
          <Text style={styles.projectStatusText}>Last Updated: {project.lastUpdated}</Text>
          <Text style={styles.projectStatusText}>Status: {project.inProgress ? "In progress" : "Finished"}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  projectPost: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dbdbdb",
  },
  userOfPostAndOptionsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userOfPost: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
  },
  projectImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "white",
  },

  projectImage: {
    width: "100%",
    height: 275,
  },
  postInteractions: {
    padding: 5,
  },
  postInteractionIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },
  likeCommentShareIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  interactionIcon: {
    marginRight: 16,
    fontSize: 27,
  },
  saveIcon: {
    fontSize: 27,
  },

  projectNameContainer: {
    marginBottom: 16,
  },

  projectNameText: {
    fontSize: 17,
  },

  projectInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },

  projectInfoContainer: {
    marginBottom: 8,
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
});
