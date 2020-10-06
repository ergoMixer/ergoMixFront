import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    noMaxWidth: {
        maxWidth: 'none',
    }
}));

const TooltipC = props => {
    const classes = useStyles();
    return (
        <Tooltip {...props} classes={{ tooltip: classes.noMaxWidth }}>
            {props.children}
        </Tooltip>
    )
};


export default TooltipC;