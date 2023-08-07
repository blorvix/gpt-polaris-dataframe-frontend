import { createHelpConversationMessagesApi, getHelpConversationMessagesApi } from "#/services/requests";
import { useEffect, useState } from "react";
import ChatArea from "../../chatboard/v1/ChatArea";
import { CircularProgress } from "@mui/material";

const HelpConv = (props: {dataset_id: number, help_type: string, help_text: string}) => {
    const [conversationId, setConversationId] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getHelpConversationMessagesApi(props.dataset_id, props.help_type).then(resp => {
            if (resp.error)
                setConversationId(0)
            else
                setConversationId(resp.id)
        })
    }, [props.dataset_id])

    const onStartConversation = () => {
        if (loading) return

        setLoading(true)
        createHelpConversationMessagesApi(props.dataset_id, props.help_type).then(resp => {
            setLoading(false)
            setConversationId(resp.id)
        })
    }

    return (
        <>
            {conversationId ? (
                <ChatArea convId={conversationId}/>
            ) : (
                <div className="start-conv-click" onClick={onStartConversation}>
                    { loading ? <CircularProgress /> : props.help_text }
                </div>
            )}
        </>
    )
}

export default HelpConv;
