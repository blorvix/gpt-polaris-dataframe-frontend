import MessageBoard from "./MessageBoard";
import Input from "./Input";
import { useEffect, useState, useContext } from "react";
import { Message, File, WaitingStates } from "../../services/types";
import { sendMessageApi, uploadFileApi, loadMessagesApi, getDatasetSummaryApi } from "../../services/requests";
import { Button } from '@mui/material'
import './ChatArea.css'
import { UserContext, UserContextType } from "../../services/context";

const ChatArea = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  // const [askQuestion, setAskQuestion] = useState<boolean>(false);
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const { currentConvId } = useContext(UserContext) as UserContextType;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileSummaryIndex, setFileSummaryIndex] = useState<number>(-1);

  const startUpload = () => setWaitingForSystem(WaitingStates.UploadingFiles);
  const completeUpload = () => {
    setWaitingForSystem(WaitingStates.Idle);

    // addMessage({
    //   role: "system",
    //   type: "text",
    //   text: "Will you like to get some insights into the dataset?"
    // })

    // setAskQuestion(true)
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

    const finishedFiles = new Array<File>();

    startUpload()
    for (const file of files) {
      await uploadFileApi(currentConvId, file).then(data => {
        addMessage(data.message)
        finishedFiles.push(data.file)
      })
    }
    completeUpload()

    setUploadedFiles(finishedFiles)
  }

  useEffect(() => {
    if (!currentConvId) return;
    loadMessagesApi(currentConvId).then(messages => setMessages(messages))
  }, [currentConvId])

  useEffect(() => {
    if (uploadedFiles.length == 0) return;

    setFileSummaryIndex(0);
  }, [uploadedFiles])

  useEffect(() => {
    if (fileSummaryIndex < 0) return
    if( fileSummaryIndex >= uploadedFiles.length) {
      setFileSummaryIndex(-1)
      return
    }

    addMessage({
      role: "system",
      type: "text",
      text: `Will you like to get some insights into the dataset "${uploadedFiles[fileSummaryIndex].name}"?`
    })
  }, [fileSummaryIndex])

  const yesButtonClicked = () => {
    addMessage({
      role: 'user',
      type: 'text',
      text: 'Yes, I will like.'
    })

    setWaitingForSystem(WaitingStates.GeneratingResponse)

    const file = uploadedFiles[fileSummaryIndex];
    getDatasetSummaryApi(currentConvId, file.id, file.name, true).then(message => {
      addMessage(message)
      setWaitingForSystem(WaitingStates.Idle);
      setFileSummaryIndex(fileSummaryIndex + 1);
    })
  }

  const noButtonClicked = () => {
    addMessage({
      role: 'user',
      type: 'text',
      text: 'No, thanks.'
    })

    const file = uploadedFiles[fileSummaryIndex];
    getDatasetSummaryApi(currentConvId, file.id, file.name, false);
    setFileSummaryIndex(fileSummaryIndex + 1);
  }

  const questionVisible = () => {
    return uploadFiles.length > 0 && fileSummaryIndex >= 0 && waitingForSystem == WaitingStates.Idle;
  }

  return (
    <div className="main">
      <MessageBoard
        waitingForSystem={waitingForSystem}
        messages={messages}
      />
      {questionVisible() && (
        <div className="yesno-buttons">
          <Button variant="contained" className="yes-button" onClick={yesButtonClicked}>Yes</Button>
          <Button variant="outlined" onClick={noButtonClicked}>No</Button>
        </div>
      )}
      <Input
        onSendMessage={sendMessage}
        onUploadFiles={uploadFiles}
        disabled={questionVisible() || (waitingForSystem !== WaitingStates.Idle)}
      />
    </div>
  )
}

export default ChatArea;
