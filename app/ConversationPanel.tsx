"use client";

import React, { useContext, useEffect, useState, useCallback } from "react";
import css from "./styles/conversation.module.scss";
import ConversationHeader from "../components/ConversationHeader";
import ConversationPanelMessages from "./ConversationPanelMessages";
import MsgInputBox from "../components/MsgInputBox";
import { useNavigate } from "react-router-dom";
import { ChatStore } from "../store/chatContext.jsx";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useCookies } from "react-cookie";

export default function ConversationPanel() {
  const chatStoreContext = useContext(ChatStore);

  const [messages, setMesages] = useState([]);
  const [socketUrl, setSocketUrl] = useState(`${process.env.VITE_SOCKET_URL}/ws/chat`);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [cookies, setCookie] = useCookies<any>(["auth_token"]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("wss://demos.kaazing.com/echo"),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const {
    currentChatIdState: [chatId, setChatId],
  }: any = chatStoreContext;

  useEffect(() => {
    setSocketUrl(
      `${process.env.VITE_SOCKET_URL}/ws/chat/${chatId}/?token=${cookies?.access_token}`
    );
  }, [chatId]);

  useEffect(() => {
    
    async function getMessages() {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VITE_API_URL}/api/chats/messages/${chatId}`,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      };

      const response = await axios
        .request(config)
        .then((response) => {
          setMesages(response?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    getMessages();
    console.log(chatId, "jhaant id");
  }, [chatId]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMesages((prev) : any => {
        return [...prev, JSON.parse(lastMessage["data"])];
      });
    }
  }, [lastMessage]);

  const sendMsg = (text:any) => {
    sendMessage(JSON.stringify({ text: text }));
  };
  return (
    <div className={`${css.conversationPanelContainer} h-full flex flex-col  `}>
      <div className="basis-1/6 h-auto">
        <ConversationHeader />
      </div>
      <div className="">
        <ConversationPanelMessages messages={messages} />
      </div>
      <div className="basis-1/6 h-auto">
        <MsgInputBox sendMessage={sendMsg} />
      </div>
    </div>
  );
}
