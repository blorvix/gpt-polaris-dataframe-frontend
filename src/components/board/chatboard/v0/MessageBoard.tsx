import "./MessageBoard.css";
import { useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import { WaitingStates, Message } from "../../../../services/types";

export default function MessageBoard(props: {
  waitingForSystem: WaitingStates;
  messages: Array<Message>;
  extraSystemMessage: string | null;
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
          return (
            <MessageBox
              key={index}
              text={message.text}
              role={message.role}
              type={message.type}
            />
          );
        })}
        {props.waitingForSystem != WaitingStates.Idle ? (
          <MessageBox
            text={props.waitingForSystem}
            role="system"
            type="text"
            showLoader={true}
          />
        ) : null}
        {props.extraSystemMessage && 
          <MessageBox
            text={props.extraSystemMessage}
            role="system"
            type="text"
          />}
        
      </div>
    </>
  );
}
