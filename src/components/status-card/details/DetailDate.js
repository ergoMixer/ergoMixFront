import React from 'react';

const detailDate = props => {
    return (
        <React.Fragment>
            <hr/>
            <div>Creation Time: <b>{props.createdDate}</b></div>
        </React.Fragment>
    )
};

export default detailDate;

