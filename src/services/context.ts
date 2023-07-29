import {createContext} from "react";
import { User } from "#/types/chat";

export type UserContextType = {
    token: string;
    setToken: (_: string) => void;
    user: User;
    setUser: (_: User) => void;
    currentConvId: number;
    setCurrentConvId: (_: number) => void;
}

export const UserContext = createContext<UserContextType | null>(null);
