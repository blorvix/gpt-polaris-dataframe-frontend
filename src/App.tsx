import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "./components/pages/Dashboard";
import { UserContext } from "./services/context";
import { useLocalStorage } from "usehooks-ts";
import { User } from './services/types';
import Config from "./config";
import {useEffect, useState} from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfirmProvider } from "material-ui-confirm";
import { checkLoginedApi } from "./services/requests";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);

const App = () => {
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [user, setUser] = useState<User>({openai_key: "", openai_model: Config.MODELS[0].name});
  const [currentConvId, setCurrentConvId] = useState<number>(0);

  useEffect(() => {
    const checkLogined = async () => {
      const resp = await checkLoginedApi();
      if (!resp.logined)
        setToken("")
    }
    checkLogined()
  }, [])
  
  return (
    <UserContext.Provider value={{ token, setToken, user, setUser, currentConvId, setCurrentConvId }}>
      <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID}>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </GoogleOAuthProvider>
    </UserContext.Provider>
  )
}

export default App;
