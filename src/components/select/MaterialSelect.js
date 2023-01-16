import React from "react";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SimpleSelect(props) {
    return (
        <FormControl variant="standard" sx={{m: 1, minWidth: 120, width: '100%'}}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                fullWidth
                {...props}
            >
                {props.children}
            </Select>
        </FormControl>
    )
}
