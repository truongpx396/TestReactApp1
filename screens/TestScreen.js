import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";

import { Audio } from "expo-av";

import appstates from "../constants/AppStates";

import Icon from "react-native-vector-icons/FontAwesome";

export default function TestScreen(props) {
  const [value, onChangeText] = useState("");
  const [soundObject, SetSoundObject] = useState();

  useEffect(() => {
    const loadSound = async () => {
      console.log(props.question);
      console.log(props.question.vnAu);
      // console.log(props.question.enAuObj);

      SetSoundObject(props.question.vnAuObj);
    };

    console.log("<> Start TestScreen");

    loadSound();

    return () => {
      //unmount();
      console.log("<> Quit TestScreen");
    };
    // animate();
  }, []);

  useEffect(() => {
    if (soundObject) {
      console.log("Play sound object");
      console.log(soundObject);
      soundObject.replayAsync();
    }
  }, [soundObject]);

  function unmount() {
    // if (soundObject != null) soundObject.unloadAsync();
  }

  async function handleSoundPress() {
    try {
      //await soundObject.playAsync();
      await soundObject.replayAsync();
      console.log("handle play");
      // Your sound is playing!
    } catch (error) {
      console.log("handle play error " + error);
      // An error occurred!
    }
  }

  async function handleCheckResult() {
    unmount();
    props.setAnswer(value);
    props.changeState(appstates.RESULT);
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <View style={styles.mainContent}>
        <View style={styles.soundContainer}>
          <TouchableOpacity onPress={() => handleSoundPress()}>
            <Icon
              name={"music"}
              size={26}
              style={{ marginBottom: -3 }}
              color={"blue"}
            />
          </TouchableOpacity>
          <Text>Hint Text</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              minHeight: 100,
              height: "auto"
            }}
            onChangeText={text => onChangeText(text)}
            multiline={true}
            numberOfLines={4}
            placeholder="Type here to translate!"
            maxLength={120}
            value={value}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "green",
            padding: 10,
            alignItems: "center"
          }}
          onPress={() => handleCheckResult()}
        >
          <Text style={{ color: "white" }}>Check Result</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "yellow"
  },
  soundContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10
  }
});
