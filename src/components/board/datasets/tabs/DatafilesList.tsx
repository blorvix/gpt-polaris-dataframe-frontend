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
import { getDatafilesApi } from '#/services/requests';
import Collapse from '@mui/material/Collapse';
import './DatafilesList.css'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FirstRowsData from './FirstRowsData';

type Datafile = {
    id: number;
    name: string;
    created_at: string;
}

const Row = (props: { index: number, row: Datafile }) => {
    const { index, row } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }} onClick={() => setOpen(!open)} selected={open}>
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
                <TableCell >{row.name}</TableCell>
                <TableCell>{row.created_at.slice(0, 10)}</TableCell>
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

const DatafilesList = (props: { dataset_id: number, currentDatafileId: number, setCurrentDatafileId: any, forceReload: boolean }) => {
    const [datafiles, setDatafiles] = useState<Datafile[]>([])

    useEffect(() => {
        getDatafilesApi(props.dataset_id).then(resp => {
            setDatafiles(resp)
            if (resp.length > 0)
                props.setCurrentDatafileId(resp[0].id)
        })
    }, [props.dataset_id, props.forceReload])

    return (
        <TableContainer component={Paper} sx={{maxHeight: 'calc(100vh - 205px)'}}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell width='20px'></TableCell>
                        <TableCell width='40px'></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell width='120px'>Uploaded At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datafiles.map((datafile, index) => (
                        <Row index={index} row={datafile} key={index} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DatafilesList;
