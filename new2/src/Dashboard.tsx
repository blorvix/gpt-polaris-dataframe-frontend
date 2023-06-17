import { useEffect, useRef, useState, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./Dashboard.css";
import Chat from "./components/Chat";
import Input from "./components/Input";
import LoginButton from "./components/LoginButton";
import Sidebar from "./components/Sidebar";
import Config from "./config";
import { Conversation, Message, User, WaitingStates } from "./types";
import { UserContext } from "./services/context";
import { sendMessageApi, uploadFileApi, loadConversationsApi } from "./services/requests";


function Dashboard() {
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [conversations, setConversations] = useState<Array<Conversation>>([]);
  const [currentConvId, setCurrentConvId] = useState<number>(0);
  const {user, setUser} = useContext(UserContext);

  const startUpload = () => setWaitingForSystem(WaitingStates.UploadingFiles);
  const completeUpload = () => setWaitingForSystem(WaitingStates.Idle);

  const addMessage = (message: Message) => {
    setMessages([
      ...messages,
      message
    ])
  }

  const sendMessage = (message: string) => {
    if (!message.length) return;
    addMessage({
      text: message,
      role: "user",
      type: "text",
    })
    sendMessageApi(currentConvId, message).then(message => addMessage(message))
  }

  const uploadFile = (file: any) => {
    uploadFileApi(currentConvId, file).then(message => addMessage(message))
  }
  
  const onLoad = useEffect(() => {
    // load conversations
    loadConversationsApi().then(conversations => {
      setConversations(conversations)
      setConversations(conversations[0].id)
    })
  }, [])

  return (
    <>
      <div className="app">
        <Sidebar />
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

export default Dashboard;
