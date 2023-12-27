import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSystemPlayContext } from "./SystemPlayContext";

const SystemPlayDatesList = () => {  
  const { state, dispatch } = useSystemPlayContext();
  
  const [selectedItems, setSelectedItems] = useState([0]);

  let items = [];
  useEffect(() => {    
    updateDate();
  }, [selectedItems]);

  useEffect(() => {    
    items = state.datesList;
  }, [state]);

  const updateDate = () => {
    dispatch({
      payload: {
        dates: selectedItems,
      },
      type: "UPDATE_DATE",
    });
  };

  const toggleSelection = (item) => {    
    if (selectedItems.length > 1) {
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i !== item));
      } else {
        setSelectedItems([...selectedItems, item]);
      }      
    } else {
      if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
      }
    }
  };

  return (
    <View style={styles.container}>
      {state.datesList?.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: selectedItems.includes(index)
                ? "lightgreen"
                : "white",
              borderColor: selectedItems.includes(index) ? "darkgreen" : "blue",
            },
          ]}
          onPress={() => toggleSelection(index)}
        >
          <Text style={styles.boldText}>{item.weekName}</Text>
          <Text style={styles.regularText}>{item.date}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "93%",
  },
  card: {
    flex: 1,
    flexWrap: "wrap",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "blue",
    alignContent: "center",
    marginHorizontal: 5,
  },
  boldText: {
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 13,
  },
  regularText: {
    color: "black",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 10,
  },
});

export default React.memo(SystemPlayDatesList);
