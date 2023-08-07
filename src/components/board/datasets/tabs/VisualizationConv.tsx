import HelpConv from "./HelpConv";

const VisualizationConv = (props: {dataset_id: number}) => {
    return (
        <HelpConv dataset_id={props.dataset_id} help_type="vizhelp" help_text="Click me to get visualization help of the dataset." />
    )
}

export default VisualizationConv;
