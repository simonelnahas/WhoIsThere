import * as React from "react";
import "./styles.css";
import firebase from "firebase";
import { useList } from "react-firebase-hooks/database";
import { Button, TextField } from "@material-ui/core";
import { useRef } from "react";

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
                  <li>{v.val().text} </li>{" "}
                </React.Fragment>
              ))}
            </span>
          </React.Fragment>
        )}
      </ul>
    </>
  );
}

function MessageDispatcher() {
  const messageListRef = firebase.database().ref("messages");
  const messageFieldRef = useRef(""); //creating a refernce for TextField Component
  const nameFieldRef = useRef(""); //creating a refernce for TextField Component
  const sendMessage = () => {
    // get message
    const messageString = messageFieldRef.current.value;
    messageFieldRef.current.value = "";

    // get name
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

      <Button onClick={sendMessage} label="Outlined" variant="outlined">
        send
      </Button>
    </>
  );
}
