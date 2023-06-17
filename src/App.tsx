import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "./Dashboard";
import { UserContext } from "./services/context";
import { useLocalStorage } from "usehooks-ts";
import { User } from './types';
import Config from "./config";
import {useState} from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);

const App = () => {
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [user, setUser] = useState<User>({openai_key: "", openai_model: Config.MODELS[0].name});
  
  return (
    <UserContext.Provider value={{ token, setToken, user, setUser }}>
      <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </UserContext.Provider>
  )
}

export default App;
