import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';

export type SQLTable = {
    name: string;
    fields: number;
    rows: number;
}

const CheckboxList = (props: { tables: SQLTable[], selectedTables: string[], setSelectedTables: any }) => {
    const { selectedTables, setSelectedTables } = props

    const handleToggle = (value: string) => () => {
        const currentIndex = selectedTables.indexOf(value);
        const newChecked = [...selectedTables];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedTables(newChecked);
    };

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {props.tables.map((table: SQLTable, index) => {
                const labelId = `checkbox-list-label-${index}`;

                return (
                    <ListItem
                        key={index}
                        // secondaryAction={
                        //   <IconButton edge="end" aria-label="comments">
                        //     <CommentIcon />
                        //   </IconButton>
                        // }
                        disablePadding
                    >
                        <ListItemButton role={undefined} onClick={handleToggle(table.name)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selectedTables.indexOf(table.name) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${table.name} (${table.fields} fields, ${table.rows} rows)`} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

const SelectSQLTablesDlg = (props: { open: boolean, setOpen: any, tables: SQLTable[], onSuccess: any }) => {
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const onOKButtonClicked = () => {
        props.onSuccess(selectedTables)
        setLoading(true)
    }

    useEffect(() => {
        if (props.open) {
            setSelectedTables([])
        }
    }, [props.open])

    return (
        <Dialog
            open={props.open}
            // onClose={() => props.setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth='xs'
            className='connect-mysql-dlg'
        >
            <DialogTitle id="alert-dialog-title">
                Select Tables to Add
            </DialogTitle>
            <DialogContent>
                <CheckboxList tables={props.tables} selectedTables={selectedTables} setSelectedTables={setSelectedTables} />
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='inherit' onClick={() => props.setOpen(false)} disabled={loading}>Cancel</Button>
                {/* <Button variant='contained' color='primary' onClick={onOKButtonClicked} disabled={selectedTables.length == 0}>Add</Button> */}
                <LoadingButton
                    onClick={onOKButtonClicked}
                    loading={loading}
                    // loadingIndicator="Connecting..."
                    endIcon={<AddIcon />}
                    loadingPosition="end"
                    variant="contained"
                    color='primary'
                    disabled={selectedTables.length == 0}
                >
                    <span>Add</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

export default SelectSQLTablesDlg;
