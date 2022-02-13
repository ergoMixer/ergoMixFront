import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { connect } from "react-redux";
import { ApiNetwork } from "../../../network/api";
import Loading from "../../../components/loading/Loading";
import CovertCard from "../../../components/status-card/covert-card/CovertCard";
import { NavLink } from "react-router-dom";
import ProjectModal from "../../../components/modal/modal";
import { TextField } from "@material-ui/core";
import { COVERT_NAME_SIZE } from "../../../const";
import Panel from "../../../components/panel/Panel";
import * as formatter from "../../../formatter/formatters";
import DataTable from "../../../components/table/assetTable";
import { NotificationManager } from "react-notifications";

const create = (
    <NavLink className="btn btn-outline-primary" style={{marginRight: "15px"}} to='/covert/new'>
        New Covert Address
    </NavLink>
);


class CovertList extends React.Component {
    state = {
        loaded: false,
        addresses: [],
        editingId: null,
        editingName: null,
        isEditing: false,
        showPrivateKeyModal: false,
        showPrivateKey: false,
        showAllAssetsWithdraw: false,
        assets: null,
        depositAddress: '',
        tokenIds: [],
        selectedRows: [],
        privateKey: '',
        loading: true,
        error: ''
    };

    loadData = () => {
        ApiNetwork.covertList().then((response => {
            this.setState({addresses: response.data, loaded: true})
            // this.setState({loaded: true})
        })).catch(error => {
            setTimeout(() => this.loadData(), 10 * 1000);
        })
    }

    componentWillMount() {
        this.setState({selectedRows: []})
        this.loadData();
    }

    closeModal = () => {
        this.setState({
            isEditing: false,
            showPrivateKeyModal: false,
            showPrivateKey: false,
            showAllAssetsWithdraw: false,
            assets: null,
            depositAddress: ''
        })
    }

    submitName = () => {
        this.setState({'loading': true})
        ApiNetwork.covertName(this.state.editingId, this.state.editingName).then(response => {
            this.setState({loading: true, isEditing: false})
            this.loadData();
        }).catch(error => {
            this.setState({loading: true, error: error})
        })
    }

    getPrivateKey = () => {
        ApiNetwork.covertPrivateKey(this.state.editingId).then(response => {
            this.setState({privateKey: response.data.privateKey})
        }).catch(error => {
            this.setState({loading: true, error: error})
        })
    }

    handleAddress = (e) => {
        this.setState({depositAddress: e.target.value});
    }

    withdrawAsset = () => {
        const selectedTokens = this.state.assets.filter((asset, index) => {
            return this.state.selectedRows.includes(index)
        })
        const selectedTokenIds = selectedTokens.map(token => token.tokenId)
        ApiNetwork.withdrawCovertAsset(this.state.editingId, selectedTokenIds, this.state.depositAddress).then(() => {
            NotificationManager.success('Withdraw Was Successful', 'Success');
        }).catch(
            error => {
                NotificationManager.error(formatter.errorMessage(error), 'Update Exception!', 5000);
            }
        );

        this.closeModal();
    }

    getAllAssets = () => {
        ApiNetwork.covertAsset(this.state.editingId).then(response => {

            this.setState({
                assets: response.data.assets.filter(asset => {
                    return asset.tokenId !== '' && asset.confirmedDeposit !== 0
                }).map((asset, index) => {
                    const json = {
                        id: index,
                        tokenName: formatter.tokenName(asset.tokenId ? asset.tokenId : ""),
                        tokenId: asset.tokenId,
                        value: asset.confirmedDeposit,
                    };
                    return json
                }),
            });
        }).catch(error => {
            this.setState({
                assets: []
            });
        })

    }

    saveName = event => {
        let value = event.target.value;
        if (value) {
            value = value.substr(0, COVERT_NAME_SIZE);
        }
        this.setState({editingName: value});
    }

    render() {
        return (
            <React.Fragment>
                <Loading loaded={this.state.loaded}
                         empty={this.state.addresses.length === 0}
                         emptyMessage={["There are no covert addresses.", "You can create a new one."]}
                >
                    <ProjectModal close={this.closeModal} show={this.state.isEditing} scroll={'hidden'}>
                        <div className="row">
                            {this.state.error}
                            <div className="col-12">
                                <TextField
                                    label="Covert Address Name"
                                    onChange={this.saveName}
                                    error={this.state.editingName === ''}
                                    value={this.state.editingName}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button className="btn" onClick={this.closeModal}>Close</button>
                                <button
                                    className="btn btn-success"
                                    disabled={this.state.editingName === ''}
                                    onClick={this.submitName}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </ProjectModal>
                    <ProjectModal close={this.closeModal} show={this.state.showPrivateKeyModal} scroll={'hidden'}>
                        <div className="row mb-3">
                            <div className="col-12 text-center">
                                <span>
                                    {(this.state.showPrivateKey ?
                                            ((
                                                this.state.privateKey === '' ?
                                                    <i className="fa fa-circle-o-notch fa-spin"/>
                                                    : this.state.privateKey
                                            )) :
                                            "By clicking on the show button, " +
                                            "the private key is shown in plain text. " +
                                            "you should be aware of its risk before clicking."
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button className="btn btn-success" onClick={this.closeModal}>Close</button>
                                {this.state.showPrivateKey ?
                                    <button
                                        className="btn btn-dark"
                                        onClick={() => this.setState({showPrivateKey: false})}
                                    >
                                        Hide
                                    </button>
                                    :
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => this.setState({showPrivateKey: true})}
                                    >
                                        Show
                                    </button>
                                }
                            </div>
                        </div>
                    </ProjectModal>
                    <ProjectModal close={this.closeModal} show={this.state.showAllAssetsWithdraw} scroll={'hidden'}>
                        <div className="row">
                            <div className="col-12">
                                {this.state.assets ? (
                                    <DataTable
                                        rows={this.state.assets}
                                        selectedRows={this.state.selectedRows}
                                        rowsUpdateCallBack={(rows) => {
                                            this.setState({selectedRows: rows})
                                        }}
                                    />
                                ) : null}
                            </div>
                            <div className="col-12 mt-3">
                                <TextField
                                    label="Withdraw Address"
                                    onChange={this.handleAddress}
                                    error={this.state.depositAddress === ''}
                                    value={this.state.depositAddress}
                                    required={true}
                                />
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button className="btn" onClick={this.closeModal}>Close</button>
                                <button className="btn btn-success" onClick={this.withdrawAsset}>Withdraw</button>
                            </div>
                        </div>
                    </ProjectModal>
                    <div className="row">
                        <div className="col-12">
                            <Panel>
                                <div className="help-content-wrapper">
                                    <i className="material-icons box-display warning">call_split</i>
                                    <span className="helper-text"> No active/completed mixes </span>
                                    <i className="material-icons box-display info">call_split</i>
                                    <span className="helper-text"> Has some completed mixes </span>
                                    <i className="material-icons box-display success">call_split</i>
                                    <span className="helper-text"> Has some active mixes </span>
                                </div>
                            </Panel>
                        </div>
                    </div>
                    <div className="row">
                        {this.state.addresses.map((address, index) => (
                            <CovertCard
                                {...address}
                                key={index}
                                edit={(id, name) => this.setState({editingName: name, editingId: id, isEditing: true})}
                                privateKey={(id) => this.setState({
                                    editingId: id,
                                    showPrivateKeyModal: true,
                                    privateKey: ''
                                }, this.getPrivateKey)}
                                withdraw={(id) => this.setState({
                                    editingId: id,
                                    showAllAssetsWithdraw: true,
                                }, this.getAllAssets)}
                            ></CovertCard>
                        ))}
                    </div>
                </Loading>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    loadedData: state.loadedData,
    tokens: state.tokens,
    levels: state.mixLevel,
});

export default withLayout(MainLayout, {create: create})(connect(mapStateToProps)(CovertList));
