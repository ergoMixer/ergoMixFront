import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const TooltipC = props => {
    return (
        <Tooltip {...props} sx={{ maxWidth: 'none' }}>
            {props.children}
        </Tooltip>
    )
};


export default TooltipC;