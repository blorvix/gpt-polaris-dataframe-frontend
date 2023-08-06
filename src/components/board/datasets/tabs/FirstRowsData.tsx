import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { getDatafileFirstRowsApi } from '#/services/requests';

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
        <Table size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    {columns.map((value, index) => (
                        <TableCell key={index}>{value}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {row.map((value, index) => (
                            <TableCell key={index}>{value}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default FirstRowsData;
