import React from 'react';
import * as formatter from '../../../formatter/formatters';

const detailDate = props => {
    return (
        <React.Fragment>
            <hr/>
            <div>Creation Time: <b>{formatter.dateTime(props.createdDate)}</b></div>
        </React.Fragment>
    )
};

export default detailDate;

