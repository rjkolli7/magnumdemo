import React, { createContext, useReducer, useContext } from "react";
import {
  getTotalPrice,
  getTotalSbCount,
  updateInputsByFocusedInputIndex,
  updateItemPermutation,
  updateRandomNumber,
} from "./SystemPlayUseCases";

// Create the context
const SystemPlayContext = createContext();

const defaultItems = Array(3).fill({
  isPermutate: false,
  hasRoll: false,
  hasSameValue: false,
  isDefault: true,
  inputNumbers: ["", "", "", ""],
  inputNumber: "",
  combinations: [],
  focusedInputIndex: null,
  sbCount: 0,
  price: 0,
});

// Initial state
const initialState = {
  items: [...defaultItems],
  focusedListRowIndex: null,
  isCustomKeyboardVisible: false,
  selectedDatesIndex: [0],
  datesList: [
    { weekName: "WED", date: "06/09", fullDate: "06/09/2023" },
    { weekName: "SAT", date: "09/09", fullDate: "09/09/2023" },
    { weekName: "SUN", date: "10/09", fullDate: "10/09/2023" },
    { weekName: "TUE", date: "12/09", fullDate: "12/09/2023" },
    { weekName: "WED", date: "13/09", fullDate: "13/09/2023" },
    { weekName: "SAT", date: "16/09", fullDate: "16/09/2023" },
  ],
  totalPrice: 0,
  totalSBCount: 0,
  cartItems: [],
};

const systemPlayReducer = (state, action) => {
  const updatedItems = [...state.items];
  switch (action.type) {
    case "ADD_PLAY": {
      updatedItems.push(action.payload);
      return { ...state, items: updatedItems };
    }
    case "REMOVE_PLAY": {
      const { index } = action.payload;
      updatedItems.splice(index, 1);
      const totalPrice = getTotalPrice(
        state.selectedDatesIndex.length,
        updatedItems
      );
      const totalSbCount = getTotalSbCount(updatedItems);
      return {
        ...state,
        items: updatedItems,
        totalPrice: totalPrice,
        totalSBCount: totalSbCount,
      };
    }
    case "PERMUTE": {
      const { permutateIndex, isPermutate } = action.payload;
      // updatedItems[permutateIndex] = {
      //   ...updatedItems[permutateIndex],
      //   isPermutate: isPermutate,
      // };
      const items = state.items.map((item, index) =>
        index === permutateIndex
          ? updateItemPermutation(item, isPermutate)
          : item
      );
      const totalPrice = getTotalPrice(state.selectedDatesIndex.length, items);
      const totalSbCount = getTotalSbCount(items);

      return {
        ...state,
        items: items,
        totalPrice: totalPrice,
        totalSBCount: totalSbCount,
      };
    }
    case "TOGGLE_KEYBOARD_VISIBILITY": {
      const { visible, focusedRowIndex, focusedInputIndex } = action.payload;
      const updatedItems = [...state.items];
      updatedItems[focusedRowIndex] = {
        ...updatedItems[focusedRowIndex],
        focusedInputIndex: focusedInputIndex,
      };
      return {
        ...state,
        isCustomKeyboardVisible: visible,
        focusedListRowIndex: focusedRowIndex,
        items: updatedItems,
      };
    }
    case "UPDATE_DATE": {
      const { dates } = action.payload;
      const items = state.items;
      const totalPrice = getTotalPrice(dates.length, items);
      const totalSbCount = getTotalSbCount(items);
      return {
        ...state,
        selectedDatesIndex: dates,
        totalPrice: totalPrice,
        totalSBCount: totalSbCount,
      };
    }
    case "ADD_INPUT": {
      const { inputKeyValue, focusedRow, focusedInputIndex } = action.payload;
      const items = state.items.map((item, index) =>
        index === focusedRow
          ? updateInputsByFocusedInputIndex(
              item,
              focusedInputIndex,
              inputKeyValue
            )
          : item
      );
      const totalPrice = getTotalPrice(state.selectedDatesIndex.length, items);
      const totalSbCount = getTotalSbCount(items);
      return {
        ...state,
        items: items,
        totalPrice: totalPrice,
        totalSBCount: totalSbCount,
      };
    }
    case "REMOVE_INPUT": {
      const { focusedRow, focusedInputIndex } = action.payload;
      const items = state.items.map((item, index) =>
        index === focusedRow
          ? updateInputsByFocusedInputIndex(item, focusedInputIndex, "", true)
          : item
      );
      const totalPrice = getTotalPrice(state.selectedDatesIndex.length, items);
      const totalSbCount = getTotalSbCount(items);
      return {
        ...state,
        items: items,
        totalPrice: totalPrice,
        totalSBCount: totalSbCount,
      };
    }
    case "INPUT_RANDOM_NUMBER": {
      const { focusedRow, inputNumbers, inputNumber } = action.payload;
      // {
      //   ...item,
      //   inputNumbers: inputNumbers,
      //   inputNumber: inputNumber,
      // }
      const items = state.items.map((item, index) =>
        index === focusedRow
          ? updateRandomNumber(item, inputNumbers, inputNumber)
          : item
      );
      const totalPrice = getTotalPrice(state.selectedDatesIndex.length, items);
      const totalSbCount = getTotalSbCount(items);
      return {
        ...state,
        items: items,
        totalPrice: totalPrice,
        totalSBCount: totalSbCount,
      };
    }
    case "Add_ITEMS_CART": {
      const { cartItems } = action.payload;
      return {
        ...state,
        items: defaultItems,
        cartItems: cartItems,
        focusedListRowIndex: null,
        isCustomKeyboardVisible: false,        
        totalPrice: 0,
        totalSBCount: 0,
      };
    }
    default:
      return state;
  }
};

// Create a custom provider component
const SystemPlayProvider = ({ children }) => {
  const [state, dispatch] = useReducer(systemPlayReducer, initialState);
  const value = {
    state,
    dispatch,
  };
  return (
    <SystemPlayContext.Provider value={value}>
      {children}
    </SystemPlayContext.Provider>
  );
};

// Custom hook to use the context
const useSystemPlayContext = () => {
  const context = useContext(SystemPlayContext);
  if (!context) {
    throw new Error(
      "useSystemPlayContext must be used within an SystemPlayProvider"
    );
  }
  return context;
};

export { SystemPlayProvider, useSystemPlayContext };
