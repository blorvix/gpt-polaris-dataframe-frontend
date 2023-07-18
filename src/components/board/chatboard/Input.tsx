import { useRef, useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";
import TextareaAutosize from "react-textarea-autosize";
import "./Input.css";

export default function Input(props: { onSendMessage: any, onUploadFiles: any, disabled: boolean }) {

  let fileInputRef = useRef<HTMLInputElement>(null);
  let [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
  let [userInput, setUserInput] = useState<string>("");

  const handleInputFocus = () => {
    setInputIsFocused(true);
  };

  const handleInputBlur = () => {
    setInputIsFocused(false);
  };

  const handleUpload = (e: any) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    console.log('handleFileChange', e.target.files)
    if (e.target.files.length > 0) {
      props.onUploadFiles(e.target.files);
    }
    if (fileInputRef.current)
      fileInputRef.current.value = "";
  };
  

  const handleSendMessage = async () => {
    props.onSendMessage(userInput);
    setUserInput("");
  }

  const handleInputChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && e.shiftKey === false) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  return (
    <div className="input-parent">
      <div className={"input-holder " + (inputIsFocused ? "focused" : "")}>
        <form className="file-upload">
          <input
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
            type="file"
            multiple
          />
          <button type="button" onClick={handleUpload} disabled={props.disabled}>
            <FileUploadIcon />
          </button>
        </form>
        <TextareaAutosize
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={userInput}
          rows={1}
          placeholder="Send a message"
          readOnly={props.disabled}
        />
        <button className="send" onClick={handleSendMessage}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
