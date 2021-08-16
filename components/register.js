import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { checkRoomID, checkUserName, apiUrl } from "./../Util";
export default function register({ navigator, thisArg }) {
  const [input, setInput] = useState(null);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [name, setName] = useState(null);
  const [x, setCoord] = useState(new Animated.Value(800));
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
      {part2 ? (
        <Animated.View style={{ marginLeft: x, alignItems: "center" }}>
          <Text style={styles.StartARoomText}>Room Information</Text>

          <Text selectable style={styles.roomID}>
            {room}
          </Text>
          {error ? <Text style={styles.alertText}>{error}</Text> : null}
          <TouchableOpacity
            onPress={() => {
              thisArg.setState({ showLogin: false });
              navigator.navigate("Chat", {
                roomId: room,
                username: name,
              });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={{ marginLeft: nx, alignItems: "center" }}>
          <Text style={styles.StartARoomText}>Choose a Name to Enter</Text>
          <TextInput
            placeholder="Jack Ryan"
            style={styles.input}
            keyboardType="default"
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
              createRoom(name);
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
              createRoom(name);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
  function createRoom(userName) {
    fetch(apiUrl + "rooms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
      }),
    })
      .then((xi) => {
        if (xi.status != 200) {
          setError("Room creation failed");
          return;
        }
        xi.json().then((v) => {
          setRoom(v.roomId.toString());
          setName(userName);
          move(nx, -800);
          setError(null);
          setInput(null);
          setTimeout(() => {
            setPart2(true);
            move(x, 0);
          }, 300);
        });
      })
      .catch(() => {
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
  StartARoomText: {
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
  roomID: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    marginTop: 15,
  },
});
