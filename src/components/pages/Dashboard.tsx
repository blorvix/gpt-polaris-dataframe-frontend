import { useEffect, useContext } from "react";
import "./Dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import { UserContext, UserContextType } from "../../services/context";
import { loadUserInfoApi } from "../../services/requests";
import ChatArea from "../board/chatboard/v1/ChatArea";
import GoogleSignIn from "#/components/auth/GoogleSignIn"
import DatasetsView from "../board/datasets/DatasetsView";
import NavBar from "../board/chatboard/v1/NavBar";

function Dashboard() {
  const {token, setToken, user, setUser, currentConvId} = useContext(UserContext) as UserContextType;

  useEffect(() => {
    // load conversations
    if (!token) {
      // setToken("abcd");
      return
    }
    loadUserInfoApi().then(async (resp) => {
      if (resp.ok)
        setUser(await resp.json())
      else
        setToken("")
    }).catch(() => {
      // setToken("")
    })
  }, [])

  return (
    <>
      <div className="app">
        <Sidebar />
        {!!token ? (
          user.openai_key ? (
            <div className="main">
              {currentConvId < 0 ? (
                <DatasetsView />
              ) : currentConvId == 0 ? (
                <></>
              ) : (
                <>
                  <NavBar onDashboardClick={() => {}} />
                  <div>
                    <ChatArea convId={currentConvId} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex-center">
              You need to set openai key to continue.
            </div>
          )
        ) : <>
          <div className="flex-center">
            <GoogleSignIn/>
            {/* <LoginButton afterLogin={() => {}} /> */}
          </div>
        </>}
      </div>
    </>
  );
}

export default Dashboard;
