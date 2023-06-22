import AssistantIcon from '@mui/icons-material/Assistant';
import Divider from '@mui/material/Divider';

import "./Sidebar.css";
import Config from '../../config';
import { UserContext } from '../../services/context';
import { useContext } from 'react';
import { saveUserInfoApi } from '../../services/requests';
import ConversationItem from './ConversationItem';
import NewConvButton from './NewConvButton';

export default function Sidebar(props: {converstations: any}) {
  const { token, user, setUser } = useContext(UserContext);

  const handleOpenAIButtonClick = () => {
    const key = prompt("Please enter your OpenAI key", user.openai_key);
    if (key != null) {
      setUser({
        ...user,
        openai_key: key
      });
      saveUserInfoApi({openai_key: key})
    }
  };

  const saveModel = (e: any) => {
    const model = e.target.value
    setUser({ ...user, openai_model: model })
    saveUserInfoApi({openai_model: model})
  }

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <AssistantIcon /> Data - GPT
        </div>
        {!!token && (
          <>
          <div className='conversations'>
            <NewConvButton />
            <Divider light={true} />
            {props.converstations.map((conv: any) => (
              <ConversationItem key={conv.id} conv={conv} />
            ))}
          </div>
          <div className="settings">
            <label className="header">Settings</label>
            <label>Model</label>
            <select
              value={user.openai_model}
              onChange={saveModel}
            >
              {Config.MODELS.map((model, index) => {
                return (
                  <option key={index} value={model.name}>
                    {model.displayName}
                  </option>
                );
              })}
            </select>
            <label>Credentials</label>
            <button onClick={handleOpenAIButtonClick}>Set OpenAI key</button>
          </div>
          </>
        )}
      </div>
    </>
  )
}
