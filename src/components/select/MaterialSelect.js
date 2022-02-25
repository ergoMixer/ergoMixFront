import React from "react";
import { useClasses } from '../../hoc/useClasses';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});

export default function SimpleSelect(props) {
    const classes = useClasses(styles);

    return (
        <FormControl className={classes.formControl} style={{width: '100%'}}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                style={{width: '100%'}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                {...props}
            >
                {props.children}
            </Select>
        </FormControl>
    )
}