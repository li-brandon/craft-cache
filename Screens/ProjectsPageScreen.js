import { ScrollView, StyleSheet, AsyncStorage } from "react-native";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";
import { TouchableOpacity } from "react-native";
import { Component } from 'react';
import { CheckBox } from '@rneui/themed';
// import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, TextField, Text, Button, Colors } from 'react-native';
import { collection, getDocs, query, where } from "firebase/firestore";
// import { Checkox } from '@react-native-community/checkbox;
function ProjectsPageScreen({ navigation }) {
  const { projects, setProjects } = useContext(MyContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [posted, setIsPosted] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(["Embroidery", "Crochet", "Knitting", "Sewing"]);
  //drop down 
  const [typeDropDownIsOpen, setTypeDropDownIsOpen] = useState(false);
  const [toolsDropDownIsOpen, setToolsDropDownIsOpen] = useState(false);
  const [materialsDropDownIsOpen, setMaterialsDropDownIsOpen] = useState(false);
  const [typeValues, setTypeValues] = useState([]);
  const [toolsValues, setToolsValues] = useState([]);
  const [materialsValues, setMaterialsValues] = useState([]);

  const [typeItems, setTypeItems] = useState([
    { label: "Knitting", value: "Knitting" },
    { label: "Crochet", value: "Crochet" },
    { label: "Sewing", value: "Sewing" },
    { label: "Embroidery", value: "Embroidery" },
    // { label: "Weaving", value: "Weaving" },
    // { label: "Tailoring", value: "Tailoring" },
    // { label: "Other", value: "Other" },
  ]);

  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   console.log(typeValues.length)
  //   if (typeValues.length == 0) {
  //     setTypeValues(["Embroidery", "Crochet", "Knitting", "Sewing"]);
  //   }
  //   console.log("typeValues", typeValues);
  //   console.log("typeItems", typeItems);
  // }, [typeValues]);


  const TypeValueHandler = async (value) => {
    if (value.length == 0) {
      await setTypeValues(["Embroidery", "Crochet", "Knitting", "Sewing"]);
    } else {
      await setTypeValues(value);
    }

    console.log("typeValues", typeValues);
  }
  // useFocusEffect is similar to useEffect, but it is called when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        const userID = currentUser.uid;
        const tempProjects = [];
        // console.log(typeValues.length)
        // if (typeValues.length == 0) {
        //   setTypeValues(["Embroidery", "Crochet", "Knitting", "Sewing"]);
        // }
        const q = query(
          collection(db, "projects"),
          where("userID", "==", userID),
          where("posted", "==", posted),
          // where("type", "array-contains", "Embroidery"),
          where("type", "array-contains-any", typeValues.length != 0 ? typeValues : ["Embroidery", "Crochet", "Knitting", "Sewing"]),
        );

        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            tempProjects.push({ ...doc.data(), id: doc.id });
          });
          setProjects(tempProjects);
        });
      } else {
        setProjects([]); // clear projects since there is no user
      }
    }, [currentUser, posted, typeValues])
  );
  return (
    <View style={styles.container}>
      <View
        style={{ flex: 1, height: 50 }}
      >
        <DropDownPicker
          open={typeDropDownIsOpen}
          value={typeValues}
          items={typeItems}
          placeholder={"Select a type"}
          setOpen={setTypeDropDownIsOpen}
          setValue={TypeValueHandler}
          setItems={setTypeItems}
          multiple={true}
          mode="BADGE"
          showBadgeDot={false}
          maxHeight={130}
          listMode="SCROLLVIEW"
          listItemContainerStyle={{ height: 30 }}
        />
      </View>
      <CheckBox
        center
        title="posted"
        checked={posted}
        onPress={() => setIsPosted(!posted)}
      />
      {/* <CheckBox
        center
        title="Embroidery"
        checked={categoryFilter == ["Embroidery"]}
        onPress={() => setIsPosted(!posted)}
      /> */}
      {/* <Button label={'Press'}
        onPress={() => setIsPosted(!posted)}
        title={posted ? "posted" : "unposted"} ></Button> */}
      <Button label={'Press'}
        onPress={() => setCategoryFilter(["Embroidery"])}
        title="Embroidery" ></Button>
      <Button label={'Press'}
        onPress={() => setCategoryFilter(["Sewing"])}
        title="Sewing" ></Button>
      <Button label={'Press'}
        onPress={() => setCategoryFilter(["Embroidery", "Crochet", "Knitting", "Sewing"])}
        title="All" ></Button>

      <ScrollView style={styles.container}>
        {projects.map((project, index) => (
          <Project key={index} project={project} navigation={navigation} />
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

export default ProjectsPageScreen;
