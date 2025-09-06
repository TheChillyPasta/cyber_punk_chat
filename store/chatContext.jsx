'use client'

import { createContext,  useRef, useState } from "react";

export const ChatStore = createContext(null);

export default function ChatStoreContext({ children }) {
//   const currentChatId = useRef(null);
  const currentChatIdState = useState(null)

  return (
    <ChatStore.Provider
      value={{
        currentChatIdState: currentChatIdState,
      }}
    >
      {children}
    </ChatStore.Provider>
  );
}
