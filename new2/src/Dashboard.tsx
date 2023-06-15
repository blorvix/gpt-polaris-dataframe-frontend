import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./Dashboard.css";
import Chat from "./components/Chat";
import Input from "./components/Input";
import LoginButton from "./components/LoginButton";
import Sidebar from "./components/Sidebar";
import Config from "./config";
import { Message, User, WaitingStates } from "./types";


function Dashboard() {
  const [user, setUser] = useState<User>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [conversations, setConversations] = useState(Array<>)

  return (
    <>
      <div className="app">
        <Sidebar
          models={MODELS}
          selectedModel={selectedModel}
          onSelectModel={(val: string) => {
            setSelectedModel(val);
          }}
          openAIKey={openAIKey}
          setOpenAIKey={(val: string) => {
            setOpenAIKey(val);
          }}
        />
        {user.logined ? <>
          <div className="main">
            <Chat
              waitingForSystem={waitingForSystem}
              messages={messages}
            />
            <Input
              onSendMessage={sendMessage}
              onUploadFile={uploadFile}
              onStartUpload={startUpload}
              onCompleteUpload={completeUpload}
            />
          </div>
        </> : <>
          <div className="flex-center">
            <LoginButton />
          </div>
        </>}
      </div>
    </>
  );
}

export default App;
