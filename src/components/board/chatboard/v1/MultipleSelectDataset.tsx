import { DataSet } from "#/types/chat";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const MultipleSelectDataset = (props: { datasets: DataSet[], selectedDatasets: number[], setSelectedDatasets: any }) => {
    const handleChange = (event: any) => {
        const value = event.target.value;
        props.setSelectedDatasets(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <FormControl style={{ minWidth: '350px' }}>
            <InputLabel id="demo-simple-select-helper-label">Dataset</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="Dataset"
                multiple
                value={props.selectedDatasets}
                onChange={handleChange}
                input={<OutlinedInput label="Dataset" />}
                renderValue={(selected) => {
                    const dataset_names = selected.map((id: number) => {
                        for (const dataset of props.datasets) {
                            if (dataset.id == id)
                                return dataset.name
                        }
                        return ''
                    }).join(', ')
                    // if (selected)
                    return `${selected.length} dataset` + (selected.length > 1 ? 's' : '') + ': ' + dataset_names
                }}
                MenuProps={MenuProps}
            >
                {/* <MenuItem value="0">
                    <em></em>
                </MenuItem> */}
                {props.datasets.map(dataset => (
                    <MenuItem key={dataset.id} value={dataset.id}>
                        <Checkbox checked={props.selectedDatasets.indexOf(dataset.id) > -1} />
                        <ListItemText primary={dataset.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default MultipleSelectDataset;
