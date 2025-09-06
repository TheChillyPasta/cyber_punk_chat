"use client";

import React, { useState } from "react";
import ChatHeader from "../components/ChatHeader";
import Tab from "../components/molecules/tabs/Tab";
import Tabs from "../components/molecules/tabs/Tabs";
import TabsContainer from "../components/molecules/tabs/TabsContainer";
import SearchBox from "../components/SearchBox";
import ChatList from "./ChatList";
import css from "./styles/chatlist.module.scss";
import clsx from "clsx";

export default function ChatListPanel() {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="flex flex-col flex-nowrap h-screen w-full overflow-hidden">
      <ChatHeader />
      <div className="flex flex-col  sm:py-2 h-side">
        <div className={clsx("sm:hidden bg-header-100 ")}>
          <TabsContainer>
            <Tabs>
              <Tab name="CHATS" value="chats"></Tab>
              <Tab name="STATUS" value="status"></Tab>
              <Tab name="CALLS" value="calls"></Tab>
            </Tabs>
          </TabsContainer>
        </div>
        <div className="px-3 pb-3 sm-max:hidden">
          <SearchBox
            placeholder="Search or start new chat"
            setQuery={setQuery}
          />
        </div>
        <div
          className={` ${css.chatListContainer} bg-default   overflow-auto `}
        >
          <ChatList />
        </div>
      </div>
    </div>
  );
}
