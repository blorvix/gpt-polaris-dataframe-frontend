import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./Dashboard.css";
import LoginButton from "../auth/LoginButton";
import Sidebar from "../sidebar/Sidebar";
import { Conversation, Message, User, WaitingStates } from "../../services/types";
import { UserContext, UserContextType } from "../../services/context";
import { sendMessageApi, uploadFileApi, loadConversationsApi, loadUserInfoApi, loadMessagesApi, newConversationApi } from "../../services/requests";
import ChatArea from "../board/ChatArea";


function Dashboard() {
  const {token, setToken, user, setUser} = useContext(UserContext) as UserContextType;

  const onLoad = useEffect(() => {
    // load conversations
    if (!token) return;
    loadUserInfoApi().then((data) => {
      setUser(data)
    }).catch(() => {
      console.log("error")
      setToken("")
    })
  }, [])

  return (
    <>
      <div className="app">
        <Sidebar/>
        {!!token ? (
          user.openai_key ? (
            <ChatArea />
          ) : (
            <div className="flex-center">
              You need to set openai key to continue.
            </div>
          )
        ) : <>
          <div className="flex-center">
            <LoginButton afterLogin={() => {}} />
          </div>
        </>}
      </div>
    </>
  );
}

export default Dashboard;
