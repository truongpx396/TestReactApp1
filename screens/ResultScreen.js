import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import appstates from "../constants/AppStates";

import Icon from "react-native-vector-icons/FontAwesome";

import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Audio } from "expo-av";

export default function ResultScreen(props) {
  [isSoundLoaded, SetSoundLoaded] = useState(false);
  [soundEnObject, SetSoundEnObject] = useState();
  [soundVnObject, SetSoundVnObject] = useState();
  [isEnableComponent, SetIsEnableComponent] = useState(true);

  useEffect(() => {
    const loadSound = async () => {
      // const sourceEn = { uri: props.question.enAu };
      // const sourceVn = { uri: props.question.vnAu };

      // const { sound: soundEnObject, status } = await Audio.Sound.createAsync(
      //   sourceEn,
      //   (initialStatus = {}),
      //   (onPlaybackStatusUpdate = null),
      //   (downloadFirst = true)
      // );

      // const { sound: soundVnObject, status1 } = await Audio.Sound.createAsync(
      //   sourceVn,
      //   (initialStatus = {}),
      //   (onPlaybackStatusUpdate = null),
      //   (downloadFirst = true)
      // );

      SetSoundLoaded(true);
      SetSoundEnObject(props.question.enAuObj);
      SetSoundVnObject(props.question.vnAuObj);
    };

    console.log("<> Start ResultScreen");
    loadSound();

    return () => {
      // soundEnObject.unloadAsync();
      // soundVnObject.unloadAsync();
      console.log("<> Quit ResultScreen");
    };
  }, []);

  useEffect(() => {
    if (isSoundLoaded) {
      soundEnObject.replayAsync();
    }
  }, [soundEnObject]);

  function handleVnSoundPress() {
    if (!isSoundLoaded) return;
    try {
      soundVnObject.stopAsync();
      soundEnObject.replayAsync();
      console.log("handle play");
    } catch (error) {
      console.log("handle play error");
    }
  }

  function handleEnSoundPress() {
    if (!isSoundLoaded) return;
    try {
      soundEnObject.stopAsync();
      soundVnObject.replayAsync();
      console.log("handle play");
    } catch (error) {
      console.log("handle play error");
    }
  }

  function unmount() {
    SetIsEnableComponent(false);
    if (soundEnObject != null) soundEnObject.unloadAsync();
    if (soundVnObject != null) soundVnObject.unloadAsync();
  }

  function handleReTest() {
    unmount();
    props.changeState(appstates.TEST);
  }

  function handleNextTest() {
    unmount();
    props.moveToNextQuestion();
  }

  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <View style={styles.mainContent}>
        <View style={{ margin: 10 }}>
          <Text
            style={{
              color: "red",
              textDecorationStyle: "solid",
              alignSelf: "center"
            }}
          >
            Your Answer
          </Text>
          <Text style={{ backgroundColor: "yellow", padding: 10 }}>
            {isEnableComponent && props.userAnswer}
          </Text>
        </View>

        <View style={{ margin: 10 }}>
          <Text
            style={{
              color: "green",
              textDecorationStyle: "solid",
              alignSelf: "center"
            }}
          >
            Actual Result
          </Text>
          <Text
            style={{ backgroundColor: "cyan", color: "green", padding: 10 }}
          >
            {isEnableComponent && props.question.enTxt}
          </Text>
        </View>

        <View style={styles.soundContainer}>
          <TouchableOpacity onPress={() => handleVnSoundPress()}>
            <Icon name={"music"} size={26} color={"blue"} />
            <Text>VnAu</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleEnSoundPress()}>
            <Icon name={"music"} size={26} color={"blue"} />
            <Text>EnAu</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleReTest()}>
            <MIcon name={"replay"} size={26} color={"blue"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleNextTest()}
          style={{
            backgroundColor: "yellow",
            margin: 10,
            padding: 15,
            alignItems: "center"
          }}
        >
          <MIcon name={"skip-next"} size={26} color={"blue"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "green",
            padding: 10,
            alignItems: "center"
          }}
          onPress={() => props.changeState(appstates.START)}
        >
          <Text style={{ color: "white" }}>Go to sTART</Text>
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
    padding: 5
  },
  soundContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10
  }
});
