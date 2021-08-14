import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
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
    /* this.props.navigation.navigate("Chat", {
      roomId: "123456789012",
      username: "test",
    });
    */
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
          <TouchableOpacity style={styles.button1}>
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
            <Login thisArg={this} navigator={this.props.navigation} />
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
    top: 0,
    position: "absolute",
    fontFamily: "Roboto-Bold",
    color: "#121212",
    height: 68,
    width: 250,
    fontSize: 50,
    textAlign: "left",
    left: 0,
  },
  room: {
    top: 64,
    left: 0,
    position: "absolute",
    fontFamily: "Roboto-Bold",
    color: "#121212",
    height: 67,
    width: 250,
    fontSize: 50,
    textAlign: "right",
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
    marginLeft: 39,
    marginTop: 2,
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
  },
  start: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 32,
    marginLeft: 36,
    marginTop: 2,
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
  },
  createARoom: {
    fontFamily: "roboto-regular",
    color: "rgba(189,16,224,1)",
    fontSize: 18,
    right: "3%",
    position: "absolute",
  },
  joinARoomRow: {
    height: 22,
    flexDirection: "row",
    marginTop: 8,
    marginLeft: 59,
    marginRight: 50,
  },
});
