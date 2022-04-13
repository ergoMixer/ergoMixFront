import React from 'react';
import { NotificationManager } from "react-notifications";
import { ApiNetwork } from "../../../network/api";
import * as formatter from '../../../formatter/formatters';
import Tooltip from "../../../components/tooltip/Tooltip";
import { getAddressWallet, isWalletConnected, setupWallet } from "../../../utils/walletUtils";
import WalletSelectionModal from "../../../components/WalletSelectionModal/WalletSelectionModal";


class SetAddress extends React.Component {
    state = {
        mix: [],
        fillingType: "manual",
        inputJson: "",
        inputAddress: "",
        nodeAddress: "",
        nodeApiKey: "",
        focus: "",
        loadingNode: false,
        loadingWallet: false,
        loading: "",
        focused: "",
        buttonEnable: true,
        showWalletModal: false,
    };

    componentDidMount = () => {
        const mixCopy = [];
        this.props.mix.forEach((box, index) => {
            if (box.checked)
                mixCopy.push({...box, loading: ""})
        });
        this.setState({
            mix: mixCopy,
            buttonEnable: mixCopy.length === 0
        });
    };

    setFillingType = fillingType => {
        this.setState({fillingType: fillingType});
    };

    updateWithdraw = () => {
        let mixCopy = [...this.state.mix];
        this.setState({loading: "update"});
        mixCopy.forEach((box, index) => {
            mixCopy[index] = {...box, loading: "Start"};
            this.setState({mix: mixCopy});
            this.callApi(mixCopy, index, false);
        });
    };

    withdrawNow = () => {
        let mixCopy = [...this.state.mix];
        this.setState({loading: "withdraw"});
        mixCopy.forEach((box, index) => {
            mixCopy[index] = {...box, loading: "Start"};
            this.setState({mix: mixCopy});
            this.callApi(mixCopy, index, true);
        });
    };

    callApi = (mix, index, mixNow) => {
        ApiNetwork.withdraw(mix[index].id, mix[index].withdraw, mixNow).then(response => {
            mix[index] = {...mix[index], loading: 'Done'};
            this.setState({loading: ""});
            this.setState({mix: mix});
        }).catch(exp => {
            mix[index] = {...mix[index], loading: 'Failed'};
            this.setState({loading: ""});
            this.setState({mix: mix});
            NotificationManager.error(formatter.errorMessage(exp), 'Update Exception!', 5000);
        });
    };

    saveAddress = (index, value) => {
        let mixCopy = [...this.state.mix];
        mixCopy[index] = {...mixCopy[index], withdraw: value};
        this.setState({mix: mixCopy})
    };

    loadOneForAll = (value) => {
        let mixCopy = [...this.state.mix];
        mixCopy.forEach(function (box, index) {
            mixCopy[index] = {...box, withdraw: value};
        });
        this.setState({
            inputAddress: value,
            mix: mixCopy
        })
    };

    loadJsonAddress = () => {
        const addressJson = JSON.parse(this.state.inputJson);
        this.loadJsonAddressObject(addressJson)
    };

    loadJsonAddressObject = addressJson => {
        let mixCopy = [...this.state.mix];
        addressJson.forEach((value, index) => {
            if (mixCopy.length > index) {
                mixCopy[index] = {...mixCopy[index], withdraw: value};
            }
        });
        // this.storeAddresses(mixCopy);
        this.setState({mix: mixCopy, inputJson: ""});
    };

    loadAddressFromNode = () => {
        this.setState({loadingNode: true});
        ApiNetwork.getNodeAddress(this.state.nodeAddress, this.state.nodeApiKey, this.state.mix.length).then(response => {
            this.setState({loadingNode: false});
            this.loadJsonAddressObject(response.data);
        }).catch(error => {
            this.setState({loadingNode: false});
            NotificationManager.error(formatter.errorMessage(error), 'Network problem!', 5000);
        })
    };

    loadAddressesArray = addressesArray => {
        const mixCopy = [...this.state.mix];
        const hasEnough = addressesArray.length >= mixCopy.length;
        addressesArray.forEach((value, index) => {
            if (mixCopy.length > index) {
                mixCopy[index] = {...mixCopy[index], withdraw: value};
            }
        });
        this.setState({mix: mixCopy});
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
                <div>
                    <div className={"col-12 alert alert-primary"}>
                        <ul className="nav nav-tabs justify-content-center" data-tabs="tabs">
                            <li className="nav-item">
                                <a className={this.state.fillingType === "manual" ? "nav-link active" : "nav-link"}
                                   onClick={() => this.setFillingType("manual")}>
                                    <i className="material-icons" style={{color: "white"}}>edit</i> Set Manually
                                    <div className="ripple-container"/>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={this.state.fillingType === "json" ? "nav-link active" : "nav-link"}
                                   onClick={() => this.setFillingType("json")}>
                                    <i className="material-icons" style={{color: "white"}}>settings_ethernet</i> Using
                                    Json
                                    <div className="ripple-container"/>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={this.state.fillingType === "node" ? "nav-link active" : "nav-link"}
                                   onClick={() => this.setFillingType("node")}>
                                    <i className="material-icons" style={{color: "white"}}>cloud</i> Using a Node
                                    <div className="ripple-container"/>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={this.state.fillingType === "dapp" ? "nav-link active" : "nav-link"}
                                   onClick={() => this.setFillingType("dapp")}>
                                    <i className="material-icons" style={{color: "white"}}>exit_to_app</i> Using Dapp
                                    Connector
                                    <div className="ripple-container"/>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={this.state.fillingType === "oneForAll" ? "nav-link active" : "nav-link"}
                                   onClick={() => this.setFillingType("oneForAll")}>
                                    <i className="material-icons" style={{color: "white"}}>call_split</i> One for all
                                    <div className="ripple-container"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card-body" style={{overflowY: 'scroll', maxHeight: '40vh'}}>
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
                                            id="intputJson"
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
                                <div style={{"display": this.state.fillingType === 'oneForAll' ? 'block' : 'none'}}>
                                    <div className={"form-group bmd-form-group " +
                                        (this.state.focus === "inputAddress" ? "is-focused" : "") +
                                        ((this.state.inputAddress && this.state.focus !== "inputAddress") ? "is-filled" : "")}>
                                        <label htmlFor="inputAddress" className="bmd-label-floating">
                                            Enter an address to set for all.
                                        </label>
                                        <input className={"form-control"}
                                               value={this.state.inputAddress}
                                               onFocus={() => this.setState({focus: "inputAddress"})}
                                               onBlur={() => this.setState({focus: ""})}
                                               onChange={event => this.loadOneForAll(event.target.value)}/>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className=" text-primary">
                                        <tr>
                                            <th>ID</th>
                                            <th>Amount</th>
                                            <th>Withdraw Address</th>
                                            <th>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.mix.map((box, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Tooltip title={<span className="tooltip-text">{box.id}</span>}
                                                             arrow>
                                                        <div>{formatter.id(box.id)}</div>
                                                    </Tooltip>
                                                </td>
                                                <td>{formatter.token(box.mixingTokenId ? box.mixingTokenAmount : box.amount, box.mixingTokenId)}</td>
                                                <td>
                                                    <input className={"form-control"}
                                                           autoFocus={index === 0}
                                                           value={box.withdraw}
                                                           onChange={(event) => this.saveAddress(index, event.target.value)}/>
                                                </td>
                                                <td>
                                                    {box.loading === "Start" ?
                                                        <i className="fa fa-circle-o-notch fa-spin"/> : box.loading === "Done" ?
                                                            <i className="material-icons"
                                                               style={{color: "green"}}>done</i> : box.loading === "Failed" ?
                                                                <i className="material-icons"
                                                                   style={{color: "red"}}>clear</i> : null}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row" style={{padding: 20}}>
                                <div className="col-6">
                                    <button className="btn btn-outline-primary" style={{width: "100%"}}
                                            onClick={this.updateWithdraw} disabled={this.state.buttonEnable}>
                                        {this.state.loading === "update" ?
                                            <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                        &nbsp;&nbsp;update withdraw address
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button className="btn btn-outline-warning" style={{width: "100%"}}
                                            onClick={this.withdrawNow} disabled={this.state.buttonEnable}>
                                        {this.state.loading === "withdraw" ?
                                            <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                        &nbsp;&nbsp;Update And Withdraw Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    };
}

export default SetAddress;
