import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import React, {
  useState,
  useEffect,
  createContext,
  Button,
  useContext,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import Inventory from "../Components/InventoryPage/Inventory";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";

import { collection, getDocs, query, where } from "firebase/firestore";
import AddInventoryScreen from "./AddInventoryScreen";

function InventoryPageScreen({ navigation }) {
  const { inventory, setInventory } = useContext(MyContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // useFocusEffect is similar to useEffect, but it is called when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        const userID = currentUser.uid;
        const tempInventory = [];

        const q = query(
          collection(db, "inventory"),
          where("userID", "==", userID)
        );
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            tempInventory.push({ ...doc.data(), id: doc.id });
          });
          setInventory(tempInventory);
        });
      } else {
        setInventory([]); // clear inventory since there is no user
      }
    }, [currentUser])
  );

  return (
    // TODO: Change ScrollView to FlatList
    <View style={outerStyles.container}>
      <TouchableOpacity
        style={outerStyles.button}
        onPress={() => {
          navigation.navigate("Add Inventory");
        }}
      >
        <Text style={outerStyles.buttonText}>Add Inventory</Text>
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        {/* map over inventory and render Inventory component */}
        {inventory.map((inventoryItem, index) => (
          <Inventory
            key={index}
            inventoryItem={inventoryItem}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
});

const outerStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "#0FDB53",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default InventoryPageScreen;

// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Animated,
//   PanResponder,
//   StyleSheet,
// } from "react-native";

// const SlideToDelete = () => {
//   const pan = useRef(new Animated.ValueXY()).current;
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponderCapture: () => true,
//       onPanResponderMove: Animated.event(
//         [
//           null,
//           { dx: pan.x }, // Update pan.x as the user swipes
//         ],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: () => {
//         // Add logic here for when the swipe is released, e.g. trigger delete action
//         // You can use the value of pan.x to determine if the swipe was enough to trigger the delete action
//         // Reset the pan value after the swipe is released
//         Animated.spring(pan, {
//           toValue: { x: 0, y: 0 },
//           useNativeDriver: false,
//         }).start();
//       },
//     })
//   ).current;

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[styles.itemContainer, { transform: [{ translateX: pan.x }] }]} // Apply translation to the item based on pan.x value
//         {...panResponder.panHandlers} // Pass panHandlers to enable pan gestures
//       >
//         <TouchableOpacity onPress={() => console.log("Item clicked")}>
//           <Text style={styles.itemText}>Swipe to delete</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   itemContainer: {
//     backgroundColor: "red",
//     height: 50,
//     justifyContent: "center",
//     paddingHorizontal: 16,
//   },
//   itemText: {
//     color: "white",
//     fontSize: 18,
//   },
// });

// export default SlideToDelete;
