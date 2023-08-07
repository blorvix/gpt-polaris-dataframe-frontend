import HelpConv from "./HelpConv";

const CleanupConv = (props: {dataset_id: number}) => {
    return (
        <HelpConv dataset_id={props.dataset_id} help_type="cleanup" help_text="Click me to perform data cleanup." />
    )
}

export default CleanupConv;
