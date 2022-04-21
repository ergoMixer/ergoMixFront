import React from 'react';
import { getAddressWallet, isWalletConnected, setupWallet } from "../../utils/walletUtils";
import WalletSelectionModal from "../WalletSelectionModal/WalletSelectionModal";
import { NotificationManager } from "react-notifications";

class LoadFromWallet extends React.Component {
    state = {
        focus: '',
        count: '',
        showWalletModal: false,
    }

    isLoadingEnabled = () => {
        let count = this.props.count;
        if (this.props.manualCount) {
            count = this.state.count
        }
        if (count) {
            return true;
        }
        return false;
    }

    loadAddressFromWallet = async (walletType) => {
        if (!this.isLoadingEnabled()) {
            return;
        }
        let count = this.props.count;
        if (this.props.manualCount) {
            count = this.state.count
        }
        this.setState({loadingWallet: true});
        const res = await setupWallet(walletType);
        if (res) {
            const addresses = await getAddressWallet();
            if (count > addresses.length) {
                NotificationManager.warning('There is not enough address generated in your wallet we' +
                    ' don\'t fill the remaining addresses', 'Address Warning!', 5000);
            }
            this.props.setAddress(addresses.slice(0, count));
            this.setState({loadingWallet: false});
        } else {
            this.setState({loadingWallet: false});
        }
    };

    walletSelection = (walletType) => {
        this.setState({showWalletModal: false});
        this.loadAddressFromWallet(walletType);
    }

    closeModal = () => {
        this.setState({showWalletModal: false});
    }

    render() {
        const loadingEnabled = this.isLoadingEnabled();
        const elementRowClass = this.props.manualCount ? "col-md-12 col-xs-12" : "col-md-6 col-xs-12";
        return (
            <React.Fragment>
                <WalletSelectionModal
                    closeModal={this.closeModal}
                    showModal={this.state.showWalletModal}
                    walletCallBack={this.walletSelection}
                />

                <div className="col-12 pb-2">
                    Connect to a Wallet to import your desired number of unused addresses automatically(if exist!).
                    This information will be used just now and for this specific purpose.
                </div>

                <div className={elementRowClass}>
                    <div className={"form-group bmd-form-group " +
                        (this.state.focus === "count" ? "is-focused" : "") +
                        ((this.state.count !== "" && this.state.focus !== "count") ? "is-filled" : "")}>
                        <label htmlFor="Count" className="bmd-label-floating">Count</label>
                        <input type="text"
                               className="form-control"
                               value={this.state.count}
                               onChange={event => {
                                   this.setState({count: event.target.value})
                               }}
                               onFocus={() => this.setState({focus: "count"})}
                               onBlur={() => this.setState({focus: ""})}
                               id="Count"/>
                    </div>
                </div>
                <div className="col-md-12 text-center">
                    <button onClick={() => {
                        const walletType = isWalletConnected();
                        if (walletType) {
                            this.loadAddressFromWallet(walletType);
                        } else {
                            this.setState({showWalletModal: true})
                        }
                    }}
                            disabled={!loadingEnabled}
                            style={loadingEnabled ? {} : {cursor: 'not-allowed'}}
                            className={"btn " + (loadingEnabled ? "btn-outline-primary" : "btn-outline")}>
                        {this.state.loadingWallet ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                        {this.state.loadingWallet ? " " : null}
                        Load addresses
                    </button>
                </div>
            </React.Fragment>
        )
    }
}

export default LoadFromWallet;
