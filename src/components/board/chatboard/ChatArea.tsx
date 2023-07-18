import MessageBoard from "./MessageBoard";
import Input from "./Input";
import { useEffect, useState, useContext, useCallback } from "react";
import { Message, WaitingStates, ProgressStep, DataSet, UploadedFile, Question, UploadedFileHowto } from "../../../services/types";
import { sendMessageApi, uploadFileApi, loadMessagesApi, getDatasetSummaryApi, getConversationApi, saveDataFilesApi, forceAddMessageApi } from "../../../services/requests";
import { Button } from '@mui/material'
import './ChatArea.css'
import { UserContext, UserContextType } from "../../../services/context";
import NavBar from "./NavBar";
// import DataModal from "./DataModal";

const ChatArea = () => {
  const { currentConvId } = useContext(UserContext) as UserContextType;
  
  const [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [dataSets, setDataSets] = useState<DataSet[]>([]);
  const [uploadedFilesCount, setUploadedFilesCount] = useState<number>(0);
  const [uploadedFileHowtos, setUploadedFileHowtos] = useState<UploadedFileHowto[]>([])
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [dataModalOpen, setDataModalOpen] = useState<boolean>(false);

  const startUpload = () => setWaitingForSystem(WaitingStates.UploadingFiles);
  const completeUpload = () => setWaitingForSystem(WaitingStates.Idle);

  const addMessage = (message: Message) => {
    setMessages(messages => [
      ...messages, 
      message
    ])
    // if (save) {
    //   forceAddMessageApi(currentConvId, message.role, message.text).then(() => {
    //     if (callback) callback()
    //   })
    // }
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

  const answerUploadedFileOverwrite = (uploadedFileId: number, howto: string) => {
    setUploadedFileHowtos(howtos => [
      ...howtos,
      {
        id: uploadedFileId,
        howto: howto,
      }
    ])
  }

  const uploadFiles = async (files: any) => {
    console.log('uploadFiles', files, currentConvId)
    if (!files.length || !currentConvId) return;

    startUpload()

    uploadFileApi(currentConvId, files).then(uploadedFiles => {
      completeUpload()

      setUploadedFilesCount(uploadedFiles.length)
      setUploadedFileHowtos([]);

      for (const uploadedFile of uploadedFiles) {
        if (uploadedFile.same_dataset && uploadedFile.same_file_name) {
          setQuestions(questions => [
            ...questions,
            {
              question: `${uploadedFile.datafile.name} already exists in the \`${uploadedFile.same_dataset.name}\` dataset. Do you want to overwrite it?`,
              options: ['Overwrite', 'Rename', 'Skip'].map(howto => ({
                text: howto,
                action: () => answerUploadedFileOverwrite(uploadedFile.id, howto.toLowerCase())
              }))
            }
          ])
        } else {
          answerUploadedFileOverwrite(uploadedFile.id, 'overwrite')
        }
      }
    })
  }

  const loadConversation = useCallback(() => {
    getConversationApi(currentConvId).then(data => {
      setDataSets(data.datasets)
      setCurrentFileIndex(data.current_file)
    })
  }, [currentConvId, setDataSets, setCurrentFileIndex])

  const loadMessages = useCallback(() => {
    loadMessagesApi(currentConvId).then(messages => setMessages(messages))
  }, [currentConvId, setMessages])

  useEffect(() => {
    if (uploadedFilesCount > 0 && uploadedFilesCount == uploadedFileHowtos.length) {
      saveDataFilesApi(currentConvId, uploadedFileHowtos).then(() => {
        loadConversation()
        loadMessages()
      })
    }
  }, [uploadedFileHowtos])

  // useEffect(() => {
  //   if (dataSets.length <= 0 || currentFileIndex >= dataSets.length) return;
  //   const dataset = dataSets[currentFileIndex]
  //   if (dataset.progress_step == ProgressStep.None) {
  //     setQuestions(questions => [
  //       ...questions,
  //       {
  //         question: `Do you want to perform some data cleanup activities to ensure the \`${dataset.name}\` dataset is ready for analysis?`,
  //         options: [{
  //           text: 'Yes',
  //           action: () => {}
  //         }, {
  //           text: 'No',
  //           action: () => {}
  //         }]
  //       }
  //     ])
  //   }
  // }, [dataSets, currentFileIndex])

  useEffect(() => {
    if (!currentConvId) return;
    setUploadedFilesCount(0)
    setUploadedFileHowtos([])
    setQuestions([])
    setDataModalOpen(false)
    setWaitingForSystem(WaitingStates.Idle)
    loadMessages()
    loadConversation()
  }, [currentConvId])

  // useEffect(() => {
  //   if (currentFileIndex < 0 || currentFileIndex >= dataFiles.length) return;

  //   if (dataFiles[currentFileIndex].progress_step == ProgressStep.None) {
      
  //   }
  // }, [dataFiles, currentFileIndex])

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

  // const yesButtonClicked = () => {
  //   addMessage({
  //     role: 'user',
  //     type: 'text',
  //     text: 'Yes, I will like.'
  //   })

  //   setWaitingForSystem(WaitingStates.GeneratingResponse)

  //   const file = dataFiles[currentFileIndex];
  //   getDatasetSummaryApi(currentConvId, file.id, file.name, true).then(message => {
  //     addMessage(message)
  //     setWaitingForSystem(WaitingStates.Idle);
  //     setCurrentFileIndex(currentFileIndex + 1);
  //   })
  // }

  // const noButtonClicked = () => {
  //   addMessage({
  //     role: 'user',
  //     type: 'text',
  //     text: 'No, thanks.'
  //   })

  //   const file = dataFiles[currentFileIndex];
  //   getDatasetSummaryApi(currentConvId, file.id, file.name, false);
  //   setCurrentFileIndex(currentFileIndex + 1);
  // }

  // const questionVisible = () => {
  //   return dataFiles.length > 0 && currentFileIndex >= dataFiles.length && waitingForSystem == WaitingStates.Idle;
  // }

  const questionAnswered = (option: any) => {
    addMessage({
      text: questions[0].question,
      role: 'system',
      type: 'text'
    })
    addMessage({
      text: option.text,
      role: 'user',
      type: 'text'
    })
    setQuestions(questions => questions.slice(1))
    if (option.action) option.action()
  }

  return (
    <div className="main">
      <NavBar onUploadClick={() => setDataModalOpen(true)} onDashboardClick={() => {}}></NavBar>
      <MessageBoard
        waitingForSystem={waitingForSystem}
        messages={messages}
        extraSystemMessage={questions.length > 0 ? questions[0].question : null}
      />
      {questions.length > 0 && (
        <div className="question-buttons">
          {questions[0].options.map((option, index) => (
            <Button key={index} variant={index == 0 ? "contained" : 'outlined'} onClick={() => questionAnswered(option)}>{option.text}</Button>
          ))}
          {/* <Button variant="contained" onClick={yesButtonClicked}>Yes</Button>
          <Button variant="outlined" onClick={noButtonClicked}>No</Button> */}
        </div>
      )}
      <Input
        onSendMessage={sendMessage}
        onUploadFiles={uploadFiles}
        disabled={questions.length > 0 || (waitingForSystem !== WaitingStates.Idle)}
        />
      {/* <DataModal open={dataModalOpen} setOpen={setDataModalOpen} /> */}
    </div>
  )
}

export default ChatArea;
