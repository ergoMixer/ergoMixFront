import React from 'react';
import * as formatter from "../../../formatter/formatters";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "../../tooltip/Tooltip";
import {connect} from "react-redux";


const CovertTokenProgress = props => {
    const getTooltip = () => {
        return (
            <div>
                <div className="tooltip-text">Last Activity: {formatter.dateTime(props.lastActivity)}</div>
                <div className="tooltip-text">Completed: {formatter.token(props.currentMixingAmount - props.runningMixingAmount, props.tokenId)}</div>
                <div className="tooltip-text">Mixing: {formatter.token(props.runningMixingAmount, props.tokenId)}</div>
            </div>
        )
    }
    let amount = props.need;
    if(!props.tokenId){
        amount += props.distributeFee;
    }
    amount -= props.confirmedDeposit % amount;
    return (
        <React.Fragment>
            <Tooltip title={getTooltip()} arrow>
                <div>
                    Pending Deposit: {formatter.token(amount, props.tokenId)} /
                    Deposited: {formatter.token(props.confirmedDeposit, props.tokenId)}
                </div>
            </Tooltip>

            <LinearProgress variant='determinate' color="secondary" value={100 * (props.confirmedDeposit % props.need) / props.need}/>
        </React.Fragment>
    )
};
const mapStateToProps = state => ({
    startFee: state.startFee,
    distributeFee: state.distributeFee,
});

export default connect(mapStateToProps)(CovertTokenProgress);
