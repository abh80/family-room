import React from "react";
import { View, StyleSheet, TextInput, Image, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import send_icon from "../assets/send_icon.png";
import MessageContainer from "../components/message";
import { wsUrl } from "../Util";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.flatlistRef = React.createRef();
    this.state = {
      message: "",
      messages: [],
      baseAuthor: "",
      token: null,
    };
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
  }
  componentDidMount() {
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
              renderItem={({ item }) => (
                <MessageContainer
                  key={Math.floor(Math.random() * 100000)}
                  props={item}
                  isMe={item.baseAuthor === this.state.baseAuthor}
                />
              )}
            />
          ) : null}
        </View>
        <View style={styles.message_input_holder}>
          <TextInput
            ref={(ref) => (this.messageInput = ref)}
            style={styles.message_input}
            placeholder="Say Hi"
            onChange={(e) => this.setState({ message: e.nativeEvent.text })}
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
