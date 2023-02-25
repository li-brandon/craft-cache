// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Button,
//   Image,
//   ScrollView,
//   FlatList,
// } from "react-native";
// import React, { useState, createContext, useContext } from "react";
// import { getAuth, signOut } from "firebase/auth";
// import { auth } from "../firebase";
// import Project from "../Components/ProjectsPage/Project";
// import { MyContext } from "../Contexts/MyContext";

// import hat from "../Components/assets/flower-bucket-hat.jpg";

// const UserProfileScreen = ({ navigation, route }) => {
//   // TODO: Verify if the user is logged in or not and display appropriate screen

//   const { projects, setProjects } = useContext(MyContext);

//   return (
//     <View>
//       <Button
//         title="Edit Profile"
//         onPress={() => navigation.navigate("Edit Profile")}
//       />
//       <Image style={styles.image} source={hat} />
//       <Text>Username</Text>
//       <Text>Published Projects:</Text>

//       <ScrollView contentContainerStyle={styles.wrapper}>
//         {/* map over projects and render Project component */}
//         {projects.map((project, index) => (
//           <Project key={index} project={project} navigation={navigation} />
//         ))}
//       </ScrollView>
//     </View>
//   );

//   // // const email = route.params['email'];
//   // const signOutHandler = () => {
//   //     signOut(auth).then(() => {
//   //         console.log('Sign-out successful.');
//   //         navigation.replace('Front Page');
//   //     }).catch((error) => {
//   //         // An error happened.
//   //     });
//   // }
//   // const handleBack = function () {
//   //     navigation.goBack();
//   // }
//   // return (
//   //     <View style={styles.container}>
//   //         <Text>email:{auth.currentUser?.email}</Text>
//   //         <TouchableOpacity
//   //             onPress={signOutHandler}
//   //             style={styles.button}
//   //         >
//   //             <Text style={styles.buttonText}>sign out</Text>
//   //         </TouchableOpacity>
//   //         <TouchableOpacity
//   //             onPress={handleBack}
//   //             style={styles.button}
//   //         >
//   //             <Text style={styles.buttonText}>To Front Page</Text>
//   //         </TouchableOpacity>

//   //     </View >
//   // )
// };

// export default UserProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
//   button: {
//     backgroundColor: "#0728f9",
//     width: "100%",
//     padding: 15,
//     margin: 10,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//   },
// });

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";

const UserProfileScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Edit Profile")}
        style={styles.editProfileButton}
      >
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <Image
        style={styles.profileImage}
        source={{ uri: "https://picsum.photos/200" }}
      />

      <View style={styles.userInfo}>
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.bio}>
          Software Developer | React Native Enthusiast
        </Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>150 Posts</Text>
          <Text style={styles.stat}>10k Followers</Text>
          <Text style={styles.stat}>500 Following</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: "center",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  stat: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
  },
  followButton: {
    backgroundColor: "#3897f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  messageButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  editProfileButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editProfileButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UserProfileScreen;
