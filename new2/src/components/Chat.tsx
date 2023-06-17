import "./Chat.css";
import { useEffect, useRef } from "react";

import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import PersonIcon from "@mui/icons-material/Person";

import SyntaxHighlighter from "react-syntax-highlighter";
import { WaitingStates, Message } from "../types";

function Message(props: {
  text: string;
  role: string;
  type: string;
  showLoader?: boolean;
}) {
  let { text, role } = props;

  return (
    <div className={"message " + (role == "system" ? "system" : "user")}>
      <div className="avatar-holder">
        <div className="avatar">
          {role == "system" ? <VoiceChatIcon /> : <PersonIcon />}
        </div>
      </div>
      <div className="message-body">
        {props.type == "code" && (
          <div>
            I generated the following code:
            <SyntaxHighlighter wrapLongLines={true} language="python">
              {text}
            </SyntaxHighlighter>
          </div>
        )}

        {(props.type == "text" || props.type == "message_raw") &&
          (props.showLoader ? (
            <div>
              {text} {props.showLoader ? <div className="loader"></div> : null}
            </div>
          ) : (
            <div className="cell-output" dangerouslySetInnerHTML={{ __html: text }}></div>
          ))}
        
        {props.type == "image/png" &&
          <div className="cell-output-image" dangerouslySetInnerHTML={{ __html: `<img src='data:image/png;base64,${text}' />` }}></div>
        }
        {props.type == "image/jpeg" &&
          <div className="cell-output-image" dangerouslySetInnerHTML={{ __html: `<img src='data:image/jpeg;base64,${text}' />` }}></div>
        }
        </div>
    </div>
  );
}



export default function Chat(props: {
  waitingForSystem: WaitingStates;
  messages: Array<Message>;
}) {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll down container by setting scrollTop to the height of the container
    chatScrollRef.current!.scrollTop = chatScrollRef.current!.scrollHeight;
  }, [chatScrollRef, props.messages]);

  return (
    <>
      <div className="chat-messages" ref={chatScrollRef}>
        {props.messages.map((message, index) => {
          console.log(message)
          return (
            <Message
              key={index}
              text={message.text}
              role={message.role}
              type={message.type}
            />
          );
        })}
        {props.waitingForSystem != WaitingStates.Idle ? (
          <Message
            text={props.waitingForSystem}
            role="system"
            type="text"
            showLoader={true}
          />
        ) : null}
      </div>
    </>
  );
}
