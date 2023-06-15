import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './Login.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <GoogleOAuthProvider clientId="669509337543-1bl07vrdefptcfavcrfub4u6icp1e69a.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
  </React.StrictMode>
)
