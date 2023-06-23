import AssistantIcon from '@mui/icons-material/Assistant';
import "./Sidebar.css";
import { UserContext, UserContextType } from '../../services/context';
import { useContext } from 'react';

import ConversationList from './ConversationList';
import Settings from './Settings';

export default function Sidebar() {
  const { token } = useContext(UserContext) as UserContextType;

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <AssistantIcon /> Data - GPT
        </div>
        {!!token && (
          <>
            <ConversationList />
            <Settings />
          </>
        )}
      </div>
    </>
  )
}
