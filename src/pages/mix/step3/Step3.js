import React from 'react';
import { NotificationManager } from "react-notifications";
import { ApiNetwork } from "../../../network/api";
import * as formatter from '../../../formatter/formatters';
import { TOKEN_ERGO_AMOUNT } from "../../../const";
import Panel from "../../../components/panel/Panel";
import { getAddressWallet, isWalletConnected, setupWallet } from "../../../utils/walletUtils";
import WalletSelectionModal from "../../../components/WalletSelectionModal/WalletSelectionModal";

class Step3 extends React.Component {
    state = {
        addresses: [],
        fillingType: "manual",
        inputJson: "",
        nodeAddress: "",
        nodeApiKey: "",
        focus: "",
        loadingNode: false,
        showWalletModal: false,
    };

    componentDidMount = () => {
        let addresses = this.props.addresses ? [...this.props.addresses] : [];
        let new_addresses = [];
        this.props.boxes.forEach(box => {
            const tmp_addresses = addresses.filter(item => item.amount === box.amount);
            for (let index = 0; index < box.count; index++) {
                if (index < tmp_addresses.length) {
                    new_addresses.push({...tmp_addresses[index]});
                } else {
                    let tmp_address = {
                        amount: 0,
                        withdraw: "",
                        token: 0,
                        mixingTokenId: "",
                        mixingTokenAmount: 0
                    }
                    if (this.props.token.id) {
                        tmp_address.mixingTokenId = this.props.token.id;
                        tmp_address.mixingTokenAmount = box.amount;
                        tmp_address.amount = TOKEN_ERGO_AMOUNT;
                    } else {
                        tmp_address.amount = box.amount;
                    }
                    new_addresses.push(tmp_address);
                }
            }
        });
        const filling = this.props.filling === undefined ? this.state.fillingType : this.props.filling;
        this.setState({addresses: new_addresses, fillingType: filling});
        if (this.props.saveValue) {
            this.props.saveValue({addresses: new_addresses});
        }
        this.setFillingType(filling);
    };

    setFillingType = fillingType => {
        this.setValidate(this.state.addresses, fillingType);
        this.setState({fillingType: fillingType});
        const filling = fillingType === "manual" ? "manual" : "manual";
        this.props.saveValue({filling: filling});
    };

    setValidate = (addresses, fillingType) => {
        var emptyCount = 0;
        addresses = addresses === undefined ? this.state.addresses : addresses;
        fillingType = fillingType === undefined ? this.state.fillingType : fillingType;
        addresses.forEach(item => {
            if (!item.withdraw) emptyCount++;
        });
        this.props.setValid(emptyCount === 0 || fillingType === "manual" || fillingType === "later");
    };

    saveAddress = (index, value) => {
        let addresses = [...this.state.addresses];
        addresses[index] = {...addresses[index], withdraw: value};
        this.storeAddresses(addresses);
        this.setState({addresses: addresses})
    };

    storeAddresses = addresses => {
        if (this.props.saveValue) {
            this.props.saveValue({addresses: addresses});
        }
        this.setValidate(addresses);
    };

    loadJsonAddress = () => {
        const addressJson = JSON.parse(this.state.inputJson);
        this.loadJsonAddressObject(addressJson)
    };

    loadJsonAddressObject = addressJson => {
        let addresses = [...this.state.addresses];
        addressJson.forEach((value, index) => {
            if (addresses.length > index) {
                addresses[index] = {...addresses[index], withdraw: value};
            }
        });
        this.storeAddresses(addresses);
        this.setState({addresses: addresses, inputJson: ""});
    };

    loadAddressFromNode = () => {
        this.setState({loadingNode: true});
        ApiNetwork.getNodeAddress(this.state.nodeAddress, this.state.nodeApiKey, this.state.addresses.length).then(response => {
            this.setState({loadingNode: false});
            this.loadJsonAddressObject(response.data);
        }).catch(error => {
            this.setState({loadingNode: false});
            NotificationManager.error(formatter.errorMessage(error), 'Network problem!', 5000);
        })
    };

    loadAddressesArray = addressesArray => {
        let addresses = [...this.state.addresses];
        const hasEnough = addressesArray.length >= addresses.length;
        addressesArray.forEach((value, index) => {
            if (addresses.length > index) {
                addresses[index] = {...addresses[index], withdraw: value};
            }
        });
        this.storeAddresses(addresses);
        this.setState({addresses: addresses, inputJson: ""});
        if (!hasEnough) {
            NotificationManager.warning('There is not enough address generated in your wallet we' +
                ' don\'t fill the remaining addresses', 'Address Warning!', 5000);
        }
    }

    loadAddressFromWallet = async (walletType) => {
        this.setState({loadingWallet: true});
        const res = await setupWallet(walletType);
        if (res) {
            const addresses = await getAddressWallet();
            this.loadAddressesArray(addresses);
            this.setState({loadingWallet: false});
        } else {
            this.setState({loadingWallet: false});
        }
    }

    walletSelection = (walletType) => {
        this.setState({showWalletModal: false});
        this.loadAddressFromWallet(walletType);
    }

    closeModal = () => {
        this.setState({showWalletModal: false});
    }

    render() {
        return (
            <React.Fragment>
                <WalletSelectionModal
                    closeModal={this.closeModal}
                    showModal={this.state.showWalletModal}
                    walletCallBack={this.walletSelection}
                />
                <div className="row">
                    <div className="col-12 text-center">
                        <Panel>
                            <h4>
                                Use different withdraw address for each box;
                                merging outputs undoes privacy gains provided by mixing.<br/>
                                Withdraw addresses can be modified later before mixing is finished.
                            </h4>
                        </Panel>
                    </div>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header card-header-tabs card-header-primary">
                                <div className="nav-tabs-navigation">
                                    <div className="nav-tabs-wrapper">
                                        <ul className="nav nav-tabs" data-tabs="tabs">
                                            <li className="nav-item">
                                                <a className={this.state.fillingType === "manual" ? "nav-link active" : "nav-link"}
                                                   onClick={() => this.setFillingType("manual")}>
                                                    <i className="material-icons">edit</i> Set Manually
                                                    <div className="ripple-container"/>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className={this.state.fillingType === "json" ? "nav-link active" : "nav-link"}
                                                   onClick={() => this.setFillingType("json")}>
                                                    <i className="material-icons">settings_ethernet</i> Using Json
                                                    <div className="ripple-container"/>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className={this.state.fillingType === "node" ? "nav-link active" : "nav-link"}
                                                   onClick={() => this.setFillingType("node")}>
                                                    <i className="material-icons">cloud</i> Using a Node
                                                    <div className="ripple-container"/>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className={this.state.fillingType === "dapp" ? "nav-link active" : "nav-link"}
                                                   onClick={() => this.setFillingType("dapp")}>
                                                    <i className="material-icons"
                                                       style={{color: "white"}}>exit_to_app</i> Using Dapp Connector
                                                    <div className="ripple-container"/>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className={this.state.fillingType === "later" ? "nav-link active" : "nav-link"}
                                                   onClick={() => this.setFillingType("later")}>
                                                    <i className="material-icons">arrow_right_alt</i> Set Later
                                                    <div className="ripple-container"/>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row"
                                     style={this.state.fillingType === 'manual' ? {} : {"display": 'none'}}>
                                    <div className="col-12 pb-2">
                                        You can set any of withdraw addresses now and leave others empty.
                                    </div>
                                </div>
                                <div style={{"display": this.state.fillingType === 'json' ? 'block' : 'none'}}>
                                    <div className={"form-group bmd-form-group " +
                                        (this.state.focus === "inputJson" ? "is-focused" : "") +
                                        ((this.state.inputJson && this.state.focus !== "inputJson") ? "is-filled" : "")}>
                                        <label htmlFor="inputJson" className="bmd-label-floating">Enter a list of
                                            addresses
                                            to be used. ["addr1", "addr2",
                                            ...]</label>
                                        <textarea
                                            className="form-control "
                                            id="intpuJson"
                                            value={this.state.inputJson}
                                            onChange={event => {
                                                this.setState({inputJson: event.target.value})
                                            }}
                                            onFocus={() => this.setState({focus: "inputJson"})}
                                            onBlur={() => this.setState({focus: ""})}
                                            rows={5}/>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 text-center">
                                            <button onClick={this.loadJsonAddress}
                                                    className="btn btn-outline-primary">Load From Json
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row"
                                     style={this.state.fillingType === 'node' ? {} : {"display": 'none'}}>
                                    <div className="col-12 pb-2">
                                        Connect to a node to import addresses automatically.
                                        This information will be used just now and for this specific purpose.
                                    </div>
                                    <div className="col-md-6 col-xs-12">
                                        <div className={"form-group bmd-form-group " +
                                            (this.state.focus === "nodeAddress" ? "is-focused" : "") +
                                            ((this.state.nodeAddress && this.state.focus !== "nodeAddress") ? "is-filled" : "")}>
                                            <label htmlFor="nodeAddress" className="bmd-label-floating">Node Address
                                                (http://127.0.0.1:9053)</label>
                                            <input type="text"
                                                   className="form-control"
                                                   value={this.state.nodeAddress}
                                                   onChange={event => {
                                                       this.setState({nodeAddress: event.target.value})
                                                   }}
                                                   onFocus={() => this.setState({focus: "node address"})}
                                                   onBlur={() => this.setState({focus: ""})}
                                                   id="nodeAddress"/>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-xs-12">
                                        <div className={"form-group bmd-form-group " +
                                            (this.state.focus === "nodeApiKey" ? "is-focused" : "") +
                                            ((this.state.nodeApiKey && this.state.focus !== "nodeApiKey") ? "is-filled" : "")}>
                                            <label htmlFor="nodeApiKey" className="bmd-label-floating">Node Api
                                                Key</label>
                                            <input type="text"
                                                   className="form-control"
                                                   value={this.state.nodeApiKey}
                                                   onChange={event => {
                                                       this.setState({nodeApiKey: event.target.value})
                                                   }}
                                                   onFocus={() => this.setState({focus: "node api_key"})}
                                                   onBlur={() => this.setState({focus: ""})}
                                                   id="nodeApiKey"/>
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button onClick={this.loadAddressFromNode}
                                                className="btn btn-outline-primary">
                                            {this.state.loadingNode ?
                                                <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                            {this.state.loadingNode ? " " : null}
                                            Load addresses
                                        </button>
                                    </div>
                                </div>
                                <div className="row"
                                     style={this.state.fillingType === 'dapp' ? {} : {"display": 'none'}}>
                                    <div className="col-12 pb-2">
                                        Connect to a Wallet to import addresses automatically.
                                        This information will be used just now and for this specific purpose.
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
                                                className="btn btn-outline-primary">
                                            {this.state.loadingWallet ?
                                                <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                            {this.state.loadingWallet ? " " : null}
                                            Load addresses
                                        </button>
                                    </div>
                                </div>
                                {this.state.fillingType === "later" ? (
                                    <div className="col-12">
                                        You can set addresses later.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead className=" text-primary">
                                            <tr>
                                                <th>Amount</th>
                                                <th>Withdraw Address</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.addresses.map((address, index) => (
                                                <tr key={index}>
                                                    <td>{formatter.token(address.mixingTokenId ? address.mixingTokenAmount : address.amount, address.mixingTokenId)}</td>
                                                    <td>
                                                        <input className={"form-control"}
                                                               autoFocus={index === 0}
                                                               value={address.withdraw}
                                                               onChange={(event) => this.saveAddress(index, event.target.value)}/>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    };
}

export default Step3;
