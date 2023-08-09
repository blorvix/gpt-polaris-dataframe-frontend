import HelpConv from "./HelpConv";

const InsightsConv = (props: {dataset_id: number}) => {
    return (
        <HelpConv dataset_id={props.dataset_id} help_type="insights" help_text="Click to get insights of the dataset." />
    )
}

export default InsightsConv;
