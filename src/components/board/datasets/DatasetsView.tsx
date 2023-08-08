import { useCallback, useEffect, useState } from 'react';
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
import EditDatasetDlg from './EditDatasetDlg';

const DatasetsView = () => {
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
        overwriteDatafileApi(datafile_id, dataset_id, decision).then(_ => {
            uploadSuccess(dataset_id)
        })
    }
    
    const createAnotherDataset = (datafile_id: number, create: boolean) => {
        createAnotherDatasetApi(datafile_id, create).then(resp => {
            uploadSuccess(resp.dataset)
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
        } else {
            setUpdatedDatasets(old => [...old, dataset_id])
        }
    }

    const findDatasetById = useCallback((dataset_id: number) => {
        for (const dataset of datasets) {
            if (dataset.id == dataset_id)
                return dataset
        }
        return {
            id: 0,
            name: ''
        }
    }, [datasets])

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
                setQuestionDlgData({
                    title: 'Doesn\'t belong to current dataset',
                    description: resp.message,
                    buttons: [{
                        name: 'Skip',
                        action: () => { createAnotherDataset(resp.datafile_id, false) },
                        color: 'inherit'
                    }, {
                        name: 'Yes',
                        action: () => { createAnotherDataset(resp.datafile_id, true) },
                        focus: true,
                        variant: 'contained',
                    }]
                })
                setQuestionDlgOpen(true)
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
            reloadDatasets()
            return true;
        } else {
            return false;
        }
    }

    const onDeleteButtonClicked = () => {
        setQuestionDlgData({
            title: 'Confirm',
            description: 'Do you really want to delete this dataset?',
            buttons: [{
                name: 'No',
                action: () => {},
                color: 'inherit'
            }, {
                name: 'Yes',
                action: () => {
                    deleteDatasetApi(currentDatasetId).then(_ => {
                        toast.success('Dataset is deleted successfully.')
                        reloadDatasets()
                    })
                },
                focus: true,
                color: 'error',
                variant: 'contained',
            }]
        })
        setQuestionDlgOpen(true)
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
                            onChange={onUploadFiles}
                            multiple
                        />
                        <Button variant="contained" color="primary" onClick={() => document.getElementById('datasetFileUpload')?.click()}>
                            Upload a New File
                        </Button>
                        {currentDatasetId != 0 && (
                            <>
                                <Button variant="contained" color="success" style={{marginLeft: '1em'}} onClick={onEditButtonClicked}>
                                    Edit
                                </Button>
                                <Button variant="contained" color="error" style={{marginLeft: '1em'}} onClick={onDeleteButtonClicked}>
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className='dataset-details'>
                    {currentDatasetId != 0 && (
                         <Box sx={{ width: '100%', typography: 'body1' }}>
                         <TabContext value={detailsTabIndex}>
                           <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                             <TabList onChange={(_: any, newValue: string) => {setDetailsTabIndex(newValue)}}>
                               <Tab label="Data" value="1" />
                               <Tab label="Insights" value="2" />
                               <Tab label="Cleanup" value="3" />
                               <Tab label="Visualization Help" value="4" />
                             </TabList>
                           </Box>
                           <TabPanel value="1"><DataDetails dataset_id={currentDatasetId} forceReload={reloadCurrentDataset}/></TabPanel>
                           <TabPanel value="2" sx={{padding: 0}}><InsightsConv dataset_id={currentDatasetId}/></TabPanel>
                           <TabPanel value="3" sx={{padding: 0}}><CleanupConv dataset_id={currentDatasetId}/></TabPanel>
                           <TabPanel value="4" sx={{padding: 0}}><VisualizationConv dataset_id={currentDatasetId}/></TabPanel>
                         </TabContext>
                       </Box>
                    )}
                </div>
            </div>

            {filesToUpload.length > updatedDatasets.length && (
                <div className='progress-wrapper'>
                    <CircularProgress />
                </div>
            )}

            <EditDatasetDlg open={editDatasetDlgOpen} setOpen={setEditDatasetDlgOpen} name={editDatasetName} setName={setEditDatasetName} onEditName={onUpdateDatasetName} />
            <QuestionDialog open={questionDlgOpen} setOpen={setQuestionDlgOpen} data={questionDlgData} />
        </div>
    )
}

export default DatasetsView;
