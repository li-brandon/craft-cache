import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import hat from "../Components/assets/flower-bucket-hat.jpg";
import userIcon from "../Components/assets/user-icon.png";
import bag from "../Components/assets/tote.jpg";

function HomePageScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>

      {/* FIRST POST */}
      <View style={styles.projectPost}>
        <View style={styles.userOfPostAndOptionsButton}>
          <View style={styles.userOfPost}>
            <View>
              <Image source={userIcon} alt="user pfp" style={styles.userImage} />
            </View>
            <Text style={styles.userName}>username</Text>
          </View>
          <View>
            <SimpleLineIcons name="options" size={20} />
          </View>
        </View>
        <View style={styles.projectImageContainer}>
          <Image
            source={hat}
            style={styles.projectImage}
            alt="Flower Bucket Hat"
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
            <Text style={styles.projectNameText}>Flower Bucket Hat</Text>
          </View>
          <View style={styles.projectInfoContainer}>
            <Text style={styles.projectInfoText}>Type: crochet</Text>
            <Text style={styles.projectInfoText}>Tool(s): 5mm hook</Text>
            <Text style={styles.projectInfoText}>
              Materials: Cotton aran yarn
            </Text>
            <Text style={styles.projectInfoText}>Pattern: self drafted</Text>
            <Text style={styles.projectInfoText}>
              Description: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Donec auctor, nisl eget ultricies
            </Text>
          </View>
          <View style={styles.projectStatusContainer}>
            <Text style={styles.projectStatusText}>Started: mm/dd/yyyy</Text>
            <Text style={styles.projectStatusText}>
              Last Updated: mm/dd/yyyy
            </Text>
            <Text style={styles.projectStatusText}>Status: In progress</Text>
          </View>
        </View>
      </View>


      {/* SECOND POST */}
      <View style={styles.projectPost}>
        <View style={styles.userOfPostAndOptionsButton}>
          <View style={styles.userOfPost}>
            <View>
              <Image source={userIcon} alt="user pfp" style={styles.userImage} />
            </View>
            <Text style={styles.userName}>username</Text>
          </View>
          <View>
            <SimpleLineIcons name="options" size={20} />
          </View>
        </View>
        <View style={styles.projectImageContainer}>
          <Image
            source={bag}
            style={styles.projectImage}
            alt="Tote Bag"
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
            <Text style={styles.projectNameText}>Toile de Jouy Tote</Text>
          </View>
          <View style={styles.projectInfoContainer}>
            <Text style={styles.projectInfoText}>Type: fabric, sewing</Text>
            <Text style={styles.projectInfoText}>Tool(s): sewing machine</Text>
            <Text style={styles.projectInfoText}>
              Materials: cotton canvas, polyester
            </Text>
            <Text style={styles.projectInfoText}>Pattern: self drafted</Text>
            <Text style={styles.projectInfoText}>
              Description: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Donec auctor, nisl eget ultricies
            </Text>
          </View>
          <View style={styles.projectStatusContainer}>
            <Text style={styles.projectStatusText}>Started: mm/dd/yyyy</Text>
            <Text style={styles.projectStatusText}>
              Last Updated: mm/dd/yyyy
            </Text>
            <Text style={styles.projectStatusText}>Status: In progress</Text>
          </View>
        </View>
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 8,
    backgroundColor: "white",
  },
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
    marginBottom: 15,
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

export default HomePageScreen;
