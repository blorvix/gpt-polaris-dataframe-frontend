import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';


const EditDatasetDlg = (props: { open: boolean, setOpen: any, name: string, setName: any, onEditName: any }) => {
    const [error, setError] = useState<string>('')

    const onOKButtonClicked = async () => {
        const success = await props.onEditName()
        if (!success) setError('Dataset with the same name already exists.')
        else {
            props.setOpen(false)
            setError('')
        }
    }

    useEffect(() => {
        setError('')
    }, [open])

    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Edit Dataset
            </DialogTitle>
            <DialogContent>
                <TextField required label="Name" variant="standard" sx={{minWidth: '400px'}} value={props.name} onChange={e => props.setName(e.target.value)}
                error={!props.name.length || error.length != 0} helperText={!props.name.length ? 'Dataset name cannot be empty.' : error} />
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='inherit' onClick={() => props.setOpen(false)}>Cancel</Button>
                <Button variant='contained' color='primary' onClick={onOKButtonClicked}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditDatasetDlg;
