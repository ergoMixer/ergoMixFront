import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SimpleSelect(props) {
    const classes = useStyles();

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