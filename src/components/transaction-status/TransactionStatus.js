import React from "react";

const TransactionStatus = (props) => {
    const withdrawnTxId = props.mixItem.withdrawTxId;
    const withdrawStatus = props.mixItem.withdrawStatus;
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
            return (withdrawStatus === "under hop" ? `Hopping. Round ${props.mixItem.hopRounds}` : "Transaction being generated")
        }
    } else {
        return null
    }
}

export default TransactionStatus;
