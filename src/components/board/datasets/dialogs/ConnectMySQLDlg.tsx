import CableIcon from '@mui/icons-material/Cable';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { addMySQLTablesApi, connectMySQLApi } from '#/services/requests';
import SelectSQLTablesDlg, { SQLTable } from './SelectSQLTablesDlg';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';

export type ConnectionInfo = {
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
}

const EmptyConnectionInfo = {
    host: '',
    port: '',
    user: '',
    password: '',
    database: ''
}

const InputMySQLConnectionDlg = (props: { open: boolean, setOpen: any, onSuccess: any, connectionInfo: ConnectionInfo, setConnectionInfo: any }) => {
    const {open, setOpen, onSuccess, connectionInfo, setConnectionInfo} = props;

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<string>('')
    
    const [connectionError, setConnectionError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    
    const onOKButtonClicked = () => {
        setLoading(true)
        connectMySQLApi(connectionInfo).then(resp => {
            setLoading(false)
            if (resp.error) {
                setConnectionError(resp.error)
            } else {
                onSuccess(resp.tables)
            }
        })
    }

    useEffect(() => {
        if (!open) return
        setNameError('')
        setName('')
        setConnectionError('')
        setLoading(false)
    }, [open])

    return (
        <Dialog
            open={open}
            // onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth='xs'
        >
            <DialogTitle id="alert-dialog-title">
                Connect MySQL
            </DialogTitle>
            <DialogContent>
                {/* <TextField required label="Dataset Name" variant="standard" fullWidth value={name} onChange={e => setName(e.target.value)} sx={{marginBottom: '0.5em'}}
                error={!name.length || nameError.length != 0} helperText={!name.length ? 'Dataset name cannot be empty.' : nameError}/> */}
                <TextField required label="Host" variant="standard" fullWidth value={connectionInfo.host} sx={{ marginBottom: '0.5em' }}
                    onChange={e => setConnectionInfo((old: ConnectionInfo) => ({ ...old, host: e.target.value }))} />
                <TextField label="Port" required variant="standard" fullWidth value={connectionInfo.port} sx={{ marginBottom: '0.5em' }} 
                    onChange={e => setConnectionInfo((old: ConnectionInfo) => ({ ...old, port: e.target.value }))} />
                <TextField required label="User" variant="standard" fullWidth value={connectionInfo.user} sx={{ marginBottom: '0.5em' }}
                    onChange={e => setConnectionInfo((old: ConnectionInfo) => ({ ...old, user: e.target.value }))} />
                <TextField label="Password" variant="standard" type='password' fullWidth value={connectionInfo.password} sx={{ marginBottom: '0.5em' }}
                    onChange={e => setConnectionInfo((old: ConnectionInfo) => ({ ...old, passowrd: e.target.value }))} />
                <TextField required label="Database" variant="standard" fullWidth value={connectionInfo.database}
                    onChange={e => setConnectionInfo((old: ConnectionInfo) => ({ ...old, database: e.target.value }))} />
                {connectionError.length > 0 && (
                    <Typography color='red' fontSize='14px' marginTop='8px' fontStyle='italic'>{connectionError}</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='inherit' onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                <LoadingButton
                    onClick={onOKButtonClicked}
                    loading={loading}
                    // loadingIndicator="Connecting..."
                    endIcon={<CableIcon />}
                    loadingPosition="end"
                    variant="contained"
                    color='primary'
                    disabled={connectionInfo.host.length == 0 || connectionInfo.user.length == 0 || connectionInfo.database.length == 0}
                >
                    <span>Connect</span>
                </LoadingButton>
                {/* <Button variant='contained' color='primary' onClick={onOKButtonClicked} 
                    disabled={connectionInfo.host.length == 0 || connectionInfo.user.length == 0 || connectionInfo.database.length == 0}>
                    Connect
                </Button> */}
            </DialogActions>
        </Dialog>
    );
}

const ConnectMySQLDlg = (props: { open: boolean, setOpen: any, onSuccess: any }) => {
    const {open, setOpen, onSuccess} = props
    const [inputDlgOpen, setInputDlgOpen] = useState<boolean>(false)
    const [tablesDlgOpen, setTablesDlgOpen] = useState<boolean>(false)
    const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({ ...EmptyConnectionInfo })
    const [sqlTables, setSqlTables] = useState<SQLTable[]>([])

    useEffect(() => {
        if (!open) {
            setTablesDlgOpen(false)
            setInputDlgOpen(false)
        } else {
            setConnectionInfo({ ...EmptyConnectionInfo })
            setSqlTables([])
            setTablesDlgOpen(false)
            setInputDlgOpen(true)
        }
    }, [open])

    const onAfterConnect = (tables: SQLTable[]) => {
        setSqlTables(tables)
        setInputDlgOpen(false)
        setTablesDlgOpen(true)
    }

    const onAfterSelectTables = (selectedTables: string[]) => {
        addMySQLTablesApi(connectionInfo, selectedTables).then((resp) => {
            if (resp.error) {
                toast.error('MySQL connection failed')
            } else {
                onSuccess(resp)
                setOpen(false)
            }
        })
    }

    return (
        <div className='connect-mysql-dlg'>
            <InputMySQLConnectionDlg open={inputDlgOpen} setOpen={setOpen} onSuccess={onAfterConnect} connectionInfo={connectionInfo} setConnectionInfo={setConnectionInfo} />
            <SelectSQLTablesDlg open={tablesDlgOpen} setOpen={setOpen} tables={sqlTables} onSuccess={onAfterSelectTables} />
        </div>
    )
}

export default ConnectMySQLDlg;
