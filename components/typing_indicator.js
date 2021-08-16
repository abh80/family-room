import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TypingAnimation } from "react-native-typing-animation";

export default function typing({ users }) {
  return (
    <View style={styles.container}>
      <TypingAnimation
        dotColor="black"
        dotMargin={7}
        dotAmplitude={3}
        dotSpeed={0.15}
        dotRadius={5}
      />
      <Text style={styles.text}>
        {users.length == 1
          ? users[0].username + " is typing"
          : users.length == 2
          ? users.map((x) => x.username).join(" and ") + " are typing"
          : "several peoples are typing"}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    bottom: 80,
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    marginLeft: 25,
  },
  text: {
    fontSize: 16,
    marginLeft: 40,
    color: "black",
    fontFamily: "Roboto-Medium",
  },
});
