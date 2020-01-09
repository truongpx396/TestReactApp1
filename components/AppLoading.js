import React, { Component, useState, useEffect } from "react";
import { Platform, StyleSheet, Text, View, StatusBar } from "react-native";
import { Loading } from "./LoadingComponent";

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // animate();

    const fetchData = async () => {
      await props.startAsync();

      props.onFinish();

      //props.onError();
    };
    fetchData();
  }, []);

  if (!isLoadingComplete) {
    return <Loading />;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
      </View>
    );
  }
}
