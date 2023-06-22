import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import PersonIcon from "@mui/icons-material/Person";

import SyntaxHighlighter from "react-syntax-highlighter";
import Config from "../../config";
import Iframe from "../common/Iframe";

const MessageBox = (props: {
  text: string;
  role: string;
  type: string;
  showLoader?: boolean;
}) => {
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
        {props.type == "html" &&
          // <div className="cell-output-image" dangerouslySetInnerHTML={{ __html: text }}></div>
          <div className="cell-output-image">
            <Iframe src={'/conversations/graph/' + text} ></Iframe>
          </div>
        }
      </div>
    </div>
  );
}

export default MessageBox;
