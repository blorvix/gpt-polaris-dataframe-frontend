import MessageBoard from "./MessageBoard";
import Input from "./Input";
import { useEffect, useState, useContext } from "react";
import { Message, WaitingStates } from "../../services/types";
import { sendMessageApi, uploadFileApi, loadMessagesApi, getDatasetSummaryApi } from "../../services/requests";
import { Button } from '@mui/material'
import './ChatArea.css'
import { UserContext, UserContextType } from "../../services/context";

const ChatArea = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [askQuestion, setAskQuestion] = useState<boolean>(false);
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const { currentConvId } = useContext(UserContext) as UserContextType;

  const startUpload = () => setWaitingForSystem(WaitingStates.UploadingFiles);
  const completeUpload = () => {
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
    if (!message.length || !currentConvId) return;

    addMessage({
      text: message,
      role: "user",
      type: "text",
    })
    
    setWaitingForSystem(WaitingStates.GeneratingResponse)

    sendMessageApi(currentConvId, message).then(message => {
      addMessage(message)
      setWaitingForSystem(WaitingStates.Idle);
    })
  }

  const uploadFiles = async (files: any) => {
    if (!files.length || !currentConvId) return;

    startUpload()
    for (const file of files)
      await uploadFileApi(currentConvId, file).then(message => addMessage(message))
    setTimeout(() => completeUpload(), 300)
  }

  useEffect(() => {
    if (!currentConvId) return;
    loadMessagesApi(currentConvId).then(messages => setMessages(messages))
  }, [currentConvId])

  const yesButtonClicked = () => {
    setAskQuestion(false);

    addMessage({
      role: 'user',
      type: 'text',
      text: 'Yes, I will like.'
    })

    setWaitingForSystem(WaitingStates.GeneratingResponse)

    getDatasetSummaryApi(currentConvId).then(message => {
      addMessage(message)
      setWaitingForSystem(WaitingStates.Idle);
    })
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
        disabled={askQuestion || (waitingForSystem !== WaitingStates.Idle)}
      />
    </div>
  )
}

export default ChatArea;
