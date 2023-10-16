import React from "react";
import Tooltip from "../tooltip/Tooltip";
import InfoIcon from "@mui/icons-material/InfoOutlined"

const TransactionStatus = (props) => {
    const withdrawnTxId = props.mixItem.withdrawTxId;
    const withdrawStatus = props.mixItem.withdrawStatus;
    const failedReason = props.mixItem.failedReason ? props.mixItem.failedReason.split("\n"): [];
    console.log(props)
    if (
        withdrawStatus === "under hop"
        || withdrawStatus === "withdrawn"
        || withdrawStatus === "hopping"
        || withdrawStatus === "minting"
        || withdrawStatus === "withdrawing"
    ) {
        if (withdrawnTxId !== "") {
            return (
                <button className="btn btn-outline-primary"
                        onClick={() => props.showTransaction(props.mixItem)}
                >{withdrawStatus === "hopping" ? "View Initiate Hop Transaction" : "View Transaction"}</button>
            )
        } else {
            if(failedReason && failedReason.length > 0){
                return (
                    <div style={{display: "flex", justifyContent: "center"}}>
                        Failed to withdraw &nbsp;&nbsp;
                    <Tooltip title={<React.Fragment>{failedReason.map(item => <div>{item}</div>)}</React.Fragment>} arrow>
                        <InfoIcon/>
                    </Tooltip>
                    </div>
                )
            }
            return (withdrawStatus === "under hop" ? `Hopping. Round ${props.mixItem.hopRounds}` : "Transaction being generated")
        }
    } else {
        return null
    }
}

export default TransactionStatus;
