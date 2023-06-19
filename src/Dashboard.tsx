import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./Dashboard.css";
import LoginButton from "./components/LoginButton";
import Sidebar from "./components/sidebar/Sidebar";
import Config from "./config";
import { Conversation, Message, User, WaitingStates } from "./types";
import { UserContext } from "./services/context";
import { sendMessageApi, uploadFileApi, loadConversationsApi, loadUserInfoApi, loadMessagesApi } from "./services/requests";
import ChatArea from "./components/board/ChatArea";


function Dashboard() {
  const [conversations, setConversations] = useState<Array<Conversation>>([]);
  const [currentConvId, setCurrentConvId] = useState<number>(0);
  const {token, setToken, user, setUser} = useContext(UserContext);

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
            <ChatArea convId={currentConvId} />
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
