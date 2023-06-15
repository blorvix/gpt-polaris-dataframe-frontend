import { get } from "./requests"

export const loadConversations = () => {
    return get('/conversations');
}
