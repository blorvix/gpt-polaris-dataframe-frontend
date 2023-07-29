import './ConversationList.css'

import { useState, useEffect, useContext } from 'react';
import NewConvButton from "./NewConvButton"
import Divider from '@mui/material/Divider';
import ConversationItem from "./ConversationItem";

import { Conversation } from '../../services/types';
import { UserContextType, UserContext } from '../../services/context';
import { newConversationApi, deleteConversationApi, loadConversationsApi } from '../../services/requests';

const ConversationList = () => {
    const [conversations, setConversations] = useState<Array<Conversation>>([]);
    const { token, setCurrentConvId } = useContext(UserContext) as UserContextType;

    const addConversation = () => {
        newConversationApi().then(data => {
            setConversations(conversations => [...conversations, data])
            setCurrentConvId(data.id)
        })
    }

    const deleteConversation = (id: number) => {
        let i = 0, count = conversations.length;
        for (; i < count; i++) {
            if (conversations[i].id == id)
                break;
        }
        if (i == count) return;

        deleteConversationApi(id)

        const newConvId = count > 1 ? conversations[Math.min(i, conversations.length - 1)].id : 0;
        setConversations(conversations => conversations.filter((conversation: Conversation) => conversation.id !== id));

        if (count == 1) {
            addConversation()
        } else {
            setCurrentConvId(newConvId)
        }
    }

    useEffect(() => {
        if (!token) return
        loadConversationsApi().then(conversations => {
            setConversations(conversations)
            if (conversations.length > 0)
                setCurrentConvId(conversations[0].id)
        })
    }, [token])

    return (
        <div className='conversations'>
            <NewConvButton onClick={addConversation} />
            <Divider light={true} />
            {conversations.map((conv: Conversation) => (
                <ConversationItem key={conv.id} conv={conv} onDelete={deleteConversation} onClick={setCurrentConvId} />
            ))}
        </div>
    )
}

export default ConversationList;
