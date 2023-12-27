import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import SystemPlayItem from "./SystemPlayItem";
import CustomKeyboard from "./CustomKeyboard";
import { useSystemPlayContext } from "./SystemPlayContext";
import SystemPlayDatesList from "./SystemPlayDatesList";
import { FontAwesome } from "@expo/vector-icons";

const SystemPlayComponent = ({}) => {
  const { state, dispatch } = useSystemPlayContext();
  const flatListRef = useRef(null);
  const [itemsCount, setItemsCount] = useState(0);
  const [visibleUpArrow, setVisibleUpArrow] = useState(false);
  const [visibleDownArrow, setVisibleDownArrow] = useState(false);
  const [visibleDownCount, setVisibleDownCount] = useState(0);
  const [currentVisibleLastIndex, setCurrentVisibleLastIndex] = useState(0);  

  useEffect(() => {
    setItemsCount(state.items.length);
  }, [state]);

  useEffect(() => {
    console.log("itemsCount", itemsCount);
    handleDownArrow();
  }, [itemsCount]);

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

  const handleListScroll = (event) => {
    handleDownArrow();
  };

  const scrollToTop = () => {
    // Scroll to the top of the list
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };


  const handleDownArrow = () => {
    console.log("totalItemsCount In List", itemsCount);
    if (itemsCount > 3 && (itemsCount - 1) > currentVisibleLastIndex) {
      setVisibleDownArrow(true);
      const downItemsCount = (itemsCount - 1) - currentVisibleLastIndex;
      console.log("downItemsCount", currentVisibleLastIndex);
      setVisibleDownCount(downItemsCount);
    } else {
      setVisibleDownArrow(false);
      setVisibleDownCount(0);
    }
  }

  const handleEndReached = ({ distanceFromEnd }) => {
    const threshold = 100;
    if (distanceFromEnd < threshold) {
      // console.log("End Reached");
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    // console.log("Visible items are", viewableItems);
    // console.log("Changed in this iteration", changed);
    const viewableItemsCount = viewableItems.length;
    let lastVisibleIndex = 0;
    if (viewableItemsCount > 0) {
      lastVisibleIndex = viewableItems[viewableItemsCount - 1].index;
      const firstVisibleIndex = viewableItems[0].index;      
      console.log("firstVisibleIndex", firstVisibleIndex);
      console.log("lastVisibleIndex", lastVisibleIndex);
      setVisibleUpArrow(firstVisibleIndex > 0);
      setCurrentVisibleLastIndex(lastVisibleIndex);      
    }
  }, []);

  const addPlayItem = () => {
    console.log(state.items.length);
    dispatch({
      payload: {
        isPermutate: false,
        hasRoll: false,
        hasSameValue: false,
        isDefault: false,
        inputNumbers: ["", "", "", ""],
        inputNumber: "",
        combinations: [],
        focusedInputIndex: null,
      },
      type: "ADD_PLAY",
    });
  };

  const addToCart = () => {
    const updatedItems = [...state.items];
    if (updatedItems !== null && Array.isArray(updatedItems)) {
      const combinationItems = updatedItems.filter(
        (item) => item.inputNumber !== null && item.inputNumber.length > 0
      );
      const selectedDates = state.selectedDatesIndex.map(
        (index) => state.datesList[index]
      );
      if (selectedDates !== null && selectedDates.length > 0) {
        const cartItems = [...state.cartItems];
        selectedDates.forEach((dateObj) => {
          const cartItem = { date: dateObj, combinations: combinationItems };
          cartItems.push(cartItem);
        });
        dispatch({
          payload: {
            cartItems: cartItems,
          },
          type: "Add_ITEMS_CART",
        });
      }
    }
  };
  return (
    // <TouchableWithoutFeedback
    //   onPress={() => {
    //     handleOutsidePress();
    //   }}
    // >
    <View
      style={{
        height: "100%",
      }}
    >
      <View style={styles.container}>
        <Text>Step 1: Select Draw Date(s)</Text>
        <SystemPlayDatesList />
        <Text>Step 2: Enter Your Numbers</Text>
        <View
          style={{
            flexWrap: "wrap",
            height: "40%",
            margin: 8,
          }}
        >
          <FlatList
            ref={flatListRef}
            data={state.items}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={4}
            onScroll={handleListScroll}
            onViewableItemsChanged={onViewableItemsChanged}
            onEndReached={handleEndReached}
            persistentScrollbar={true}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <SystemPlayItem
                itemIndex={index}
                item={item}
                isLastItem={state?.items?.length - 1 == index}
              />
            )}
          />
          {visibleUpArrow && (
            <TouchableOpacity style={styles.upArrowContainer}
            onPress={scrollToTop}>
              <FontAwesome name="arrow-up" size={20} color="white" />
            </TouchableOpacity>
          )}

          {visibleDownArrow && (
            <TouchableOpacity style={styles.downArrowContainer}>
              <FontAwesome name="arrow-down" size={20} color="white" />
              <Text style={{marginTop: 2}}>{visibleDownCount}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              margin: 12,
              backgroundColor: "#ececec",
              borderRadius: 10,
              padding: 8,
              flexWrap: "wrap",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignSelf: "center",
                fontSize: 16,
              }}
            >
              SB:
            </Text>
            <Text
              style={{
                justifyContent: "flex-end",
                alignSelf: "center",
                fontSize: 16,
              }}
            >
              {state.totalSBCount}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              padding: 15,
              flex: 1,
              backgroundColor: "blue",
              margin: 10,
              borderRadius: 10,
              opacity: state.items.length < 50 ? 1 : 0.5,
            }}
            onPress={addPlayItem}
            disabled={state.items.length == 50}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 14 }}>
              + Add Play ({state.items.length}/50)
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: "blue",
            margin: 10,
            borderRadius: 10,
            opacity: state.totalSBCount < 3 ? 0.5 : 1,
          }}
          disabled={state.totalSBCount < 3}
          onPress={() => {
            handleOutsidePress();
            addToCart();
          }}
        >
          <Text
            style={{
              width: "90%",
              color: "white",
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Add to Cart (RM {state.totalPrice})
          </Text>
        </TouchableOpacity>
        <FlatList
          data={state.cartItems}
          persistentScrollbar={true}
          renderItem={({ item }) => <RenderCartItem item={item} />}
        />
      </View>
      {state.isCustomKeyboardVisible && (
        <View style={styles.overlay}>
          <CustomKeyboard />
        </View>
      )}
    </View>
    // </TouchableWithoutFeedback>
  );
};

const RenderCartItem = ({ item }) => {
  const dateObj = item.date;
  const combinations = item.combinations;
  const betLinesList = [];
  let totalPrice = 0;
  combinations.forEach((combination) => {
    totalPrice += combination.price;
    if (
      combination.combinations !== null &&
      combination.combinations.length > 0
    ) {
      let betNumber = "";
      if (combination.isPermutate) {
        betNumber = `${combination.inputNumber} P${combination.combinations.length}`;
      } else if (combination.hasRoll) {
        betNumber = `${combination.inputNumber} R${combination.combinations.length}`;
      }
      betLinesList.push(betNumber);
    } else {
      betLinesList.push(combination.inputNumber);
    }
  });
  const betLineNumbers = betLinesList.join(", ");
  return (
    <View style={{ flexDirection: "row" }}>
      <Text
        style={{
          color: "#000",
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        {dateObj.fullDate}
      </Text>

      <View
        style={{
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <Text
          style={{
            color: "#000",
            marginLeft: 8,
            marginRight: 8,
            fontSize: 12,
            fontWeight: "400",
          }}
        >
          {" "}
          {betLineNumbers}
        </Text>
      </View>

      <View
        style={{
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <Text
          style={{
            color: "#000",
            marginLeft: 8,
            marginRight: 8,
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {" "}
          RM {totalPrice}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    paddingBottom: 10,
    justifyContent: "flex-end",
    bottom: 0,
    backgroundColor: "transparent",
  },
  upArrowContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    elevation: 5,
    borderRadius: 25,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  downArrowContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    elevation: 5,
    borderRadius: 25,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});

export default React.memo(SystemPlayComponent);
