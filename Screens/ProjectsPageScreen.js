import { ScrollView, StyleSheet, Modal } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";
import { TouchableOpacity } from "react-native";
import { Component } from "react";
import { CheckBox } from "@rneui/themed";
import { View, TextField, Text, TouchableWithoutFeedback } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";

function ProjectsPageScreen({ navigation }) {
  const { projects, setProjects } = useContext(MyContext);
  const [currentUser, setCurrentUser] = useState(null);

  const [knitting, setKnitting] = useState(true);
  const [crochet, setCrochet] = useState(true);
  const [sewing, setSewing] = useState(true);
  const [embroidery, setEmbroidery] = useState(true);
  const [weaving, setWeaving] = useState(true);
  const [tailoring, setTailoring] = useState(true);
  const [other, setOther] = useState(true);
  const [posted, setPosted] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef();

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
        const tempProjects = [];
        const typeValues = [];

        if (knitting) typeValues.push("Knitting");
        if (crochet) typeValues.push("Crochet");
        if (sewing) typeValues.push("Sewing");
        if (embroidery) typeValues.push("Embroidery");
        if (weaving) typeValues.push("Weaving");
        if (tailoring) typeValues.push("Tailoring");
        if (other) typeValues.push("Other");

        if (typeValues.length === 0) {
          setProjects([]);
          return;
        }
        const q = query(
          collection(db, "projects"),
          where("userID", "==", userID),
          where("type", "array-contains-any", typeValues)
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
    }, [
      currentUser,
      knitting,
      crochet,
      sewing,
      embroidery,
      weaving,
      tailoring,
      other,
    ])
  );

  const handleOutsideClick = () => {
    setModalVisible(false);
  };

  const handleClearPressed = () => {
    setKnitting(false);
    setCrochet(false);
    setSewing(false);
    setEmbroidery(false);
    setWeaving(false);
    setTailoring(false);
    setOther(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome
          // filter with the lines icon
          name="filter"
          size={24}
          color="black"
          style={styles.barsIcon}
          onPress={() => setModalVisible(true)}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <View style={styles.modalContainer} ref={modalRef}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalText}>Sort By</Text>
                {/* clear button */}
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearPressed}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {/* <CheckBox
                center
                wrapperStyle={{ marginBottom: -10}}
                title="posted"
                checked={posted}
                onPress={() => setIsPosted(!posted)}
              /> */}
              <CheckBox
                center
                wrapperStyle={{ marginBottom: -10 }}
                textStyle={{ fontSize: 16 }}
                title="Knitting"
                checked={knitting}
                onPress={() => setKnitting(!knitting)}
              />
              <CheckBox
                center
                wrapperStyle={{ marginBottom: -10 }}
                textStyle={{ fontSize: 16 }}
                title="Crochet"
                checked={crochet}
                onPress={() => setCrochet(!crochet)}
              />
              <CheckBox
                center
                wrapperStyle={{ marginBottom: -10 }}
                textStyle={{ fontSize: 16 }}
                title="Sewing"
                checked={sewing}
                onPress={() => setSewing(!sewing)}
              />
              <CheckBox
                center
                wrapperStyle={{ marginBottom: -10 }}
                textStyle={{ fontSize: 16 }}
                title="Embroidery"
                checked={embroidery}
                onPress={() => setEmbroidery(!embroidery)}
              />
              <CheckBox
                center
                wrapperStyle={{ marginBottom: -10 }}
                textStyle={{ fontSize: 16 }}
                title="Weaving"
                checked={weaving}
                onPress={() => setWeaving(!weaving)}
              />
              <CheckBox
                center
                wrapperStyle={{ marginBottom: -10 }}
                textStyle={{ fontSize: 16 }}
                title="Tailoring"
                checked={tailoring}
                onPress={() => setTailoring(!tailoring)}
              />
              <CheckBox
                center
                wrapperStyle={{ marginBottom: -10 }}
                textStyle={{ fontSize: 16 }}
                title="Other"
                checked={other}
                onPress={() => setOther(!other)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView>
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
  iconContainer: {
    flexDirection: "row-reverse",
    width: "100%",
    marginTop: 5,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    height: "48%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "left",
    shadowColor: "#000",
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
  },

  checkbox: {
    marginBottom: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  clearButton: {
    backgroundColor: "#dcdcdc",
    borderRadius: 15,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 2,
    width: 60,
    marginTop: -8,
  },
  clearButtonText: {
    fontSize: 17,
    color: "#000",
  },
});

export default ProjectsPageScreen;
