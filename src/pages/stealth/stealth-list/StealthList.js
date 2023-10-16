import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../../network/api";
import Loading from "../../../components/loading/Loading";
import { NavLink } from "react-router-dom";
import ProjectModal from "../../../components/modal/modal";
import { TextField } from "@mui/material";
import { COVERT_NAME_SIZE } from "../../../const";
import Panel from "../../../components/panel/Panel";
import { CallMerge, Refresh, Check, Error } from '@mui/icons-material';
import StealthCard from '../../../components/status-card/stealth-card/StealthCard';

const create = (
    <div>
        <NavLink className="btn btn-outline-primary" style={{marginRight: "15px"}} to='/stealth/payment'>
            Generate Payment Address
        </NavLink>
        <NavLink className="btn btn-outline-primary" style={{marginRight: "15px"}} to='/stealth/new'>
            New Stealth Address
        </NavLink>
    </div>
);


class CovertList extends React.Component {
    state = {
        loaded: false,
        convertPk: false,
        addresses: [],
        editingId: null,
        editingName: null,
        isEditing: false,
        loading: true,
        error: '',
        privateKey: '',
        info:{
            lastProcessedBlock: 0,
            currentNetworkHeight: 0,
            error: ''
        }
    };

    loadInfo = () => {
        return ApiNetwork.stealthInfo().then(response => {
            this.setState({info: {...response, error: false}})
            setTimeout(() => {
                this.loadInfo()
            }, 20*1000);             
        }).catch(error => {
            this.setState({
                info: {
                    lastProcessedBlock: 0,
                    currentNetworkHeight: 0,
                    error: true,
                }
            })
            setTimeout(() => {
                this.loadInfo()
            }, 10*1000);             
        })   
    }

    loadData = () => {
        ApiNetwork.stealthList().then((response => {
            this.setState({addresses: response, loaded: true})
            setTimeout(() => {
                this.loadData();
            }, 2 * 60 * 1000);
        })).catch(error => {
            setTimeout(() => this.loadData(), 10 * 1000);
        })
    }

    getPrivateKey = () => {
        this.setState({loading: true})
        ApiNetwork.stealthPrivateKey(this.state.editingId).then(response => {
            this.setState({privateKey: response.data.secret})
        }).catch(error => {
            this.setState({loading: false, error: error})
        })
    }

    componentWillMount() {
        this.setState({selectedRows: []})
        this.loadInfo()
        this.loadData();
    }

    closeModal = () => {
        this.setState({
            isEditing: false,
            convertPk: false,
            showPrivateKeyModal: false,
        })
    }

    submitName = () => {
        this.setState({'loading': true})
        ApiNetwork.stealthName(this.state.editingId, this.state.editingName).then(response => {
            this.setState({loading: true, isEditing: false})
            this.loadData();
        }).catch(error => {
            this.setState({loading: true, error: error})
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
                         emptyMessage={["There are no stealth addresses.", "You can create a new one."]}
                >
                    <ProjectModal close={this.closeModal} show={this.state.isEditing} scroll={'hidden'}>
                        <div className="row">
                            {this.state.error}
                            <div className="col-12">
                                <TextField
                                    label="Stealth Address Name"
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
                    <div className="row">
                        <div className="col-6">
                            <Panel>
                                <div className="help-content-wrapper">
                                    <i className="material-icons box-display warning"><CallMerge /></i>
                                    <span className="helper-text"> No available assets </span>
                                    <i className="material-icons box-display info"><CallMerge /></i>
                                    <span className="helper-text"> Contains some assets </span>
                                </div>
                            </Panel>
                        </div>
                        <div className="col-6">
                            <Panel>
                                <div className="help-content-wrapper">
                                    {this.state.info.error ? (
                                        <React.Fragment>
                                            <i className='material-icons box-display danger'><Error/></i> 
                                            <span className='helper-text'>&nbsp;Error Fetching Network State</span>
                                        </React.Fragment>
                                    ) : this.state.info.currentNetworkHeight === 0 ? (
                                        <React.Fragment>
                                            <span className='helper-text'>Fetching Network State</span>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            {(this.state.info.currentNetworkHeight -this.state.info.lastProcessedBlock) > 2 ? (
                                                <i className='material-icons box-display warning spin-icon'><Refresh/></i>
                                            ) : (
                                                <i className='material-icons box-display success'><Check/></i>
                                            )}
                                            <span className='helper-text'>&nbsp;Last Processed Block: {this.state.info.lastProcessedBlock}</span>
                                            <span className='helper-text'>Current Network Height: {this.state.info.currentNetworkHeight}</span>
                                        </React.Fragment>
                                    )}                                    
                                </div>
                            </Panel>
                        </div>
                    </div>
                    <div className="row">
                        {this.state.addresses.map((address, index) => (
                            <StealthCard
                                {...address}
                                key={index}
                                privateKey={(id) => this.setState({
                                    editingId: id,
                                    showPrivateKeyModal: true,
                                    privateKey: ''
                                }, this.getPrivateKey)}
                                edit={(id, name) => this.setState({editingName: name, editingId: id, isEditing: true})}
                            />
                        ))}
                    </div>
                </Loading>
            </React.Fragment>
        )
    }
}


export default withLayout(MainLayout, {create: create})(CovertList);
