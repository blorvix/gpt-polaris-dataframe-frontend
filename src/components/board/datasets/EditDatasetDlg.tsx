import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Input } from '@mui/material';
import { useState } from 'react';


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
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <FormLabel sx={{marginRight: '1em'}}>Name</FormLabel>
                    <Input autoFocus required sx={{minWidth: '400px'}} value={props.name} onChange={e => props.setName(e.target.value)} />
                </div>
                <div style={{color: 'red', fontStyle: 'italic', fontSize: '0.9em', paddingLeft: '4em', paddingTop: '5px'}}>
                    {error.length != 0 && <>Error:&nbsp;{error}</>}
                    {!props.name.length && <>Error: Dataset name cannot be empty.</>}
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='inherit' onClick={() => props.setOpen(false)}>Cancel</Button>
                <Button variant='contained' color='primary' onClick={onOKButtonClicked}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditDatasetDlg;
