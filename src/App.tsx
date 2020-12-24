import * as React from "react";
import "./styles.css";
import firebase from "firebase";
import { useList } from "react-firebase-hooks/database";
import { Button, TextField } from "@material-ui/core";
import { useRef } from "react";

const nameList = ["Alex", "Lisa", "Simon", "Tina", "Nicolai"];

export default function App() {
  return (
    <div className="App">
      <h1>Gæt hvem der skrev beskeden:</h1>
      <Chat />
      <MessageDispatcher />
    </div>
  );
}

function Chat() {
  const messageListRef = firebase.database().ref("messages");
  const [snapshots, loading, error] = useList(messageListRef);

  return (
    <>
      <h2> Chat </h2>
      <ul>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && snapshots && (
          <React.Fragment>
            <span>
              {snapshots.map((v) => (
                <React.Fragment key={v.key}>
                  {ChatMessage(v.val())}
                </React.Fragment>
              ))}
            </span>
          </React.Fragment>
        )}
      </ul>
    </>
  );
}

function ChatMessage(chatMessageObject: any) {
  const { text, winner, sender } = chatMessageObject;
  const makeGuess = (name: any) => () => {
    console.log("guessed", name);
    if (sender === name) {
      console.log("Correct!");
    } else {
      console.log("Wrong!");
    }
  };

  return (
    <li>
      The sender was : {winner ? sender : "?"} - {text}{" "}
      {nameList.map((name) => {
        return (
          <Button onClick={makeGuess(name)} variant="outlined">
            {name}
          </Button>
        );
      })}
    </li>
  );
}

function MessageDispatcher() {
  const messageListRef = firebase.database().ref("messages");
  const messageFieldRef = useRef(""); //creating a refernce for TextField Component
  const nameFieldRef = useRef(""); //creating a refernce for TextField Component
  const sendMessage = () => {
    // get message
    //@ts-ignore
    const messageString = messageFieldRef.current.value;
    //@ts-ignore
    messageFieldRef.current.value = "";

    // get name
    //@ts-ignore
    const nameString = nameFieldRef.current.value;

    //send messagge

    const newRef = messageListRef.push();
    newRef.set({
      text: messageString,
      sender: nameString,
      winner: "Simon"
    });
  };

  return (
    <>
      <TextField
        inputRef={nameFieldRef}
        id="outlined-basic"
        label="Name"
        variant="outlined"
      />
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
