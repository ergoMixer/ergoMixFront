import QRCode from "react-qr-code";
import React from "react";

const explorerBaseUrl = "https://explorer.ergoplatform.com/payment-request"
const QRCodeUrl = props => {
    const value = explorerBaseUrl + "?address=" + props.address + "&amount=" + props.amount;
    return (
        <QRCode
            size={320}
            value={value}
        />
    )
}

export default QRCodeUrl;
