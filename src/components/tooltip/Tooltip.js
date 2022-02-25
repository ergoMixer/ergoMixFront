import React from 'react';
import { useClasses } from '../../hoc/useClasses';
import Tooltip from '@mui/material/Tooltip';

const styles = {
    noMaxWidth: {
        maxWidth: 'none',
    }
};

const TooltipC = props => {
    const classes = useClasses(styles);
    return (
        <Tooltip {...props} classes={{ tooltip: classes.noMaxWidth }}>
            {props.children}
        </Tooltip>
    )
};


export default TooltipC;