import { Button } from '@mui/material'
import './NavBar.css'
import SelectConversationDatasets from './SelectConversationDatasets';

const NavBar = (props: {onDashboardClick: () => void}) => {
    return (
        <div className='chatarea-navbar'>
            <div>
                <SelectConversationDatasets />
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Button variant='contained' color='primary' onClick={props.onDashboardClick}>Go to Dashboard</Button>
            </div>
        </div>
    )
}

export default NavBar;
