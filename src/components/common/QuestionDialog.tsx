import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export type QuestionDialogDataType = {
    title: string;
    description: string;
    buttons: {
        name: string;
        action: () => void;
        focus?: boolean;
    }[]
}

const QuestionDialog = (props: { open: boolean, setOpen: any, data: QuestionDialogDataType }) => {
    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {props.data.title.length > 0 && (
                <DialogTitle id="alert-dialog-title">
                    {props.data.title}
                </DialogTitle>
            )}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.data.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {props.data.buttons.map((button, index) => (
                    <Button key={index} onClick={() => { props.setOpen(false); button.action() }} autoFocus={button.focus === true}>
                        {button.name}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>
    );
}

export default QuestionDialog;
