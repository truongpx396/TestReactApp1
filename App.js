import React, { Component, useState } from "react";
import { Platform, StyleSheet, Text, View, StatusBar } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import AppLoading from "./components/AppLoading";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";
import { PersistGate } from "redux-persist/es/integration/react";
import { Loading } from "./components/LoadingComponent";

import {
  Asset,
  Constants,
  FileSystem,
  Permissions
} from "react-native-unimodules";

import * as Font from "expo-font";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const { persistor, store } = ConfigureStore();

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <View style={styles.container}>
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/play_button.png"),
      require("./assets/images/pause_button.png"),
      require("./assets/images/stop_button.png"),
      require("./assets/images/forward_button.png"),
      require("./assets/images/back_button.png"),
      require("./assets/images/loop_all_button.png"),
      require("./assets/images/loop_one_button.png"),
      require("./assets/images/muted_button.png"),
      require("./assets/images/unmuted_button.png"),
      require("./assets/images/track_1.png"),
      require("./assets/images/thumb_1.png"),
      require("./assets/images/thumb_2.png"),
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
