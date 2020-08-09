import React from 'react';
import * as formatter from "../../../formatter/formatters";

const RingHeader = props => {
    return (
        <div className="card-header card-header-warning card-header-icon">
            <div className="card-icon">
                <i className="">{formatter.token(props.amount, props.tokenId, true)}</i>
            </div>
        </div>
    )
};

export default RingHeader;