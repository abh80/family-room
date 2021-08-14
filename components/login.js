import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";

import { checkRoomID, checkUserName, apiUrl } from "./../Util";

export default function login({ navigator, thisArg }) {
  const [input, setInput] = useState(null);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [x, setCoord] = useState(new Animated.Value(0));
  const [nx, setCoordn] = useState(new Animated.Value(0));
  const [part2, setPart2] = useState(false);
  function move(v, n) {
    Animated.timing(v, {
      toValue: n,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }
  return (
    <View
      onStartShouldSetResponder={(e) => e.stopPropagation()}
      style={styles.login_component}
    >
      {!part2 ? (
        <Animated.View style={{ marginLeft: x, alignItems: "center" }}>
          <Text style={styles.JoinARoomText}>Join a room</Text>
          <TextInput
            placeholder="Room ID"
            type="number"
            keyboardType="numeric"
            style={styles.input}
            onSubmitEditing={(e) => {
              const roomId = e.nativeEvent.text;
              handleJoinRequest(roomId);
            }}
            onChange={(e) => {
              setInput(e.nativeEvent.text);
              error ? setError(null) : null;
            }}
          />
          {error ? <Text style={styles.alertText}>{error}</Text> : null}
          <TouchableOpacity
            onPress={() => {
              const roomId = input;
              handleJoinRequest(roomId);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={{ marginLeft: nx, alignItems: "center" }}>
          <Text style={styles.JoinARoomText}>Choose a Name to Enter</Text>

          <TextInput
            placeholder="Jack Ryan"
            style={styles.input}
            onSubmitEditing={(e) => {
              let name = e.nativeEvent.text;
              name = name?.trim();
              if (!name) return setError("Name cannot be empty");
              if (name.length < 3)
                return setError("Name must be at least 3 characters");
              if (!checkUserName(name)) {
                setError(
                  "Don't use special keys or name longer than 16 letters"
                );
                return;
              }
              thisArg.setState({ showLogin: false });
              navigator.navigate("Chat", {
                username: name,
                roomId: room,
              });
            }}
            onChange={(e) => {
              setInput(e.nativeEvent.text);
              error ? setError(null) : null;
            }}
          />
          {error ? <Text style={styles.alertText}>{error}</Text> : null}
          <TouchableOpacity
            onPress={() => {
              let name = input;
              name = name?.trim();
              if (!name) return setError("Name cannot be empty");
              if (name.length < 3)
                return setError("Name must be at least 3 characters");
              if (!checkUserName(name)) {
                setError(
                  "Don't use special keys or name longer than 16 letters"
                );
                return;
              }
              thisArg.setState({ showLogin: false });
              navigator.navigate("Chat", {
                username: name,
                roomId: room,
              });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
  function handleJoinRequest(roomId) {
    if (!checkRoomID(roomId)) {
      setError("Room ID is not proper, check out with the host");
      return;
    }
    fetch(apiUrl + "validate/" + roomId)
      .then((res) => {
        if (res.status != 200) {
          setError("Room ID is not valid, check out with the host");
          return;
        }
        setError(null);
        setInput(null);
        setRoom(roomId);
        move(x, -800);

        setTimeout(() => {
          setPart2(true);
          move(nx, 0);
        }, 300);
      })
      .catch((e) => {
        setError("Temporary error, try again later");
        return;
      });
  }
}

const styles = StyleSheet.create({
  alertText: {
    color: "#FF160C",
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Roboto-Medium",
    marginTop: -10,
  },
  input: {
    height: 40,
    width: 250,
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
  },
  login_component: {
    alignItems: "center",
    height: 200,
    width: 350,
    backgroundColor: "#F5FCFF",
    margin: "auto",
    borderRadius: 15,
    overflow: "hidden",
  },
  JoinARoomText: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
  },
  button: {
    width: 140,
    height: 49,
    borderWidth: 0,
    borderColor: "rgba(0,0,0,1)",
    borderRadius: 33,
    borderStyle: "solid",
    marginTop: 35,
    backgroundColor: "rgba(66,167,255,1)",
  },
  buttonText: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    marginTop: 5,
    textAlign: "center",
  },
});
