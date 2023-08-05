import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { getDatafilesApi } from '#/services/requests';
import './DatafilesList.css'

type Datafile = {
    id: number;
    name: string;
    created_at: string;
}

const DatafilesList = (props: { dataset_id: number, currentDatafileId: number, setCurrentDatafileId: any }) => {
    const [datafiles, setDatafiles] = useState<Datafile[]>([])

    useEffect(() => {
        getDatafilesApi(props.dataset_id).then(resp => {
            setDatafiles(resp)
            if (resp.length > 0)
                props.setCurrentDatafileId(resp[0].id)
        })
    }, [props.dataset_id])

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Uploaded At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datafiles.map((datafile, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            selected={props.currentDatafileId == datafile.id}
                            onClick={() => props.setCurrentDatafileId(datafile.id)}
                        >
                            {/* <TableCell component="th" scope="row">
                                {datafile.name}
                            </TableCell> */}
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{datafile.name}</TableCell>
                            <TableCell>{datafile.created_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DatafilesList;
