import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "./components/pages/Dashboard";
import { UserContext } from "./services/context";
import { useLocalStorage } from "usehooks-ts";
import { User } from '#/types/chat';
import Config from "./config";
import {useEffect, useState} from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfirmProvider } from "material-ui-confirm";
import { ToastContainer } from 'react-toastify'
import './styles/globals.css'
import { createTheme } from '@mui/material/styles';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);

// @ts-ignore
const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: [
        'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'
      ].join(','),
    },
  },
});

const App = () => {
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [user, setUser] = useState<User>({openai_key: "", openai_model: Config.MODELS[0].name});
  const [currentConvId, setCurrentConvId] = useState<number>(0); // -1 means datasets window is displayed

  useEffect(() => {
  }, [])
  
  return (
    <UserContext.Provider value={{ token, setToken, user, setUser, currentConvId, setCurrentConvId }}>
      <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID}>
        <ConfirmProvider>
          {/* <ThemeProvider theme={theme}> */}
            <RouterProvider router={router} />
          {/* </ThemeProvider> */}
        </ConfirmProvider>
      </GoogleOAuthProvider>
      <ToastContainer />
    </UserContext.Provider>
  )
}

export default App;
