import React from 'react';
import ModalAmount from "./details/ModalAmount";
import DetailDate from "./details/DetailDate";
import CopyRow from "./details/CopyRow";


const moreDetail = props => (
    <React.Fragment>
        <CopyRow content={props.id} label="ID"/>
        <hr/>
        <CopyRow content={props.deposit} label="Deposit Address"/>
        <DetailDate {...props}/>
        <ModalAmount {...props}/>
    </React.Fragment>
)

export default moreDetail;

