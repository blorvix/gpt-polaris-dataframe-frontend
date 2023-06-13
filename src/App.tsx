import "./App.css";
import Input from "./components/Input";
import Sidebar from "./components/Sidebar";
import Chat, { WaitingStates } from "./components/Chat";
import { useState, useEffect, useRef } from "react";
import Config from "./config";
import { useLocalStorage } from "usehooks-ts";

export type MessageDict = {
  text: string;
  role: string;
  type: string;
};

function App() {
  const COMMANDS = ["reset"];
  const MODELS = [{
      displayName: "GPT-3.5",
      name: "gpt-3.5-turbo",
    },{
      displayName: "GPT-4",
      name: "gpt-4",
    }];

  let [selectedModel, setSelectedModel] = useLocalStorage<string>("model", MODELS[0].name);
  let [openAIKey, setOpenAIKey] = useLocalStorage<string>("OpenAIKey", "");
  let [messages, setMessages] = useState<Array<MessageDict>>(
    Array.from([
      {
        text: `I don't see any dataset uploaded for analysis, will you "Upload a Dataset or Multiple Datasets", or provide a link to a dataset that I can download?`,
        role: "system",
        type: "text",
      },
    ])
  );
  let [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(WaitingStates.Idle);
  const [currentConvId, setCurrentConvId] = useState<string>("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const addMessage = (message: MessageDict) => {
    console.log(message)
    setMessages((state: any) => {
      return [...state, message];
    });
  };

  const sendMessage = async (userInput: string) => {
    try {
      if (userInput.length == 0) return;

      addMessage({ text: userInput, type: "text", role: "user" });

      setWaitingForSystem(WaitingStates.GeneratingResponse);

      const response = await fetch(`${Config.API_ADDRESS}/conversations/${currentConvId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userInput,
          model: selectedModel,
          openAIKey: openAIKey,
        }),
      });

      const data = await response.json();
      addMessage(data);
      // const code = data.code;

      // addMessage({ text: code, type: "code", role: "system" });

      // if (response.status != 200) {
        setWaitingForSystem(WaitingStates.Idle);
      //   return;
      // }
      
      // submitCode(code);
      // setWaitingForSystem(WaitingStates.RunningCode);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  function completeUpload(_: string) {
    setWaitingForSystem(WaitingStates.Idle);
  }

  function startUpload(_: string) {
    setWaitingForSystem(WaitingStates.UploadingFiles);
  }

  async function uploadFile(file: any) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${Config.API_ADDRESS}/conversations/${currentConvId}/upload`, {
        method: "POST",
        body: formData,
      });

      console.log(response)

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: any = await response.json();
      addMessage(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    // Scroll down container by setting scrollTop to the height of the container
    chatScrollRef.current!.scrollTop = chatScrollRef.current!.scrollHeight;
  }, [chatScrollRef, messages]);


  // Capture <a> clicks for download links
  useEffect(() => {
    const clickHandler = (event: any) => {
      let element = event.target;
      
      // If an <a> element was found, prevent default action and do something else
      if (element != null && element.tagName === 'A') {
        // Check if href starts with /download
        
        if (element.getAttribute("href").startsWith(`/download`)) {
          event.preventDefault();

          // Make request to ${Config.API_ADDRESS}/download instead
          // make it by opening a new tab
          window.open(`${Config.API_ADDRESS}${element.getAttribute("href")}`);
        }        
      }
    };

    // Add the click event listener to the document
    document.addEventListener('click', clickHandler);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, []); 

  useEffect(() => {
    fetch(`${Config.API_ADDRESS}/conversations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: 'test' }),
    })
    .then(resp => resp.json())
    .then((resp) => {
      console.log(resp)
      setCurrentConvId(resp.id)
    })
    .catch((error) => console.error("Error:", error));
  }, [])

  return (
    <>
      <div className="app">
        <Sidebar
          models={MODELS}
          selectedModel={selectedModel}
          onSelectModel={(val: string) => {
            setSelectedModel(val);
          }}
          openAIKey={openAIKey}
          setOpenAIKey={(val: string) => {
            setOpenAIKey(val);
          }}
        />
        <div className="main">
          <Chat
            chatScrollRef={chatScrollRef}
            waitingForSystem={waitingForSystem}
            messages={messages}
          />
          <Input
            onSendMessage={sendMessage}
            onUploadFile={uploadFile}
            onStartUpload={startUpload}
            onCompleteUpload={completeUpload}
          />
        </div>
      </div>
    </>
  );
}

export default App;
