import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";

import { ListItem, CheckBox } from "react-native-elements";

import { Loading } from "../components/LoadingComponent";

function SelectionScreen(props) {
  const renderConversationItem = ({ item, index }) => {
    return (
      <View>
        <ListItem
          key={index}
          title={item.title}
          subtitle={item.body}
          leftAvatar={{
            source: {
              uri:
                "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1551208882-samsung-galaxy-s10e-smartphone-1550695757.jpg"
            }
          }}
        />
        <CheckBox
          title="Click Here"
          checked={item.selected}
          onPress={() => props.toggleConversationSelected(item.id)}
        />
      </View>
    );
  };

  const renderList = () => {
    if (props.conversations && props.conversations.length > 0)
      return (
        <FlatList
          style={{ width: 300, height: 300 }}
          data={props.conversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id.toString()}
        />
      );
    else return <Loading />;
  };

  return renderList();
}

// HomeScreen.navigationOptions = {
//   header: null,
// };

SelectionScreen.navigationOptions = {
  title: "SelectionScreen"
};

export default SelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
