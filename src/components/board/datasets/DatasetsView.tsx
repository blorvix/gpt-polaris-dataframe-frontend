import { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import { DataSet } from '#/types/chat';
import { createAnotherDatasetApi, deleteDatasetApi, loadDatasetsApi, overwriteDatafileApi, updateDatasetNameApi, uploadDatafileApi } from '#/services/requests';
import './DatasetsView.css'
import SelectDataset from './SelectDataset';
import QuestionDialog, { QuestionDialogDataType } from '#/components/common/QuestionDialog';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InsightsConv from './tabs/InsightsConv';
import CleanupConv from './tabs/CleanupConv';
import VisualizationConv from './tabs/VisualizationConv';
import DataDetails from './tabs/DataDetails';
import EditDatasetDlg from './dialogs/EditDatasetDlg';
import { useConfirm } from 'material-ui-confirm';
import ConnectMySQLDlg from './dialogs/ConnectMySQLDlg';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import DataPrepReport from './tabs/DataPrepReport';

const DatasetsView = () => {
    const confirm = useConfirm()

    const [datasets, setDatasets] = useState<DataSet[]>([])
    const [currentDatasetId, setCurrentDatasetId] = useState<number>(0);
    const [reloadCurrentDataset, setReloadCurrentDataset] = useState<boolean>(false);
    
    const [questionDlgOpen, setQuestionDlgOpen] = useState<boolean>(false);
    const [questionDlgData, setQuestionDlgData] = useState<QuestionDialogDataType>({
        title: '',
        description: '',
        buttons: []
    })

    const [editDatasetDlgOpen, setEditDatasetDlgOpen] = useState<boolean>(false)
    const [editDatasetName, setEditDatasetName] = useState<string>('')

    const [connectMySQLDlgOpen, setConnectMySQLDlgOpen] = useState<boolean>(false)

    const [filesToUpload, setFilesToUpload] = useState<Array<any>>([]);
    const [updatedDatasets, setUpdatedDatasets] = useState<Array<number>>([])

    const [detailsTabIndex, setDetailsTabIndex] = useState<string>('1');

    const reloadDatasets = () => {
        setFilesToUpload([])
        setUpdatedDatasets([])
        setQuestionDlgOpen(false)
        loadDatasetsApi().then(data => {
            setDatasets(data)
            let i;
            for (i = 0; i < data.length; i++) {
                if (data[i].id == currentDatasetId)
                    break
            }
            if (i == data.length) {
                if (data.length == 0) {
                    setCurrentDatasetId(0)
                } else {
                    setCurrentDatasetId(data[0].id)
                }
            } else {
                setReloadCurrentDataset(!reloadCurrentDataset)
            }
        })
    }

    useEffect(() => {
        reloadDatasets()
    }, [])

    const overwriteDatafile = (datafile_id: number, dataset_id: number, decision: string) => {
        overwriteDatafileApi(datafile_id, dataset_id, decision).then(resp => {
            uploadSuccess(dataset_id)
            if (resp.message)
                toast.success(resp.message)
        })
    }
    
    const createAnotherDataset = (datafile_id: number, create: boolean) => {
        createAnotherDatasetApi(datafile_id, create).then(resp => {
            uploadSuccess(resp.dataset)
            if (resp.message)
                toast.success(resp.message)
        })
    }

    const onUploadFiles = (event: any) => {
        if (event.target.files.length == 0) return

        setUpdatedDatasets([])
        setFilesToUpload(event.target.files)
    }

    const uploadSuccess = (dataset_id: number) => {
        if (filesToUpload.length == updatedDatasets.length + 1) {
            reloadDatasets()
            // @ts-ignore
            document.getElementById('datasetFileUpload').value = ''
        } else {
            setUpdatedDatasets(old => [...old, dataset_id])
        }
    }

    const findDatasetById = (dataset_id: number) => {
        for (const dataset of datasets) {
            if (dataset.id == dataset_id)
                return dataset
        }
        return {
            id: 0,
            name: ''
        }
    }

    useEffect(() => {
        if (filesToUpload.length <= updatedDatasets.length) return

        uploadDatafileApi(currentDatasetId, filesToUpload[updatedDatasets.length], updatedDatasets).then(resp => {
            if (resp.ask == 'no') {
                toast.success(resp.message)
                uploadSuccess(resp.dataset_id)
            } else if (resp.ask == 'overwrite') {
                setQuestionDlgData({
                    title: 'Same datafile exists',
                    description: resp.message,
                    buttons: [{
                        name: 'Skip',
                        action: () => { overwriteDatafile(resp.datafile_id, resp.dataset_id, 'skip') },
                        color: 'inherit'
                    }, {
                        name: 'Rename',
                        action: () => { overwriteDatafile(resp.datafile_id, resp.dataset_id, 'rename') },
                        color: 'success'
                    }, {
                        name: 'Overwrite',
                        action: () => { overwriteDatafile(resp.datafile_id, resp.dataset_id, 'overwrite') },
                        focus: true,
                        variant: 'contained',
                    }]
                })
                setQuestionDlgOpen(true)
            } else if (resp.ask == 'other') {
                confirm({
                    title: `Does not belong to current dataset`,
                    description: resp.message,
                    confirmationText: 'Yes',
                    cancellationText: 'Skip'
                }).then(() => { createAnotherDataset(resp.datafile_id, true) })
                .catch(() => { createAnotherDataset(resp.datafile_id, false) })
            }
        })
    }, [filesToUpload, updatedDatasets])

    const onEditButtonClicked = () => {
        setEditDatasetName(findDatasetById(currentDatasetId).name)
        setEditDatasetDlgOpen(true)
    }

    const onUpdateDatasetName = async () => {
        const resp = await updateDatasetNameApi(currentDatasetId, editDatasetName)
        if (resp.success == 'yes') {
            setDatasets((old_datasets: DataSet[]) => {
                const new_datasets = [...old_datasets]
                for (const dataset of new_datasets)
                    if (dataset.id == currentDatasetId) {
                        dataset.name = editDatasetName
                        break
                    }
                return new_datasets
            })
            return true;
        } else {
            return false;
        }
    }

    const onDeleteButtonClicked = () => {
        confirm({
            description: 'Do you really want to delete this dataset?',
        }).then(() => {
            deleteDatasetApi(currentDatasetId).then(_ => {
                toast.success('Dataset is deleted successfully.')
                // setDatasets(old_datasets => old_datasets.filter(dataset => dataset.id !== currentDatasetId))
                reloadDatasets()
            })
        })
    }

    const onConnectMySQLButtonClicked = () => {
        setConnectMySQLDlgOpen(true)
    }

    return (
        <div className='datasets-view-wrapper'>
            <div className='datasets-view'>
                <div className="select-div">
                    <SelectDataset datasets={datasets} currentId={currentDatasetId} setCurrentId={setCurrentDatasetId} />
                    <div>
                        <input
                            type="file"
                            id="datasetFileUpload"
                            className="hidden"
                            accept='.csv, .xlsx'
                            onChange={onUploadFiles}
                            multiple
                        />
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <>
                                    <Button variant="contained" color='primary' {...bindTrigger(popupState)}>
                                        + Add new data
                                    </Button>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {document.getElementById('datasetFileUpload')?.click(); popupState.close()}}>Upload a File</MenuItem>
                                        <MenuItem onClick={() => {onConnectMySQLButtonClicked(); popupState.close()}}>Connect MySQL</MenuItem>
                                    </Menu>
                                </>
                            )}
                        </PopupState>
                        {/* <Button variant="contained" color='primary' onClick={() => document.getElementById('datasetFileUpload')?.click()}>
                            Upload a New File
                        </Button>
                        <Button variant="contained" color="primary" style={{marginLeft: '1em'}} onClick={onConnectMySQLButtonClicked}>
                            Connect MySQL
                        </Button> */}
                        {currentDatasetId != 0 && (
                            <>
                                <Button variant="contained" color="primary" style={{marginLeft: '1em'}} onClick={onEditButtonClicked}>
                                    Edit
                                </Button>
                                <Button variant="contained" color="primary" style={{marginLeft: '1em'}} onClick={onDeleteButtonClicked}>
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className='dataset-details'>
                    {currentDatasetId != 0 && (
                         <Box sx={{ width: '100%', typography: 'body1', height: '100%' }}>
                         <TabContext value={detailsTabIndex}>
                           <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                             <TabList onChange={(_: any, newValue: string) => {setDetailsTabIndex(newValue)}}>
                               <Tab label="Data" value="1" />
                               <Tab label="Report" value="2" />
                               <Tab label="Insights" value="3" />
                               <Tab label="Cleanup" value="4" />
                               <Tab label="Visualization Help" value="5" />
                             </TabList>
                           </Box>
                           <TabPanel value="1" sx={{padding: 0}}><DataDetails dataset_id={currentDatasetId} forceReload={reloadCurrentDataset}/></TabPanel>
                           <TabPanel value="2" sx={{padding: 0}}><DataPrepReport dataset_id={currentDatasetId}/></TabPanel>
                           <TabPanel value="3" sx={{padding: 0}}><InsightsConv dataset_id={currentDatasetId}/></TabPanel>
                           <TabPanel value="4" sx={{padding: 0}}><CleanupConv dataset_id={currentDatasetId}/></TabPanel>
                           <TabPanel value="5" sx={{padding: 0}}><VisualizationConv dataset_id={currentDatasetId}/></TabPanel>
                         </TabContext>
                       </Box>
                    )}
                </div>
            </div>

            {filesToUpload.length > updatedDatasets.length && (
                <div className='progress-wrapper absolute'>
                    <CircularProgress />
                </div>
            )}

            <EditDatasetDlg open={editDatasetDlgOpen} setOpen={setEditDatasetDlgOpen} name={editDatasetName} setName={setEditDatasetName} onEditName={onUpdateDatasetName} />
            <QuestionDialog open={questionDlgOpen} setOpen={setQuestionDlgOpen} data={questionDlgData} />
            <ConnectMySQLDlg open={connectMySQLDlgOpen} setOpen={setConnectMySQLDlgOpen} onSuccess={reloadDatasets} />
        </div>
    )
}

export default DatasetsView;
