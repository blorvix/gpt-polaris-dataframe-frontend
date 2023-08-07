import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "#/services/context";
import { getConversationDatasetsApi, loadDatasetsApi, setConversationDatasetsApi } from "#/services/requests";
import { DataSet } from '#/types/chat';
import MultipleSelectDataset from "./MultipleSelectDataset";

const SelectConversationDatasets = () => {
    const {currentConvId} = useContext(UserContext) as UserContextType;

    const [datasets, setDatasets] = useState<DataSet[]>([])
    const [selectedDatasets, setSelectedDatasets] = useState<number[]>([])

    useEffect(() => {
        loadDatasetsApi().then(data => {
            setDatasets(data)
        })
    }, [])

    useEffect(() => {
        getConversationDatasetsApi(currentConvId).then(resp => {
            setSelectedDatasets(resp.map((dataset: any) => dataset.id))
        })
    }, [currentConvId])

    const selectedDatesetsChanged = (dataset_ids: any) => {
        setConversationDatasetsApi(currentConvId, dataset_ids)
        setSelectedDatasets(dataset_ids)
    }

    return (
        <MultipleSelectDataset datasets={datasets} selectedDatasets={selectedDatasets} setSelectedDatasets={selectedDatesetsChanged} />
    )
}

export default SelectConversationDatasets;
