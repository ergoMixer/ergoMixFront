import React from 'react';
import * as formatter from '../../../formatter/formatters'
import CopyRow from "./CopyRow";

const modalAmount = props => {
    return (
        <React.Fragment>
            {props.mixingTokenId ? (
                <React.Fragment>
                    <hr/>
                    <CopyRow label="Token ID" content={props.mixingTokenId}/>
                    <hr/>
                    <div>Total Tokens: <b>{formatter.token(props.tokenAmount, props.mixingTokenId)}</b></div>
                </React.Fragment>
            ) : null}
            <hr/>
            <div>Total Ergs: <b>{formatter.erg(props.amount)}</b></div>
        </React.Fragment>
    )
};

export default modalAmount;

