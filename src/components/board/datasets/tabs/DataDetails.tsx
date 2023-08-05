import { useState } from "react";
import DatafilesList from "./DatafilesList";
import './DataDetails.css'
import FirstRowsData from "./FirstRowsData";

const DataDetails = (props: {dataset_id: number}) => {
    const [currentDatafileId, setCurrentDatafileId] = useState<number>(0)

    return (
        <>
            <div className='data-details'>
                <DatafilesList dataset_id={props.dataset_id} currentDatafileId={currentDatafileId} setCurrentDatafileId={setCurrentDatafileId} />
                <FirstRowsData datafile_id={currentDatafileId} />
            </div>
        </>
    )
}

export default DataDetails;
