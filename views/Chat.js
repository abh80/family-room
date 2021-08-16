import React from "react";
import { View, StyleSheet, TextInput, Image, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import send_icon from "../assets/send_icon.png";
import MessageContainer from "../components/message";
import { wsUrl } from "../Util";
import Typing from "../components/typing_indicator";

export default class Chat extends React.Component {
  componentWillUnmount() {
    this.timeout ? clearTimeout(this.timeout) : null;
    this.ws.close();
    this.ws = null;
  }
  constructor(props) {
    super(props);
    this.flatlistRef = React.createRef();
    this.state = {
      message: "",
      messages: [],
      baseAuthor: "",
      token: null,
      usersTyping: [],
      isMeTyping: false,
    };
    this.timeout = null;
    this.connectionAttempt = 0;
  }
  initWs() {
    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          code: 51,
          payload: {
            username: this.props.route.params.username,
            roomId: this.props.route.params.roomId,
          },
        })
      );
    };
    this.ws.onmessage = (msg) => this.handleSocketMessage(msg);
    this.ws.onclose = () => {
      if (this.connectionAttempt >= 3) {
        this.props.navigation.goBack();
        alert("Connection lost to server, please try again");
        return;
      }
      setTimeout(() => {
        this.initWs();
        this.connectionAttempt += 1;
      }, 1000 * this.connectionAttempt + 1);
    };
  }
  stopTyping() {
    if (!this.state.isMeTyping) return;
    this.setState({ isMeTyping: false });
    this.ws.send(
      JSON.stringify({
        code: 62,
        payload: {
          roomId: this.props.route.params.roomId,
          token: this.state.token,
        },
      })
    );
  }
  startTyping() {
    if (this.state.isMeTyping) return;
    this.setState({ isMeTyping: true });
    this.ws.send(
      JSON.stringify({
        code: 61,
        payload: {
          roomId: this.props.route.params.roomId,
          token: this.state.token,
        },
      })
    );
  }
  handleTyping(m) {
    if (!m) m = "";
    if (!m.trim()) {
      this.stopTyping();
      return;
    }

    if (this.state.isMeTyping) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.stopTyping();
      }, 5000);
      return;
    }
    this.startTyping();
    this.timeout = setTimeout(() => {
      this.stopTyping();
    }, 5000);
  }
  handleSocketMessage(msg) {
    const data = JSON.parse(msg.data);
    switch (data.code) {
      case 16: {
        let base = data.payload.token.split(".");

        this.setState({
          token: data.payload.token,
          baseAuthor: base[0] + base[1],
        });
        break;
      }
      case 12: {
        this.setState({ messages: [...this.state.messages, data.payload] });
        break;
      }
      case 17: {
        this.setState({ messages: [...this.state.messages, data.payload] });
        break;
      }
      case 19: {
        if (this.state.baseAuthor == data.payload.baseAuthor) return;
        if (
          this.state.usersTyping.find(
            (x) => x.baseAuthor === data.payload.baseAuthor
          )
        )
          return;

        this.setState({
          usersTyping: [...this.state.usersTyping, data.payload],
        });
        break;
      }
      case 18: {
        this.setState({
          usersTyping: this.state.usersTyping.filter(
            (x) => x.baseAuthor !== data.payload.baseAuthor
          ),
        });
        break;
      }
    }
  }
  sendMessage() {
    if (!this.state.message.trim()) return;
    this.ws.send(
      JSON.stringify({
        code: 76,
        payload: {
          content: this.state.message,
          token: this.state.token,
          roomId: this.props.route.params.roomId,
        },
      })
    );
    this.messageInput.clear();
    this.setState({ message: "" });
    this.handleTyping(null);
  }
  componentDidMount() {
    const { username, roomId } = this.props.route.params;
    if (!username || !roomId) {
      this.props.navigation.goBack();
      alert("A fatal error occured, please try again");
      return;
    }
    this.initWs();
  }
  render() {
    return (
      <View style={styles.main_container}>
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "white",
            borderRadius: 10,
            borderRightColor: "#171313",
            borderRightWidth: 0.6,
          }}
        >
          {this.state.messages.length > 0 ? (
            <FlatList
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 70,
              }}
              data={this.state.messages}
              persistentScrollbar
              onContentSizeChange={() =>
                this.flatList.scrollToEnd({
                  animated: true,
                })
              }
              ref={(ref) => (this.flatList = ref)}
              onLayout={() =>
                this.flatList.scrollToEnd({
                  animated: true,
                })
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <MessageContainer
                  props={item}
                  isMe={item.baseAuthor === this.state.baseAuthor}
                />
              )}
            />
          ) : null}
        </View>
        {this.state.usersTyping.length ? (
          <Typing users={this.state.usersTyping} />
        ) : null}
        <View style={styles.message_input_holder}>
          <TextInput
            ref={(ref) => (this.messageInput = ref)}
            style={styles.message_input}
            placeholder="Say Hi"
            onChange={(e) => {
              this.setState({ message: e.nativeEvent.text });
              this.handleTyping(e.nativeEvent.text);
            }}
            onSubmitEditing={() => this.sendMessage()}
          />
          <TouchableOpacity onPress={() => this.sendMessage()}>
            <Image
              source={send_icon}
              style={{
                width: 45,
                height: 45,
                margin: 0,
                borderRadius: 0,
                overflow: "hidden",
                marginLeft: 8,
                marginTop: 10,
              }}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  main_container: {
    height: "100%",
    width: "100%",
  },
  message_input_holder: {
    bottom: 0,
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    height: 100,
    padding: 5,
    paddingTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
  },
  message_input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    borderRadius: 33,
    padding: 10,
    marginBottom: 5,
    fontSize: 16,
    marginTop: 10,
    backgroundColor: "#e6e6e6",
  },
});
