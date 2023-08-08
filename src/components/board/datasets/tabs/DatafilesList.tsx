import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { deleteDatafileApi, getDatafilesApi, updateDatafileNameApi } from '#/services/requests';
import Collapse from '@mui/material/Collapse';
import './DatafilesList.css'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FirstRowsData from './FirstRowsData';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useConfirm } from 'material-ui-confirm';
import { TextField } from '@mui/material';

type Datafile = {
    id: number;
    name: string;
    created_at: string;
}

const Row = (props: { index: number, row: Datafile, afterDelete: any }) => {
    const confirm = useConfirm()
    const { index, row } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false)
    const [editName, setEditName] = useState<string>('')
    const [editError, setEditError] = useState<string>('')

    const onEdit = (e: any) => {
        e.stopPropagation()
        setEditName(row.name)
        setEdit(true)
        setEditError('')
    }

    const onDelete = (e: any) => {
        e.stopPropagation()
        confirm({
            description: `Do you really want to delete "${row.name}"?`
        }).then(() => {
            deleteDatafileApi(row.id).then(() => {
                props.afterDelete(row.id)
            })
        })
    }

    const onCheck = (e: any) => {
        e.stopPropagation()
        updateDatafileNameApi(row.id, editName).then((resp) => {
            if (resp.success == 'yes') {
                setEdit(false)
                row.name = editName
            } else {
                setEditError('Datfile names must be unique.')
            }
        })
    }

    const onClear = (e: any) => {
        e.stopPropagation()
        setEdit(false)
    }

    return (
        <>
            <TableRow 
                sx={{ 
                    '& > *': { borderBottom: 'unset' },
                    // cursor: 'pointer'
                }} 
                // onClick={() => setOpen(!open)} 
                selected={open}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell >{index + 1}</TableCell>
                <TableCell >
                    {!edit ? (
                        row.name
                    ): (
                        <TextField required label="Name" variant="standard" sx={{width: '100%'}} value={editName} onChange={e => setEditName(e.target.value)}
                        error={!editName.length || editError.length != 0} helperText={!editName.length ? 'Datafile name cannot be empty.' : editError} onClick={e => e.stopPropagation()} />
                    )}
                </TableCell>
                <TableCell>{row.created_at.slice(0, 10)}</TableCell>
                <TableCell>
                    {!edit ? (
                        <>
                            <IconButton aria-label="edit" size="small" onClick={onEdit}>
                                <EditIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton aria-label="delete" size="small" onClick={onDelete}>
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </>
                    ): (
                        <>
                            <IconButton aria-label="check" size="small" onClick={onCheck}>
                                <CheckIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton aria-label="clear" size="small" onClick={onClear}>
                                <ClearIcon fontSize="inherit" />
                            </IconButton>
                        </>
                    )}
                    
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                First 10 rows
                            </Typography>
                            <FirstRowsData datafile_id={row.id} />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

const DatafilesList = (props: { dataset_id: number, forceReload: boolean }) => {
    const [datafiles, setDatafiles] = useState<Datafile[]>([])
    const confirm = useConfirm()

    const reload = () => {
        getDatafilesApi(props.dataset_id).then(resp => {
            setDatafiles(resp)
        })
    }

    useEffect(() => {
        reload()
    }, [props.dataset_id, props.forceReload])

    const onDeleteButtonClicked = (datafile_id: number) => {
        setDatafiles(old_datafiles => old_datafiles.filter(datafile => datafile.id != datafile_id))
    }

    return (
        <TableContainer component={Paper} sx={{maxHeight: 'calc(100vh - 205px)'}}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell width='20px'></TableCell>
                        <TableCell width='40px'></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell width='120px'>Uploaded At</TableCell>
                        <TableCell width='90px'></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datafiles.map((datafile, index) => (
                        <Row index={index} row={datafile} key={index} afterDelete={onDeleteButtonClicked} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DatafilesList;
