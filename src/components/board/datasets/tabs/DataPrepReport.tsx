import Iframe from "#/components/common/Iframe"

const DataPrepReport = (props: {dataset_id: number}) => {
    return (
        <Iframe src={`/datasets/${props.dataset_id}/dataprep`} height="100%" />
    )
}

export default DataPrepReport;
