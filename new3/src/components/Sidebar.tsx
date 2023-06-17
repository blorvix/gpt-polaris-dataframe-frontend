import AssistantIcon from '@mui/icons-material/Assistant';

import "./Sidebar.css";
import Config from '../config';
import { UserContext } from '../services/context';
import {useContext} from 'react';

export default function Sidebar() {
  const {user, setUser} = useContext(UserContext);
  
  const handleOpenAIButtonClick = () => {
    const key = prompt("Please enter your OpenAI key", user.openai_key);
    if (key != null) {
      setUser({
        ...user,
        openai_key: key
      });
    }
  };
  return (
    <>
      <div className="sidebar">
        <div className="logo">
            <AssistantIcon /> GPT-Code UI

            <div className='github'>
                <a href='https://github.com/ricklamers/gpt-code-ui'>Open Source - v{import.meta.env.VITE_APP_VERSION}</a>
            </div>
        </div>
        <div className="settings">
            <label className="header">Settings</label>
            <label>Model</label>
            <select
            value={user.openai_model}
            onChange={(event) => setUser({ ...user, openai_model: event.target.value })}
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
  