import { useEffect, useRef, useState } from "react";
import { auth, db } from "../config/firebase";
import Message from "./Message";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

function ChatScreenContainer({ chat, messages }) {
  const [user] = useAuthState(auth);
  const chatRef = useRef(null);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messagesSnapshot, loading] = useCollection(
    db
      .collection("users")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  useEffect(() => {
    chatRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [router.query.id, loading]);

  console.log(chat);

  const showMessage = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          username={message.data().username}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!input) {
      return false;
    }

    db.collection("users").doc(router.query.id).collection("messages").add({
      message: input,
      username: user?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    chatRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
    setInput("");
  };

  return (
    <div className="">
      <div className="flex-grow h-full space-y-20">
        {showMessage()}
        <div className="pb-24" ref={chatRef} />
      </div>
      <form className="relative flex items-center justify-center">
        <input
          className=" bottom-14 mb-10 sm:bottom-10 p-4 w-full max-w-6xl shadow-2xl bg-[#fafafa] outline-none ring-gray-900  focus:ring-white"
          placeholder="Type a message"
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          disabled={!input?.length === 0 || !user}
        />
        <button hidden type="submit" onClick={sendMessage}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChatScreenContainer;
