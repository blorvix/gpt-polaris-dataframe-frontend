import {createContext} from "react";
import { User } from "../types";
import Config from "../config";

export const UserContext = createContext({
    token: "",
    setToken: (_: string) => {},
    user: {openai_key: "", openai_model: Config.MODELS[0].name},
    setUser: (_: User) => {},
});