import DatafilesList from "./DatafilesList";
import './DataDetails.css'

const DataDetails = (props: {dataset_id: number, forceReload: boolean}) => {
    return (
        <>
            <div className='data-details'>
                <DatafilesList {...props} />
            </div>
        </>
    )
}

export default DataDetails;
