import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./Dashboard.css";
import Chat from "./components/Chat";
import Input from "./components/Input";
import LoginButton from "./components/LoginButton";
import Sidebar from "./components/Sidebar";
import Config from "./config";
import { Conversation, Message, User, WaitingStates } from "./types";
import { UserContext } from "./services/context";
import { sendMessageApi, uploadFileApi, loadConversationsApi, loadUserInfoApi } from "./services/requests";


function Dashboard() {
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [conversations, setConversations] = useState<Array<Conversation>>([]);
  const [currentConvId, setCurrentConvId] = useState<number>(0);
  const {token, setToken, user, setUser} = useContext(UserContext);

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

  const loadConversations = useCallback(() => {
    if (!token) return
    loadConversationsApi().then(conversations => {
      setConversations(conversations)
      setCurrentConvId(conversations[0].id)
    })
  }, [setConversations, setCurrentConvId])
  
  const onLoad = useEffect(() => {
    // load conversations
    if (!token) return;
    loadUserInfoApi().then((data) => {
      console.log("success", data)
      setUser(data)
    }).catch(() => {
      console.log("error")
      setToken("")
    })
    loadConversations()
  }, [])

  return (
    <>
      <div className="app">
        <Sidebar />
        {!!token ? <>
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
            <LoginButton afterLogin={loadConversations} />
          </div>
        </>}
      </div>
    </>
  );
}

export default Dashboard;
