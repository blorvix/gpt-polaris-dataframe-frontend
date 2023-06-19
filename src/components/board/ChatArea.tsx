import MessageBoard from "./MessageBoard";
import Input from "./Input";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { Conversation, Message, User, WaitingStates } from "../../types";
import { sendMessageApi, uploadFileApi, loadMessagesApi, getDatasetSummaryApi } from "../../services/requests";
import { Button } from '@mui/material'
import './ChatArea.css'

const ChatArea = (props: { convId: number }) => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [askQuestion, setAskQuestion] = useState<boolean>(false);
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);

  const startUpload = () => setWaitingForSystem(WaitingStates.UploadingFiles);
  const completeUpload = (file_count: number) => {
    setWaitingForSystem(WaitingStates.Idle);

    addMessage({
      role: "system",
      type: "text",
      text: "Will you like to get some insights into the dataset?"
    })

    setAskQuestion(true)
  }

  const addMessage = (message: Message) => {
    setMessages(messages => [
      ...messages,
      message
    ])
  }

  const sendMessage = (message: string) => {
    if (!message.length) return;
    addMessage({
      text: message,
      role: "user",
      type: "text",
    })
    sendMessageApi(props.convId, message).then(message => addMessage(message))
  }

  const uploadFiles = async (files: any) => {
    startUpload()
    for (const file of files)
      await uploadFileApi(props.convId, file).then(message => addMessage(message))
    setTimeout(() => completeUpload(files.length), 300)
  }

  const loadMessages = useEffect(() => {
    if (!props.convId) return;
    loadMessagesApi(props.convId).then(messages => setMessages(messages))
  }, [props.convId])

  const yesButtonClicked = () => {
    setAskQuestion(false);

    addMessage({
      role: 'user',
      type: 'text',
      text: 'Yes, I will like.'
    })

    getDatasetSummaryApi(props.convId).then(message => addMessage(message))
  }

  const noButtonClicked = () => {
    setAskQuestion(false);
  }

  return (
    <div className="main">
      <MessageBoard
        waitingForSystem={waitingForSystem}
        messages={messages}
      />
      {askQuestion && (
        <div className="yesno-buttons">
          <Button variant="contained" className="yes-button" onClick={yesButtonClicked}>Yes</Button>
          <Button variant="outlined" onClick={noButtonClicked}>No</Button>
        </div>
      )}
      <Input
        onSendMessage={sendMessage}
        onUploadFiles={uploadFiles}
        disabled={askQuestion}
      />
    </div>
  )
}

export default ChatArea;
