import AssistantIcon from '@mui/icons-material/Assistant';
import "./Sidebar.css";
import { UserContext, UserContextType } from '#/services/context';
import { useContext } from 'react';

import ConversationList from './ConversationList';
import Settings from './Settings';
import DatasetsButton from './DatasetsButton';
import { Divider } from '@mui/material';

export default function Sidebar() {
  const { token, setCurrentConvId } = useContext(UserContext) as UserContextType;

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <AssistantIcon /> Data - GPT
        </div>
        {!!token && (
          <>
            <DatasetsButton onClick={() => setCurrentConvId(-1)} />
            <Divider light={true} />
            <ConversationList />
            <Settings />
          </>
        )}
      </div>
    </>
  )
}
