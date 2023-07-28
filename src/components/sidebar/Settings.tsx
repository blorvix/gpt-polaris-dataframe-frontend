import Config from '../../config';
import { UserContext, UserContextType } from '../../services/context';
import { useContext } from 'react';
import { saveUserInfoApi } from '../../services/requests';

const Settings = () => {
  const { user, setUser } = useContext(UserContext) as UserContextType;

  const handleOpenAIButtonClick = () => {
    const key = prompt("Please enter your OpenAI key", user.openai_key);
    if (key != null) {
      setUser({
        ...user,
        openai_key: key
      });
      saveUserInfoApi({ openai_key: key })
    }
  };

  const saveModel = (e: any) => {
    const model = e.target.value
    setUser({ ...user, openai_model: model })
    saveUserInfoApi({ openai_model: model })
  }

  return (
    <div className="settings">
      <label className="header">Settings</label>
      <label>Model</label>
      <select
        value={user.openai_model}
        onChange={saveModel}
        style={{padding:'5px'}}
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
  )
}

export default Settings;
