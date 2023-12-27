import React, { memo, useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import CheckBox from "expo-checkbox";
import { FontAwesome } from "@expo/vector-icons";
import { useSystemPlayContext } from "./SystemPlayContext";
import * as Animatable from "react-native-animatable";
import { generateRandom4DigitNumber } from "./SystemPlayUseCases";

const SystemPlayItem = memo(({ isLastItem, itemIndex, item }) => {  
  const { state, dispatch } = useSystemPlayContext();

  const removePlayItem = () => {
    dispatch({
      payload: {
        index: itemIndex,
      },
      type: "REMOVE_PLAY",
    });
  };

  const setRandomNumber = () => {
    const inputNumbers = generateRandomNumbers();
    const combinedInput = inputNumbers.join("");
    dispatch({
      payload: {
        focusedRow: itemIndex,
        inputNumbers: inputNumbers,
        inputNumber: combinedInput,
      },
      type: "INPUT_RANDOM_NUMBER",
    });
  };

  const setPermute = () => {
    dispatch({
      payload: {
        permutateIndex: itemIndex,
        isPermutate: !item.isPermutate,
      },
      type: "PERMUTE",
    });
  };

  const generateRandomNumbers = () => {
    return generateRandom4DigitNumber([...item.inputNumbers]);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.otpInputContainer}>
          {[0, 1, 2, 3].map((inputIndex) => (
            <RenderSubItem
              key={inputIndex}
              index={inputIndex}
              row={itemIndex}
              showCursor={
                state.focusedListRowIndex == itemIndex &&
                item.focusedInputIndex == inputIndex
              }
            />
          ))}
        </View>
        <View>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              {
                opacity: item.hasRoll || item.isSameValue ? 0.5 : 1,
              },
            ]}
            onPress={setPermute}
            disabled={item.hasRoll || item.isSameValue}
          >
            <CheckBox
              style={styles.checkbox}
              value={item.isPermutate}
              onValueChange={setPermute}
              disabled={item.hasRoll || item.isSameValue}
            />
            <Text style={styles.checkboxText}>Permutate</Text>
          </TouchableOpacity>
          {!item.isDefault && (
            <TouchableOpacity
              style={{
                marginLeft: 8,
              }}
              onPress={removePlayItem}
            >
              <FontAwesome name="trash-o" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.diceCardContainer,
            {
              opacity: item.isPermutate ? 0.5 : 1,
            },
          ]}
          disabled={item.isPermutate}
          onPress={setRandomNumber}
        >
          <Image
            source={require("../assets/dice.png")}
            style={[styles.diceImage, {}]}
          />
          <Text style={styles.diceText}>Lucky Draw</Text>
        </TouchableOpacity>
      </View>
      {!isLastItem && (
        <View
          style={{
            flexDirection: "row",
            margin: 8,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Text style={styles.plusText}>+</Text>
          </View>
          <View
            style={{
              flex: 0.8,
            }}
          />
        </View>
      )}
    </View>
  );
}, areEqual);

const areEqual = (prevProps, nextProps) => {
  // Compare the relevant properties for equality
  return (
    prevProps.isPermutate === nextProps.isPermutate &&
    prevProps.hasRoll === nextProps.hasRoll &&
    prevProps.hasSameValue === nextProps.hasSameValue &&
    prevProps.isDefault === nextProps.isDefault &&
    // Compare arrays using JSON.stringify for simplicity (assuming no nested objects)
    JSON.stringify(prevProps.inputNumbers) === JSON.stringify(nextProps.inputNumbers) &&
    prevProps.inputNumber === nextProps.inputNumber &&
    // Check if combinations are equal (you may need a custom comparison logic)
    JSON.stringify(prevProps.combinations) === JSON.stringify(nextProps.combinations) &&
    prevProps.focusedInputIndex === nextProps.focusedInputIndex &&
    prevProps.sbCount === nextProps.sbCount &&
    prevProps.price === nextProps.price
  );
};

const RenderSubItem = ({ row, index, showCursor }) => {
  const { state, dispatch } = useSystemPlayContext();
  const [textRefWidth, setTextRefWidth] = useState(0);
  const textRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (textRef?.current) {
      textRef.current.measure((x, y, width, height, pageX, pageY) => {
        setTextRefWidth(width);
      });
    }
  }, [textRef]);

  useEffect(() => {
    if (state.items.length > 0 && index > -1) {
      const item = state.items[row];
      const inputNumber = item.inputNumbers[index];
      setInputValue(inputNumber);
    }
  }, [state]);

  const showKeyboard = () => {
    // if (!state.isCustomKeyboardVisible) {
    dispatch({
      payload: {
        visible: true,
        focusedRowIndex: row,
        focusedInputIndex: index,
      },
      type: "TOGGLE_KEYBOARD_VISIBILITY",
    });
    // }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}      
      onPress={showKeyboard}
      style={{
        elevation: 0,
      }}
    >
      <View style={styles.otpContainer}>
        <Text style={styles.otpInput}>{inputValue}</Text>
        {/* <TextInput
          ref={textRef}
          style={styles.otpInput}
          value={inputValue}
          maxLength={1}
          editable={true}
          // onFocus={() => {
          //   Keyboard.dismiss();
          //   showKeyboard();
          // }}
        /> */}
        {showCursor && (
          <Animatable.View
            animation="fadeIn"
            iterationCount="infinite"
            duration={1000}
            style={
              textRefWidth === 0
                ? styles.otpCursor
                : [styles.otpCursor, { right: textRefWidth }]
            }
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  otpInputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  otpContainer: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderRadius: 8,
    textAlign: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 2.5,
    elevation: 5,
    alignSelf: "center",
    justifyContent: "center",
    margin: 5, // Add padding to the input
  },
  otpInput: {
    fontSize: 16,
    alignSelf: "center",
    color: "black",
  },
  otpCursor: {
    position: "absolute",
    top: 15,
    bottom: 15,
    width: 2,
    alignSelf: "center",
    backgroundColor: "blue",
  },
  plusText: {
    width: "100%",
    fontSize: 30,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 10,
  },
  diceText: {
    fontSize: 9,
    marginTop: 5,
    fontWeight: "700",
  },
  checkbox: {
    margin: 8,
    width: 15,
    height: 15,
    maxHeight: 15,
    maxWidth: 15,
  },
  diceCardContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    marginLeft: 5,
    padding: 5,
    height: 50,
    width: 70,
  },
  diceImage: {
    width: 30,
    height: 25,
  },
});

export default SystemPlayItem;
