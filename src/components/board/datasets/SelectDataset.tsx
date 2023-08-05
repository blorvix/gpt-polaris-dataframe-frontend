import { DataSet } from "#/types/chat";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectDataset = (props: {datasets: DataSet[], currentId: number, setCurrentId: any}) => {
    return (
        <FormControl sx={{ m: 1, minWidth: 280 }}>
            <InputLabel id="demo-simple-select-helper-label">Dataset</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={props.currentId.toString()}
                label="Dataset"
                onChange={e => props.setCurrentId(parseInt(e.target.value))}
            >
                <MenuItem value="">
                    <em></em>
                </MenuItem>
                {props.datasets.map(dataset => (
                    <MenuItem value={dataset.id}>{dataset.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectDataset;
