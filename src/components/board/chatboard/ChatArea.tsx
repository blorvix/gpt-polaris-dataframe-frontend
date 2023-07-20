import MessageBoard from "./MessageBoard";
import Input from "./Input";
import { useEffect, useState, useContext, useCallback } from "react";
import { Message, WaitingStates, ProgressStep, DataSet, UploadedFile, Question, UploadedFileHowto } from "../../../services/types";
import { sendMessageApi, uploadFileApi, loadMessagesApi, getDatasetSummaryApi, getConversationApi, saveDataFilesApi, forceAddMessageApi, askCleanupApi, performCleanupApi, getVizHelpApi } from "../../../services/requests";
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
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState<number>(-1);
  const [dataModalOpen, setDataModalOpen] = useState<boolean>(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [uploadedFilesCount, setUploadedFilesCount] = useState<number>(0);
  const [uploadedFileHowtos, setUploadedFileHowtos] = useState<UploadedFileHowto[]>([])

  const [cleanupQuestionsCount, setCleanupQuestionsCount] = useState<number>(0);
  const [cleanupAnswers, setCleanupAnswers] = useState<string[]>([])

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
      setCurrentDatasetIndex(data.current_file)
    })
  }, [currentConvId, setDataSets, setCurrentDatasetIndex])

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

  const addCleanupAnswer = (question: string, answer: string) => {
    setCleanupAnswers(answers => [...answers, question, answer])
  }

  useEffect(() => {
    if (cleanupQuestionsCount > 0 && cleanupAnswers.length == 2 * cleanupQuestionsCount) {
      setWaitingForSystem(WaitingStates.GeneratingResponse)
      performCleanupApi(currentConvId, dataSets[currentDatasetIndex].id, cleanupAnswers).then(message => {
        setWaitingForSystem(WaitingStates.Idle)
        addMessage(message)
        gotoNextDatasetProgress()
      })
    }
  }, [cleanupAnswers])

  const askCleanup = (ask: string) => {
    const request = askCleanupApi(currentConvId, dataSets[currentDatasetIndex].id, ask)
    if (ask == 'yes') {
      setWaitingForSystem(WaitingStates.GeneratingResponse)
      request.then((questions) => {
        setWaitingForSystem(WaitingStates.Idle)
        setCleanupQuestionsCount(questions.length)
        setCleanupAnswers([])

        for (const question of questions) {
          addYesNoQuestion(
            question,
            () => addCleanupAnswer(question, 'Yes'),
            () => addCleanupAnswer(question, 'No')
          )
        }
      })
    } else {
      gotoNextDatasetProgress()
    }
  }

  const addYesNoQuestion = (question: string, yesAction: any, noAction: any) => {
    setQuestions(questions => [
      ...questions,
      {
        question: question,
        options: [{
          text: 'Yes',
          action: yesAction
        }, {
          text: 'No',
          action: noAction
        }]
      }
    ])
  }

  const questionAnswered = (option: any) => {
    const question = questions[0].question
    setQuestions(questions => questions.filter(q => q.question !== question))
    addMessage({
      text: question,
      role: 'system',
      type: 'text'
    })
    addMessage({
      text: option.text,
      role: 'user',
      type: 'text'
    })
    if (option.action) option.action()
  }

  const getSummary = (ask: string) => {
    const request = getDatasetSummaryApi(currentConvId, dataSets[currentDatasetIndex].id, ask)
    if (ask == 'yes') {
      setWaitingForSystem(WaitingStates.GeneratingResponse)
      request.then((message) => {
        setWaitingForSystem(WaitingStates.Idle)
        addMessage(message)
        gotoNextDatasetProgress()
      })
    } else {
      gotoNextDatasetProgress()
    }
  }

  const getVizHelp = (ask: string) => {
    const request = getVizHelpApi(currentConvId, dataSets[currentDatasetIndex].id, ask)
    if (ask == 'yes') {
      setWaitingForSystem(WaitingStates.GeneratingResponse)
      request.then((message) => {
        setWaitingForSystem(WaitingStates.Idle)
        addMessage(message)
        gotoNextDatasetProgress()
      })
    } else {
      gotoNextDatasetProgress()
    }
  }

  const checkDatasetProgress = () => {
    if (dataSets.length <= 0 || currentDatasetIndex >= dataSets.length) return;
    console.log(dataSets.length, currentDatasetIndex)
    const dataset = dataSets[currentDatasetIndex]
    console.log(dataset.progress_step)
    if (dataset.progress_step == ProgressStep.Cleanup) {
      addYesNoQuestion(
        `Do you want to perform some data cleanup activities to ensure the \`${dataset.name}\` dataset is ready for analysis?`,
        () => askCleanup('yes'),
        () => askCleanup('no')
      )
    } else if (dataset.progress_step == ProgressStep.Summary) {
      addYesNoQuestion(
        `Will you like to get some insights into the \`${dataset.name}\` dataset?`,
        () => getSummary('yes'),
        () => getSummary('no')
      )
    } else if (dataset.progress_step == ProgressStep.Vizhelp) {
      addYesNoQuestion(
        `Will you like more details on the variables recommended for visualizations?`,
        () => getVizHelp('yes'),
        () => getVizHelp('no')
      )
    } else if (dataset.progress_step == ProgressStep.Completed) {
      setCurrentDatasetIndex(currentDatasetIndex + 1)
    }
  }

  useEffect(() => {
    checkDatasetProgress()
  }, [dataSets, currentDatasetIndex])

  const gotoNextDatasetProgress = () => {
    const dataset = dataSets[currentDatasetIndex];
    dataset.progress_step += 1;
    checkDatasetProgress()
  }

  useEffect(() => {
    if (!currentConvId) return;
    
    setDataModalOpen(false)
    setWaitingForSystem(WaitingStates.Idle)
    
    setQuestions([])
    
    setUploadedFilesCount(0)
    setUploadedFileHowtos([])

    setCleanupQuestionsCount(0)
    setCleanupAnswers([])

    loadMessages()
    loadConversation()
  }, [currentConvId])

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
