import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "./Dashboard";
import { UserContext } from "./services/context";
import { useLocalStorage } from "usehooks-ts";
import { User } from './types';
import Config from "./config";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);

const App = () => {
  const [user, setUser] = useLocalStorage<User>("user", {logined: false, openai_key: "", openai_model: Config.MODELS[0].name});
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  )
}

export default App;
