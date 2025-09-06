import React from "react";
import ChatStoreContext from "../store/chatContext.jsx";
import Home from "./Home.jsx"

export default function ChatPanel() {
  return (
    <ChatStoreContext>
      <Home />
    </ChatStoreContext>
  );
}
