import React from 'react';
import withLayout from "../../../../hoc/with_layout/withLayout";
import MainLayout from "../../../../layout/main-layout/MainLayout";
import Breadcrumb from "../../../../components/broadcom/Breadcrumb";
import LoadFromJson from "../../../../components/load-from-json/LoadFromJson";
import LoadFromNode from "../../../../components/load-from-node/LoadFromNode";
import { ApiNetwork } from "../../../../network/api";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import * as formatter from "../../../../formatter/formatters";
import Panel from "../../../../components/panel/Panel";
import LoadFromWallet from "../../../../components/load-from-wallet/LoadFromWallet";

class CovertAddress extends React.Component {
    state = {
        addresses: [],
        fillingType: 'json',
        saving: false,
        saved: false,
    }

    loadAddress = () => {
        ApiNetwork.getCovertAddress(this.props.match.params.covertId).then(response => {
            this.setState({addresses: response.data})
        });
    }

    componentDidMount() {
        this.loadAddress();
    }

    setValid = (fillingType, addresses) => {
        if (fillingType === "later" || addresses.length !== 0) {
            this.props.setValid(true)
        } else {
            this.props.setValid(false);
        }
    }

    setFillingType = value => {
        this.setState({fillingType: value});
    }

    saveAddress = (index, address) => {
        let tmpAddresses = [...this.state.addresses];
        if (index < this.state.addresses.length && index !== -1) {
            tmpAddresses[index] = address
        } else {
            tmpAddresses.push(address);
        }
        this.setState({addresses: tmpAddresses, saved: false});
    }

    saveAddresses = addresses => {
        this.setState({addresses: addresses, saved: false});
    }

    submitAddress = () => {
        this.setState({"saving": true})
        const addresses = this.state.fillingType === 'later' ? [] : [...this.state.addresses];
        ApiNetwork.setCovertAddress(this.props.match.params.covertId, addresses).then(response => {
            this.loadAddress();
            this.setState({"saving": false, saved: true});
        }).catch(error => {
            this.loadAddress();
            NotificationManager.error(formatter.errorMessage(error), 'Submission Exception!', 5000);
            this.setState({"saving": false})
        });
    }

    addRow = () => {
        this.setState({addresses: [...this.state.addresses, ''], saved: false});
    }

    deleteRow = (index) => {
        let tmpAddresses = [...this.state.addresses];
        tmpAddresses.splice(index, 1);
        this.setState({addresses: tmpAddresses, saved: false});
    }

    breadcrumbPath = () => {
        if(!this.props.covertLoaded){
            ApiNetwork.covertList();
        }
        const address = this.props.covertMap[this.props.match.params.covertId];
        return [
            {url: '/covert', title: "Covert Address"},
            {title: address},
            {title: 'Addresses'}
        ]
    }

    render() {
        return (
            <div className="row">
                <Breadcrumb path={this.breadcrumbPath()}/>
                <div className="col-12 text-center">
                    <Panel>
                        <h4>
                            When a new mix starts for this covert address, its withdraw address will
                            be selected randomly from the list of addresses you specify here.
                            You can change this list later and also leave it empty and withdraw manually. <br/>
                            The more addresses you provide, the better the security gains.
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
                                                <i className="material-icons" style={{color: "white"}}>exit_to_app</i> Using Dapp Connector
                                                <div className="ripple-container"/>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={this.state.fillingType === "later" ? "nav-link active" : "nav-link"}
                                               onClick={() => this.setFillingType("later")}>
                                                <i className="material-icons">arrow_right_alt</i> Withdraw Manually
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
                                <LoadFromJson saveAddresses={addresses => this.saveAddresses([...addresses])}/>
                            </div>
                            <div className="row" style={this.state.fillingType === 'node' ? {} : {"display": 'none'}}>
                                <LoadFromNode
                                    manualCount={true}
                                    setAddress={addresses => this.saveAddresses([...addresses])}/>
                            </div>
                            <div className="row" style={this.state.fillingType === 'dapp' ? {} : {"display": 'none'}}>
                                <LoadFromWallet
                                    manualCount={true}
                                    setAddress={addresses => this.saveAddresses([...addresses])}/>
                            </div>
                            {this.state.fillingType === "later" ? (
                                <div className="col-12">
                                    Manually withdraw all boxes
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className=" text-primary">
                                        <tr>
                                            <th>#</th>
                                            <th>Withdraw Address</th>
                                            <th style={{width: "100px"}}></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.addresses.map((address, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <input className={"form-control"}
                                                           value={address}
                                                           onChange={(event) => this.saveAddress(index, event.target.value)}/>
                                                </td>
                                                <td>
                                                    <button className="btn btn-outline-primary"
                                                            onClick={() => this.deleteRow(index)}>
                                                        <i className="fa fa-trash"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-12">
                                    {this.state.saved ? <button className="btn btn-outline pull-right">Saved</button>: (
                                        <button className="btn btn-outline-primary pull-right"
                                                onClick={event => this.submitAddress()}>Save &nbsp;
                                            {this.state.saving ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                        </button>
                                    )}
                                    {this.state.fillingType === "later" ? null : (
                                        <button className="btn btn-outline-primary"
                                                onClick={this.addRow}>Add Row
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    covertMap: state.covertMap,
    covertLoaded: state.covertLoaded
});


export default withLayout(MainLayout)(connect(mapStateToProps)(CovertAddress));