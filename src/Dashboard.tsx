import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./Dashboard.css";
import MessageBoard from "./components/board/MessageBoard";
import Input from "./components/board/Input";
import LoginButton from "./components/LoginButton";
import Sidebar from "./components/sidebar/Sidebar";
import Config from "./config";
import { Conversation, Message, User, WaitingStates } from "./types";
import { UserContext } from "./services/context";
import { sendMessageApi, uploadFileApi, loadConversationsApi, loadUserInfoApi, loadMessagesApi } from "./services/requests";


function Dashboard() {
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [conversations, setConversations] = useState<Array<Conversation>>([]);
  const [currentConvId, setCurrentConvId] = useState<number>(0);
  const {token, setToken, user, setUser} = useContext(UserContext);
  const [askQuestion, setAskQuestion] = useState<boolean>(false);

  const startUpload = () => setWaitingForSystem(WaitingStates.UploadingFiles);
  const completeUpload = (file_count: number) => {
    setWaitingForSystem(WaitingStates.Idle);
    
    addMessage({
      role: "user",
      type: "text",
      text: "Will you like to get some insights into the dataset?"
    })
  }

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

  const uploadFiles = (files: any) => {
    startUpload()
    for (const file of files)
      uploadFileApi(currentConvId, file).then(message => addMessage(message))
    completeUpload(files.length)
  }

  const loadConversations = useCallback(() => {
    if (!token) return
    loadConversationsApi().then(conversations => {
      setConversations(conversations)
      setCurrentConvId(conversations[0].id)
    })
  }, [setConversations, setCurrentConvId])

  const loadMessages = useEffect(() => {
    if (!currentConvId) return;
    loadMessagesApi(currentConvId).then(messages => setMessages(messages))
  }, [currentConvId])
  
  const onLoad = useEffect(() => {
    // load conversations
    if (!token) return;
    loadUserInfoApi().then((data) => {
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
        <Sidebar converstations={conversations} />
        {!!token ? (
          user.openai_key ? (
            <div className="main">
              <MessageBoard
                waitingForSystem={waitingForSystem}
                messages={messages}
              />
              <Input
                onSendMessage={sendMessage}
                onUploadFiles={uploadFiles}
              />
            </div>
          ) : (
            <div className="flex-center">
              You need to set openai key to continue.
            </div>
          )
        ) : <>
          <div className="flex-center">
            <LoginButton afterLogin={loadConversations} />
          </div>
        </>}
      </div>
    </>
  );
}

export default Dashboard;
