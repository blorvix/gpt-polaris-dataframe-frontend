import { Button } from '@mui/material'
import './NavBar.css'

const NavBar = (props: {onUploadClick: () => void, onDashboardClick: () => void}) => {
    return (
        <div className='navbar-buttons'>
            {/* <Button variant='contained' color='success' onClick={props.onUploadClick}>Upload a New File</Button> */}
            <Button variant='contained' color='primary' onClick={props.onDashboardClick}>Go to Dashboard</Button>
        </div>
    )
}

export default NavBar;
