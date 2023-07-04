import MessageBoard from "./MessageBoard";
import Input from "./Input";
import { useEffect, useState, useContext } from "react";
import { Message, DataFile, WaitingStates, ProgressStep } from "../../services/types";
import { sendMessageApi, uploadFileApi, loadMessagesApi, getDatasetSummaryApi, getConversationApi } from "../../services/requests";
import { Button } from '@mui/material'
import './ChatArea.css'
import { UserContext, UserContextType } from "../../services/context";

const ChatArea = () => {
  const { currentConvId } = useContext(UserContext) as UserContextType;
  
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [dataFiles, setDataFiles] = useState<DataFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);

  const startUpload = () => setWaitingForSystem(WaitingStates.UploadingFiles);
  const completeUpload = () => setWaitingForSystem(WaitingStates.Idle);

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

    uploadFileApi(currentConvId, files).then(data => {
      completeUpload()

      setDataFiles([
        ...dataFiles,
        data.files
      ])
      setCurrentFileIndex(currentFileIndex + 1);
    })
  }

  useEffect(() => {
    if (!currentConvId) return;
    loadMessagesApi(currentConvId).then(messages => setMessages(messages))
    setWaitingForSystem(WaitingStates.Idle)
    getConversationApi(currentConvId).then(data => {
      setDataFiles(data.datafiles)
      setCurrentFileIndex(data.current_file)
    })
  }, [currentConvId])

  useEffect(() => {
    if (currentFileIndex < 0 || currentFileIndex >= dataFiles.length) return;

    if (dataFiles[currentFileIndex].progress_step == ProgressStep.None) {
      
    }
  }, [dataFiles, currentFileIndex])

  // useEffect(() => {
  //   if( fileSummaryIndex >= uploadedFiles.length) {
  //     return
  //   }

  //   addMessage({
  //     role: "system",
  //     type: "text",
  //     text: `Will you like to get some insights into the dataset "${uploadedFiles[fileSummaryIndex].name}"?`
  //   })
  // }, [fileSummaryIndex])

  const yesButtonClicked = () => {
    addMessage({
      role: 'user',
      type: 'text',
      text: 'Yes, I will like.'
    })

    setWaitingForSystem(WaitingStates.GeneratingResponse)

    const file = dataFiles[currentFileIndex];
    getDatasetSummaryApi(currentConvId, file.id, file.name, true).then(message => {
      addMessage(message)
      setWaitingForSystem(WaitingStates.Idle);
      setCurrentFileIndex(currentFileIndex + 1);
    })
  }

  const noButtonClicked = () => {
    addMessage({
      role: 'user',
      type: 'text',
      text: 'No, thanks.'
    })

    const file = dataFiles[currentFileIndex];
    getDatasetSummaryApi(currentConvId, file.id, file.name, false);
    setCurrentFileIndex(currentFileIndex + 1);
  }

  const questionVisible = () => {
    return dataFiles.length > 0 && currentFileIndex >= dataFiles.length && waitingForSystem == WaitingStates.Idle;
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
