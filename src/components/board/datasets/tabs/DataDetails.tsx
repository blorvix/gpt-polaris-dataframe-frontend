import { useState } from "react";
import DatafilesList from "./DatafilesList";
import './DataDetails.css'

const DataDetails = (props: {dataset_id: number}) => {
    const [currentDatafileId, setCurrentDatafileId] = useState<number>(0)

    return (
        <>
            <div className='data-details'>
                <DatafilesList dataset_id={props.dataset_id} currentDatafileId={currentDatafileId} setCurrentDatafileId={setCurrentDatafileId} />
            </div>
        </>
    )
}

export default DataDetails;
