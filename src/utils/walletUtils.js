import { NotificationManager } from "react-notifications";


export async function setupWallet(walletType) {
    let hasAccess = null;
    if (walletType === "Yoroi") {
        if (typeof cardano !== "object" || !cardano.yoroi) {   // eslint-disable-line
            NotificationManager.error(
                "Yoroi Not Found!",
                "Extension Error!",
                5000
            );
            return false
        } else {
            hasAccess = await ergo_request_read_access();  // eslint-disable-line
            if (hasAccess) {
                document.cookie = "wallet_type=Yoroi;path=/";
            }
        }
    } else if (walletType === "Nautilus") {
        if (typeof ergoConnector !== "object" || !ergoConnector.nautilus) {  // eslint-disable-line
            NotificationManager.error(
                "Nautilus Not Found!",
                "Extension Error!",
                5000
            );
            return false
        } else {
            hasAccess = await ergoConnector.nautilus.connect();  // eslint-disable-line
            if (hasAccess) {
                document.cookie = "wallet_type=Nautilus;path=/";
            }
        }
    }
    if (!hasAccess) {
        NotificationManager.error("Wallet access denied", "Extension Error!", 5000);
        return false;
    } else return true;

}

export const isWalletConnected = () => {
    const walletType = ('; ' + document.cookie)
        .split(`; wallet_type=`)
        .pop()
        .split(';')[0];
    return walletType;
}

export const getAddressWallet = async () => {
    return await ergo.get_unused_addresses() // eslint-disable-line
}
