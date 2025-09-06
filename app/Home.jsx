"use client";

import React from "react";
import ChatListPanel from "./ChatListPanel";
import ConversationPanel from "./ConversationPanel";
import WithAuth from "../utils/Auth";

function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex flex-row h-full">
        <div className=" sm-max:basis-full sm:basis-3/10">
          <ChatListPanel />
        </div>
        <div className="sm-max:hidden sm:basis-7/10">
          <ConversationPanel />
        </div>
      </div>
    </div>
  );
}

export default WithAuth(Home);
