import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { getDatafileFirstRowsApi } from '#/services/requests';
// import './DatafilesList.css'

const FirstRowsData = (props: { datafile_id: number }) => {
    const [rows, setRows] = useState<[[]]>([[]])
    const [columns, setColumns] = useState<[]>([])

    useEffect(() => {
        if (props.datafile_id != 0) {
            getDatafileFirstRowsApi(props.datafile_id).then(resp => {
                setColumns(resp.columns)
                setRows(resp.data)
            })
        }
    }, [props.datafile_id])

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {columns.map((value, index) => (
                            <TableCell>{value}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            selected={true}
                        >
                            {row.map((value, index) => (
                                <TableCell>{value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default FirstRowsData;
