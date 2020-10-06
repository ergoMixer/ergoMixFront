import React from 'react';
import CopyRow from "../../details/CopyRow";
import DetailDate from "../../details/DetailDate";

const CovertMoreDetail = props => {
    return (
        <React.Fragment>
            <CopyRow content={props.id} label="ID"/>
            <hr/>
            <CopyRow content={props.deposit} label="Deposit Address"/>
            <DetailDate {...props}/>
            {/*<ModalAmount {...props}/>*/}
        </React.Fragment>
    )
};

export default CovertMoreDetail;