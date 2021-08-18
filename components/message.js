import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import broken from "../assets/404.png";

import moment from "moment";
import { getOG } from "../Util";

export default function Message({ isMe, props, thisArg }) {
  let embedsLinks = [];
  let [embeds, setEmbeds] = useState([]);
  const hasLink = props.content ? props.content.indexOf("https") > -1 : null;
  const links = hasLink
    ? props.content.split(" ").map((word, index) => {
        if (word.indexOf("http") > -1) {
          embedsLinks.push(word);
          return (
            <Text
              onPress={() => {
                Linking.openURL(word);
              }}
              key={index}
              style={styles.link}
            >
              {word}{" "}
            </Text>
          );
        } else return <Text style={styles.message_content}>{word} </Text>;
      })
    : null;
  useEffect(() => {
    embedsLinks.forEach(async (link) => {
      if (embeds.find((x) => x.ogUrl == link)) return;
      try {
        const embedData = await getOG(link);
        embedData.link = link;
        setEmbeds([...embeds, embedData]);
      } catch (error) {
        return console.log(error);
      }
    });
  }, []);
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
          {props.type == 101 ? "has joined the chat!" : "has left the chat!"}
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
      <Text>{hasLink ? links : props.content}</Text>
      {props.attachment ? (
        <TouchableWithoutFeedback
          onPress={() => {
            thisArg.setState({
              imagePreview: `data:image;base64,${props.attachment}`,
            });
            thisArg.handleAnimation();
          }}
        >
          <Image
            style={{
              width: 200,
              height: 150,
              resizeMode: "contain",
            }}
            source={{ uri: `data:image;base64,${props.attachment}` }}
          />
        </TouchableWithoutFeedback>
      ) : null}
      {embeds.map((embed, index) => {
        let image = embed.ogImage || embed.twitterImage;
       
        return (
          <View key={index} style={styles.embed}>
            <View
              style={[
                styles.themebar,
                { backgroundColor: embed.ogTheme || embed.themeColor },
              ]}
            ></View>
            <View>
              {embed.ogSiteName || embed.twitterSite ? (
                <Text selectable>
                  {truncate(embed.ogSiteName || embed.twitterSite, 60)}
                </Text>
              ) : null}
              {embed.ogTitle || embed.twitterTitle ? (
                <Text
                  onPress={() =>
                    Linking.openURL(
                      embed.ogUrl || embed.twitterUrl
                        ? embed.ogUrl || embed.twitterUrl
                        : embed.link
                    )
                  }
                  selectable
                  style={styles.ogTitle}
                >
                  {truncate(embed.ogTitle || embed.twitterTitle, 42)}
                </Text>
              ) : null}
              {embed.ogDescription ||
              embed.description ||
              embed.twitterDescription ? (
                <Text>
                  {truncate(
                    embed.ogDescription ||
                      embed.description ||
                      embed.twitterDescription,
                    80
                  )}
                </Text>
              ) : null}
              {embed.ogImage || embed.twitterImage ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    thisArg.setState({
                      imagePreview: `${image || broken}`,
                    });
                    thisArg.handleAnimation();
                  }}
                >
                  <Image
                    defaultSource={broken}
                    style={{
                      flex: 1,
                      marginTop: 10,
                      aspectRatio: 1.5,
                      borderRadius: 15,
                    }}
                    source={{ uri: `${image}` }}
                  />
                </TouchableWithoutFeedback>
              ) : null}
            </View>
          </View>
        );
      })}
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
    width: "70%",
    maxHeight: 100,
    backgroundColor: "#dadfe8",
    alignSelf: "center",
    borderRadius: 5,
    padding: 5,
    textAlign: "center",
    alignContent: "center",
    marginBottom: 10,
  },
  link: {
    color: "blue",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  embed: {
    backgroundColor: "#f0eff4",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  themebar: {
    position: "absolute",
    width: 5,
    left: 0,
    height: "100%",
    top: 0,
    backgroundColor: "blue",
    marginTop: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  ogTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: "blue",
  },
});
function truncate(str, n) {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  }
  return str;
}
