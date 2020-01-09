import React, { useState, useEffect, useReducer } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";

import { ListItem } from "react-native-elements";

import { Audio } from "expo-av";

import { connect } from "react-redux";

import { addConversations } from "../redux/ActionCreator";

import { conversationsLoading } from "../redux/ActionCreator";

import { Loading } from "../components/LoadingComponent";

import appstates from "../constants/AppStates";

import ResultScreen from "./ResultScreen";

import TestScreen from "./TestScreen";

import SelectionScreen from "./SelectionScreen";

import TESTDATA from "../constants/TestData";

const mapStateToProps = state => {
  return {
    conversations: state.conversations
  };
};

const mapDispatchToProps = dispatch => ({
  loadConversations: () => dispatch(conversationsLoading()),
  addNewConversations: conversations =>
    dispatch(addConversations(conversations))
});

function HomeScreen(props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [appstate, setAppstate] = useState(appstates.START);
  const [selectedSentencesIds, setSelectedSentencesIds] = useState([]);
  const [isFinishGatheringSentences, setIsFinishGatheringSentences] = useState(
    false
  );
  const [loadedAudioCounter, SetLoadedAudioCounter] = useState(0);
  const [isLoadAudioFinish, setIsLoadAudioFinish] = useState(false);

  const [currentSelectedSentence, SetCurrentSelectedSentence] = useState();
  const [selectedSentences, setSelectedSentences] = useReducer(
    (selectedSentences, { type, value }) => {
      switch (type) {
        case "add":
          console.log("perform add selectedsentences");
          console.log(
            "2IN  gather selected sentences>: " + selectedSentencesIds
          );
          console.log("Current selected Sentences" + selectedSentences);
          return [...selectedSentences, value];
        case "add_audio":
          console.log("perform add audio object");
          console.log("current counter: " + loadedAudioCounter);
          SetLoadedAudioCounter(loadedAudioCounter + 1);
          return selectedSentences.map(sentence =>
            sentence.id !== value.id
              ? sentence
              : {
                  ...sentence,
                  enAuObj: value.enAuObj,
                  vnAuObj: value.vnAuObj
                }
          );
        default:
          return [...selectedSentences, value];
      }
    },
    []
  );
  const [localConversationsData, SetLocalConversationsData] = useReducer(
    (localConversationsData, { type, value }) => {
      switch (type) {
        case "add":
          return [...localConversationsData, value];
        case "bulk_add":
          console.log("bulk_add: " + value);
          return [...localConversationsData, ...value];
        case "remove":
          return localConversationsData.filter((_, index) => index !== value);
        case "toggle_selected":
          return localConversationsData.map(conversationItem =>
            conversationItem.id !== value
              ? conversationItem
              : {
                  ...conversationItem,
                  selected: !conversationItem.selected
                }
          );
        default:
          return localConversationsData;
      }
    },
    []
  );

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });
    props.loadConversations();
    props.addNewConversations(TESTDATA);
    SetLocalConversationsData({ type: "bulk_add", value: TESTDATA });
    console.log("useEffect: " + TESTDATA);
    return () => {
      selectedSentences.filter(sentence => {
        if (sentence.enAuObj) sentence.enAuObj.unloadAsync();
        if (sentence.vnAuObj) sentence.vnAuObj.unloadAsync();
      });
      console.log("<> Quit HomeScreen");
    };
  }, []);

  //This get triggered when all selectedSentenceIds and selectedSentences data have been loaded
  useEffect(() => {
    console.log("Change selectedSentencesIds");
    console.log(
      "2 IsFinishGatheringSentences status: " + isFinishGatheringSentences
    );
    if (isFinishGatheringSentences) {
      console.log("gather selected sentences>: " + selectedSentencesIds);
      loadAllAudio();
    }
  }, [selectedSentencesIds]);

  useEffect(() => {
    console.log("Change isFinishGatheringSentences");
  }, [isFinishGatheringSentences]);

  useEffect(() => {
    if (isLoadAudioFinish) {
      console.log("Run get triggered with currentQuestionIndex");
      getCurrentSelectedSentence();
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    console.log(
      "Run final: currentSelectedSentence: " + currentSelectedSentence
    );
    console.log("Run final: isLoadAudioFinish: " + isLoadAudioFinish);
    if (currentSelectedSentence && isLoadAudioFinish) {
      console.log("CurrentSelectedSentence: " + currentSelectedSentence);
      console.log("start testing.....");
      setAppstate(appstates.TEST);
    }
  }, [currentSelectedSentence, isLoadAudioFinish]);

  useEffect(() => {
    if (isLoadAudioFinish) {
      console.log("Sentences after add audio: " + selectedSentences);
      selectedSentences.filter(sentence => console.log(sentence));
      getCurrentSelectedSentence();
    }
  }, [selectedSentences]);

  useEffect(() => {
    console.log(
      "Check counter: loadedAudioCounter> " +
        loadedAudioCounter +
        " selectedCountLength> " +
        selectedSentences.length
    );
    if (
      loadedAudioCounter > 0 &&
      loadedAudioCounter === selectedSentences.length
    ) {
      setIsLoadAudioFinish(true);
    }
  }, [loadedAudioCounter]);

  function changeAppState(newState) {
    setAppstate(newState);
  }

  function startTesting() {
    console.log("<> Start gathering");
    gatherAllSelectedSentences();
    console.log("<> After gathering and start set Finish");

    console.log("Check again for sentencesIds: " + selectedSentencesIds);
    console.log("Check again for sentences: " + selectedSentences);

    setIsFinishGatheringSentences(true);
    console.log(
      "IsFinishGatheringSentences Value: " + isFinishGatheringSentences
    );
  }

  function resetAppState() {
    setCurrentQuestionIndex(0);
    setIsFinishGatheringSentences(false);
    changeAppState(appstates.START);
  }

  function moveToNextQuestion() {
    if (currentQuestionIndex < selectedSentencesIds.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else resetAppState();
  }

  async function loadAllAudio() {
    selectedSentences.filter(async sentence => {
      const sourceEn = { uri: sentence.enAu };
      const sourceVn = { uri: sentence.vnAu };

      const initialStatus = {
        shouldPlay: false,
        rate: 1.0,
        shouldCorrectPitch: true,
        volume: 1.0,
        isMuted: false,
        isLooping: 1
        // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
        // androidImplementation: 'MediaPlayer',
      };

      console.log("EnAudioLink to load: " + sentence.enAu);

      const { sound: soundEnObject, status } = await Audio.Sound.createAsync(
        sourceEn,
        initialStatus,
        (onPlaybackStatusUpdate = null),
        (downloadFirst = true)
      );

      const { sound: soundVnObject, status1 } = await Audio.Sound.createAsync(
        sourceVn,
        initialStatus,
        (onPlaybackStatusUpdate = null),
        (downloadFirst = true)
      );

      setSelectedSentences({
        type: "add_audio",
        value: {
          id: sentence.id,
          enAuObj: soundEnObject,
          vnAuObj: soundVnObject
        }
      });
      console.log("EnAudioObj loaded: " + soundEnObject);
    });
  }

  function getCurrentSelectedSentence() {
    // var currentSelected = localConversationsData.filter(conversationItem =>
    //   conversationItem.sentences.filter(sentence => {
    //     if (sentence.id == selectedSentencesIds[currentQuestionIndex]) {
    //       SetCurrentSelectedSentence(sentence);
    //     }
    //   })
    // );
    console.log("run getcurrentSelelected Sentence");
    selectedSentences.filter(sentence => {
      console.log("Check to choose sentence [SentenceId] " + sentence.id);
      console.log(
        "Cehck to choose sentence [selectedSentencesIds] " +
          currentQuestionIndex
      );
      if (sentence.id == selectedSentencesIds[currentQuestionIndex]) {
        SetCurrentSelectedSentence(sentence);
        console.log("has been chosen");
      }
    });
  }

  function gatherAllSelectedSentences() {
    localConversationsData.filter(conversationItem => {
      if (conversationItem.selected) {
        console.log("has selected conversation");
        conversationItem.sentences.filter(sentence => {
          if (!selectedSentencesIds.some(item => item.id == sentence.id)) {
            console.log("has sentence to add " + sentence.id);

            setSelectedSentencesIds(selectedSentencesIds => [
              ...selectedSentencesIds,
              sentence.id
            ]);
            // setSelectedSentences(selectedSentences=>[...selectedSentences,sentence]);
            setSelectedSentences({ type: "add", value: sentence });
            console.log("ater add sentence: " + selectedSentencesIds);
          }
        });
      }
    });
  }

  function toggleConversationSelected(conversation_id) {
    SetLocalConversationsData({
      type: "toggle_selected",
      value: conversation_id
    });
  }

  function mainRender() {
    switch (appstate) {
      case appstates.START:
        return renderStartScreen();

      case appstates.TEST:
        if (currentQuestionIndex >= selectedSentencesIds.length)
          resetAppState();
        else
          return (
            <TestScreen
              question={currentSelectedSentence}
              changeState={changeAppState}
              setAnswer={setUserAnswer}
            />
          );
      case appstates.RESULT:
        return (
          <ResultScreen
            question={currentSelectedSentence}
            changeState={changeAppState}
            userAnswer={userAnswer}
            moveToNextQuestion={moveToNextQuestion}
          />
        );

      default:
        return <Text>Undefined State</Text>;
    }
  }

  const renderStartScreen = () => (
    <View style={styles.container}>
      <SelectionScreen
        toggleConversationSelected={toggleConversationSelected}
        conversations={localConversationsData}
      />
      <View style={styles.welcomeContainer}>
        <Image
          source={
            __DEV__
              ? require("../assets/images/robot-dev.png")
              : require("../assets/images/robot-prod.png")
          }
          style={styles.welcomeImage}
        />
      </View>

      <TouchableOpacity onPress={() => startTesting()}>
        <Text>Start Testing</Text>
      </TouchableOpacity>

      <Text style={styles.welcome}>Welcome to React Native! kkk :) :D</Text>
    </View>
  );

  return mainRender();
}

// HomeScreen.navigationOptions = {
//   header: null,
// };

HomeScreen.navigationOptions = {
  title: "HomeScreen"
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
