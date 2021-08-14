import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

export default function Message({ isMe, props }) {
  return props.systemMessage ? (
    <View style={styles.systemMessage}>
      <Text style={{ textAlign: "center" }}>
        <Text
          style={{
            color: props.color,
            fontFamily: "Roboto-Bold",
            fontSize: 16,
          }}
        >
          {props.username}
        </Text>
        <Text
          style={{ fontFamily: "Roboto-Regular", fontSize: 16, color: "black" }}
        >
          {" "}
          has joined the chat!
        </Text>
      </Text>
    </View>
  ) : (
    <View
      style={[
        styles.chat_container,
        {
          alignSelf: isMe ? "flex-start" : "flex-end",
        },
      ]}
    >
      {!isMe ? (
        <Text style={[styles.author_content, { color: props.authorColor }]}>
          {props.author}
        </Text>
      ) : null}
      <Text style={styles.message_content}>{props.content}</Text>
      <Text style={styles.time_content}>
        {moment(Date.now()).format("hh:mm")}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  chat_container: {
    maxWidth: 250,
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    flexDirection: "column",
    minWidth: 80,
    backgroundColor: "#dadfe8",
  },
  message_content: {
    fontSize: 16,
    color: "black",
    fontFamily: "Roboto-Medium",
  },
  author_content: {
    fontSize: 14,

    fontFamily: "Roboto-Bold",
    marginTop: -5,
  },
  time_content: {
    fontSize: 12,
    alignSelf: "flex-end",
    textAlign: "right",
    fontFamily: "Roboto-Regular",
    color: "#555657",
  },
  systemMessage: {
    width: "50%",
    maxHeight: 100,
    backgroundColor: "#dadfe8",
    alignSelf: "center",
    borderRadius: 5,
    padding: 5,
    textAlign: "center",
    alignContent: "center",
    marginBottom: 10,
  },
});
