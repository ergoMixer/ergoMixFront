import React from "react";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SimpleSelect(props) {
    return (
        <FormControl sx={{m: 1, minWidth: 120, width: '100%'}}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                style={{width: '100%'}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                {...props}
                sx={{ marginTop: 2 }}
            >
                {props.children}
            </Select>
        </FormControl>
    )
}