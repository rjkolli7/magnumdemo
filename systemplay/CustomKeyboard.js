import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { useSystemPlayContext } from "./SystemPlayContext";

const CustomKeyboard = ({}) => {
  const { state, dispatch } = useSystemPlayContext();

  const addInputText = (value) => {
    const focusedRow = state.focusedListRowIndex;    
    const listItems = [...state.items];
    const listItem = listItems[focusedRow];
    const inputNumbers = listItem.inputNumbers;
    const hasRoll = inputNumbers?.some((value) => value === "R");    
    const canInputR = hasRoll && value === "R";
    if (
      !canInputR &&
      listItem.focusedInputIndex !== null &&
      listItem.focusedInputIndex < 4
    ) {      
      dispatch({
        payload: {
          inputKeyValue: value,
          focusedRow: focusedRow,
          focusedInputIndex: listItem.focusedInputIndex,
        },
        type: "ADD_INPUT",
      });
    }
  };

  const handleOutsidePress = () => {
    dispatch({
      payload: {
        visible: false,
        focusedRowIndex: null,
        focusedInputIndex: null,
      },
      type: "TOGGLE_KEYBOARD_VISIBILITY",
    });
  };

  const removeInputText = () => {
    const focusedRow = state.focusedListRowIndex;
    if (focusedRow !== null) {
      const listItems = [...state.items];
      const listItem = listItems[focusedRow];
      dispatch({
        payload: {
          focusedRow: focusedRow,
          focusedInputIndex: listItem.focusedInputIndex,
        },
        type: "REMOVE_INPUT",
      });
    }
  };

  const renderKey = (value) => (
    <TouchableOpacity
      key={value}
      onPress={() => (value === "<" ? removeInputText() : addInputText(value))}
      style={[
        styles.key,
        {
          borderRightWidth:
            value === "3" || value === "6" || value === "9" || value === "<"
              ? 2
              : 1,
          borderLeftWidth:
            value === "1" || value === "4" || value === "7" || value === "R"
              ? 2
              : 1,
          borderBottomWidth:
            value === "R" || value === "0" || value === "<" ? 2 : 1,
          borderTopWidth:
            value === "1" || value === "2" || value === "3" ? 2 : 1,
        },
      ]}
    >
      <Text style={styles.keyText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.keyboard}>
      <View style={{ width: "100%", backgroundColor: "#fff" }}>
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            padding: 5,
            marginRight: 10,
            marginBottom: 5,        
            borderRadius: 10,
            borderBlockColor: "#000",
            borderWidth: 1,
          }}
          onPress={() => {handleOutsidePress()}}
        >
          <FontAwesome name="close" size={25} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>{["1", "2", "3"].map(renderKey)}</View>
      <View style={styles.row}>{["4", "5", "6"].map(renderKey)}</View>
      <View style={styles.row}>{["7", "8", "9"].map(renderKey)}</View>
      <View style={styles.row}>{["R", "0", "<"].map(renderKey)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  key: {
    flex: 1,
    flexWrap: "wrap",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    alignContent: "center",
  },
  backspaceKey: {
    padding: 15,
    backgroundColor: "#ff9999", // Change the color for the backspace key
    borderRadius: 5,
  },
  keyText: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default React.memo(CustomKeyboard);
