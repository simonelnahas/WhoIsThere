import * as React from "react";
import "./styles.css";
import firebase from "firebase";
import { useList } from "react-firebase-hooks/database";
import { Button, TextField, List, ListItem } from "@material-ui/core";
import { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const nameList = ["Alex", "Lisa", "Simon", "Tina", "Nicolai"];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));
function SetUserName(props: {
  setUserName: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const setName = (name: string) => () => {
    props.setUserName(name);
  };

  return (
    <>
      <h1> Who Are you? </h1>
      {nameList.map((name) => {
        return (
          <Button onClick={setName(name)} variant="outlined">
            {name}
          </Button>
        );
      })}
    </>
  );
}

function Chat(props: { userName: string }) {
  const classes = useStyles();
  const messageListRef = firebase.database().ref("messages");
  const [snapshots, loading, error] = useList(messageListRef);

  return (
    <>
      <List className={classes}>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && snapshots && (
          <React.Fragment>
            <span>
              {snapshots.map((v) => (
                <React.Fragment key={v.key}>
                  {ChatMessage(v.val(), v.key, props.userName)}
                </React.Fragment>
              ))}
            </span>
          </React.Fragment>
        )}
      </List>
    </>
  );
}

function ChatMessage(
  chatMessageObject: any,
  messageKey: string,
  userName: string
) {
  const { text, winner, sender } = chatMessageObject;

  const makeGuess = (name: any) => () => {
    if (sender === name) {
      console.log("Correct!");
      firebase
        .database()
        .ref("messages/" + messageKey + "/winner")
        .set({
          is: userName
        });
    } else {
      console.log("Wrong!");
      alert("Wrong, please try again");
      alert("Now, wait and give everyone else a chance to make a guess!");
      alert("Wait just a little more!");
    }
  };

  return (
    <ListItem key={messageKey}>
      {winner ? (
        sender + " : " + text + " - Winner was " + winner.is
      ) : (
        <>
          Who wrote this? : {text}
          <>
            {nameList.map((name) => {
              if (name === userName) {
                return "";
              }
              return (
                <Button onClick={makeGuess(name)} variant="outlined">
                  {name}
                </Button>
              );
            })}
          </>
        </>
      )}
    </ListItem>
  );
}

function MessageDispatcher(props: { userName: string }) {
  const messageListRef = firebase.database().ref("messages");
  const messageFieldRef = useRef(""); //creating a refernce for TextField Component
  const sendMessage = () => {
    // get message
    //@ts-ignore
    const messageString = messageFieldRef.current.value;
    if (messageString === "") {
      return;
    }
    //@ts-ignore
    messageFieldRef.current.value = "";

    //send message
    const newRef = messageListRef.push();
    newRef.set({
      text: messageString,
      sender: props.userName
    });
  };

  return (
    <>
      <TextField
        inputRef={messageFieldRef}
        id="outlined-basic"
        label="Message"
        variant="outlined"
      />

      <Button onClick={sendMessage} variant="outlined">
        send
      </Button>
    </>
  );
}

export default function App() {
  const [userName, setUserName] = useState<string>();
  return (
    <div className="App">
      <h1>Who wrote the message?</h1>
      {userName ? (
        <>
          <h3> Hey {userName} </h3>
          <Chat userName={userName} />
          <MessageDispatcher userName={userName} />
        </>
      ) : (
        <SetUserName setUserName={setUserName} />
      )}
    </div>
  );
}
