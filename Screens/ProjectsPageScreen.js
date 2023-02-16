import { View, Text, StyleSheet, Image } from "react-native";
// import hat image from images folder
import hat from "../images/flower-bucket-hat.jpg";

function ProjectsPageScreen() {
  return (
    <View style={styles.container}>
      
      {/* Project 1 */}
      <View style={styles.project}>
        <View>
          <View style={styles.projectName}>
            <Text style={styles.projectNameText}>Flower Bucket Hat</Text>
          </View>
          <View style={styles.projectInfoAndImage}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectInfoText}>Type: crochet</Text>
              <Text style={styles.projectInfoText}>Tool(s): 5mm hook</Text>
              <Text style={styles.projectInfoText}>
                Materials: cotton aran yarn
              </Text>
              <Text style={styles.projectInfoText}>Pattern: self drafted </Text>
              <Text style={styles.projectInfoText}>
                Description: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed consequat sit amet eros nec egestas. Praesent quis
                rhoncus est.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={hat} />
            </View>
          </View>
          <View style={styles.projectStatusAndPostStatus}>
            <View style={styles.projectStatus}>
              <Text style={styles.projectStatusText}>Started: mm/dd/yyyy</Text>
              <Text style={styles.projectStatusText}>
                Last Updated: mm/dd/yyyy
              </Text>
              <Text style={styles.projectStatusText}>Status: In progress</Text>
            </View>
            <View style={styles.postStatus}>
              <Text style={styles.postStatusText}>POSTED</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Project 2 */}
      <View style={styles.project}>
        <View>
          <View style={styles.projectName}>
            <Text style={styles.projectNameText}>Flower Bucket Hat</Text>
          </View>
          <View style={styles.projectInfoAndImage}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectInfoText}>Type: crochet</Text>
              <Text style={styles.projectInfoText}>Tool(s): 5mm hook</Text>
              <Text style={styles.projectInfoText}>
                Materials: cotton aran yarn
              </Text>
              <Text style={styles.projectInfoText}>Pattern: self drafted </Text>
              <Text style={styles.projectInfoText}>
                Description: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed consequat sit amet eros nec egestas. Praesent quis
                rhoncus est.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={hat} />
            </View>
          </View>
          <View style={styles.projectStatusAndPostStatus}>
            <View style={styles.projectStatus}>
              <Text style={styles.projectStatusText}>Started: mm/dd/yyyy</Text>
              <Text style={styles.projectStatusText}>
                Last Updated: mm/dd/yyyy
              </Text>
              <Text style={styles.projectStatusText}>Status: In progress</Text>
            </View>
            <View style={styles.postStatus}>
              <Text style={styles.postStatusText}>POSTED</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Project 4 */}
      <View style={styles.project}>
        <View>
          <View style={styles.projectName}>
            <Text style={styles.projectNameText}>Flower Bucket Hat</Text>
          </View>
          <View style={styles.projectInfoAndImage}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectInfoText}>Type: crochet</Text>
              <Text style={styles.projectInfoText}>Tool(s): 5mm hook</Text>
              <Text style={styles.projectInfoText}>
                Materials: cotton aran yarn
              </Text>
              <Text style={styles.projectInfoText}>Pattern: self drafted </Text>
              <Text style={styles.projectInfoText}>
                Description: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed consequat sit amet eros nec egestas. Praesent quis
                rhoncus est.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={hat} />
            </View>
          </View>
          <View style={styles.projectStatusAndPostStatus}>
            <View style={styles.projectStatus}>
              <Text style={styles.projectStatusText}>Started: mm/dd/yyyy</Text>
              <Text style={styles.projectStatusText}>
                Last Updated: mm/dd/yyyy
              </Text>
              <Text style={styles.projectStatusText}>Status: In progress</Text>
            </View>
            <View style={styles.postStatus}>
              <Text style={styles.postStatusText}>POSTED</Text>
            </View>
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white", //GlobalStyles.colors.primary50,
  },

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

export default ProjectsPageScreen;
