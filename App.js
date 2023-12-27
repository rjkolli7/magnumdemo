import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";
import SystemPlayComponent from "./systemplay/SystemPlayComponent.js";
import { SystemPlayProvider } from "./systemplay/SystemPlayContext.js";

export default function App() {
  return (
    <View style={styles.container}>
      <SystemPlayProvider>
        <SystemPlayComponent 
        />
      </SystemPlayProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'top',
    justifyContent: 'top',  
    marginTop: Constants.statusBarHeight,    
  },
});
