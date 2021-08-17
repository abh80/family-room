import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import Register from "../components/register";
import Login from "../components/login";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      backscreenOpacity: new Animated.Value(0),
    };
  }
  fadeOutBackscreen() {
    Animated.timing(this.state.backscreenOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      this.setState({ showLogin: false });
    }, 300);
  }
  fadeInBackscreen() {
    Animated.timing(this.state.backscreenOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
  componentDidMount() {
    this.props.navigation.navigate("Chat", {
      roomId: "123456789012",
      username: "test",
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.familyStack}>
          <Text style={styles.family}>Family</Text>
          <Text style={styles.room}>Room</Text>
        </View>
        <Text style={styles.text}>Hang out with friends and family.</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showLogin: true });
              this.fadeInBackscreen();
            }}
            style={styles.button}
          >
            <Text style={styles.join}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showLogin: "register" });
              this.fadeInBackscreen();
            }}
            style={styles.button1}
          >
            <Text style={styles.start}>Start</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.joinARoomRow}>
          <Text style={styles.joinARoom}>Join a room</Text>
          <Text style={styles.createARoom}>Create a room</Text>
        </View>
        {this.state.showLogin ? (
          <Animated.View
            onStartShouldSetResponder={(e) => true}
            onResponderRelease={() => {
              this.fadeOutBackscreen();
            }}
            style={[
              styles.login_container,
              { opacity: this.state.backscreenOpacity },
            ]}
          >
            {this.state.showLogin == "register" ? (
              <Register navigator={this.props.navigation} thisArg={this} />
            ) : (
              <Login navigator={this.props.navigation} thisArg={this} />
            )}
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  login_container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  family: {
    fontFamily: "Roboto-Bold",
    color: "#121212",
    height: 68,
    fontSize: 50,
    textAlign: "center",
    width: 200,
    marginRight: 200,
  },
  room: {
    fontFamily: "Roboto-Bold",
    color: "#121212",
    height: 68,
    fontSize: 50,
    textAlign: "center",

    marginLeft: 100,
  },
  familyStack: {
    width: 250,
    height: 131,
    marginTop: 107,
    marginLeft: 62,
  },
  text: {
    fontFamily: "Roboto-Medium",
    color: "#121212",
    height: 97,
    width: "100%",
    fontSize: 25,
    textAlign: "center",
    marginTop: 34,
    margin: "auto",
  },

  join: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 32,

    textAlign: "center",
  },
  button: {
    width: 140,
    height: 49,
    borderWidth: 0,
    borderColor: "rgba(0,0,0,1)",
    borderRadius: 33,
    borderStyle: "solid",
    left: "5%",
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "rgba(66,167,255,1)",
    alignItems: "center",
    justifyContent: "center",
  },
  button1: {
    width: 140,
    height: 49,
    borderWidth: 0,
    borderColor: "rgba(0,0,0,1)",
    borderRadius: 33,
    right: "15%",
    position: "absolute",
    borderStyle: "solid",
    flexDirection: "row",
    backgroundColor: "rgba(189,16,224,1)",
    alignItems: "center",
    justifyContent: "center",
  },
  start: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 32,
    textAlign: "center",
  },
  buttonRow: {
    height: 49,
    flexDirection: "row",
    marginTop: 37,
    marginLeft: 17,
    marginRight: 17,
    width: "100%",
    flexWrap: "wrap",
  },
  joinARoom: {
    fontFamily: "roboto-regular",
    color: "rgba(74,144,226,1)",
    fontSize: 18,
    left: "7%",
    position: "absolute",
    flexDirection: "row",
  },
  createARoom: {
    fontFamily: "roboto-regular",
    color: "rgba(189,16,224,1)",
    fontSize: 18,
    right: "17%",
    position: "absolute",
  },
  joinARoomRow: {
    height: 49,
    flexDirection: "row",
    marginTop: 2,
    marginLeft: 17,
    marginRight: 17,
    width: "100%",
    flexWrap: "wrap",
  },
});
