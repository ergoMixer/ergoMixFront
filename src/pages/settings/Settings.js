import React from 'react';
import { connect } from "react-redux";
import MainLayout from "../../layout/main-layout/MainLayout";
import withLayout from '../../hoc/with_layout/withLayout';
import Panel from "../../components/panel/Panel";
import { ApiNetwork, BASE_URL } from '../../network/api';
import ProjectModal from "../../components/modal/modal";

class Settings extends React.Component {
    state = {
        selectedFile: null,
        backupModal: false,
        restoreModal: false,
        exportSK:false,
        exportStealthSK: false,
        showComplete: false,
        success: false,
        loading: false,
    }

    onFileChange = event => {
        this.setState({selectedFile: event.target.files[0], restoreModal: true});
        event.target.value = null;
    };

    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        this.setState({loading: true});
        ApiNetwork.restore(formData).catch(result => {
            this.setState({showComplete: true, restoreModal: false, success: !result || result.statusCode === 503})
        });
    };

    closeModal = () => {
        this.setState({selectedFile: null, restoreModal: false, backupModal: false, exportSK: false, exportStealthSK: false});
    }

    closeSuccessModal = () => {
        this.setState({showComplete: false})
    }

    downloadBackup = () => {
        const url = BASE_URL + "backup";
        this.setState({backupModal: false});
        window.open(url, "_blank")
    }

    downloadSecretKeys = () => {
        const url = BASE_URL + "covert/keys";
        this.setState({exportSK: false});
        window.open(url, "_blank");
    }

    downloadStealthSecretKeys = () => {
        const url = BASE_URL + "stealth/export";
        this.setState({exportStealthSK: false});
        window.open(url, "_blank");
    }

    render = () => {
        return (
            <div className="row">
                <ProjectModal close={this.closeModal} show={this.state.backupModal} scroll={'hidden'}>
                    <div className="row">
                        <div className="col-12 text-center">
                            <strong>Please read the "Sensitive data and backup" section in About page before relying on backup/restore.</strong>
                            <br/>
                            {this.props.info.isWindows ? (
                                <div>Due to limitations of the Windows OS, ErgoMixer will stop after you download the backup; You can start it again.</div>
                            ): null}
                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn btn-danger" onClick={this.downloadBackup}>
                                Backup &nbsp;
                                {this.state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                            </button>
                            &nbsp;
                            <button className="btn" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.restoreModal}>
                    <div className="row">
                        <div className="col-12 text-center">
                            <div>Restoring a backup will remove your current database.</div>
                            <div>After restoring, ErgoMixer will stop and you have to start it again.</div>
                            <b>Are you sure want to restore this backup?</b>
                            <br/>
                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn btn-danger" onClick={this.onFileUpload}>
                                Restore &nbsp;
                                {this.state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                            </button>
                            &nbsp;
                            <button className="btn" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.exportSK} scroll={'hidden'}>
                    <div className="row">
                        <div className="col-12 text-center">
                            <strong>Please read the "Sensitive data and backup" section in About page before relying on export secret keys.</strong>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn btn-danger" onClick={this.downloadSecretKeys}>
                                Export Covert Secrets&nbsp;
                            </button>
                            &nbsp;
                            <button className="btn" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.exportStealthSK} scroll={'hidden'}>
                    <div className="row">
                        <div className="col-12 text-center">
                            <strong>Please read the "Sensitive data and backup" section in About page before relying on export secret keys.</strong>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn btn-danger" onClick={this.downloadStealthSecretKeys}>
                                Export Stealth Secrets&nbsp;
                            </button>
                            &nbsp;
                            <button className="btn" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.showComplete}>
                    <div className="row">
                        <div className="col-12 text-center">
                            <div>Backup restored successfully.</div>
                            <div>Please Start ErgoMixer again to continue.</div>
                            <b>If you are using docker with restart flag enabled, no action is required.</b>
                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn" onClick={this.closeSuccessModal}>Close</button>
                        </div>
                    </div>
                </ProjectModal>
                <div className="col-12">
                    <Panel>
                        <div>
                            <label className="font-weight-bold">Used Node Addresses:&nbsp;</label>
                            {this.props.info.ergoNode.map((item, index) => (
                                <div key={index}>
                                    {item.url}
                                    &nbsp;&nbsp;
                                    {item.canConnect ? <i className="fa fa-check text-success"/> :
                                        <i className="fa fa-times text-danger"/>}
                                </div>
                            ))}

                        </div>
                        <hr/>
                        <div><label className="font-weight-bold">Used Explorer
                            Address:&nbsp;</label>
                            <div>{this.props.info.ergoExplorer}</div>
                        </div>
                    </Panel>
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <Panel>
                                <button className="btn btn-outline-primary float-right" onClick={() => this.setState({backupModal: true})}>Backup</button>
                                {/*<a href={BASE_URL + "backup"} target="_blank" rel="noopener noreferrer"*/}
                                {/*   className="btn btn-outline-primary float-right">Backup</a>*/}
                                <div style={{padding: "17px 0"}}>Backup Database
                                </div>
                            </Panel>
                        </div>
                        <div className="col-12 col-sm-6">
                            <Panel>
                                <label className="btn btn-outline-primary float-right">
                                    <input type="file" onChange={this.onFileChange} style={{display: "none"}}/>
                                    Select File to Restore
                                </label>
                                <div style={{padding: '17px 0'}}>Restore Database
                                </div>
                            </Panel>
                        </div>
                        <div className="col-12 col-sm-6">
                            <Panel>
                                <button className="btn btn-outline-primary float-right"
                                        onClick={() => this.setState({exportSK: true})}>Export
                                </button>
                                <div style={{padding: "17px 0"}}>Export All Secret Keys of Covert Address
                                </div>
                            </Panel>
                        </div>
                        <div className="col-12 col-sm-6">
                            <Panel>
                                <button className="btn btn-outline-primary float-right"
                                        onClick={() => this.setState({exportStealthSK: true})}>Export
                                </button>
                                <div style={{padding: "17px 0"}}>Export All Secret Keys of Stealth Address
                                </div>
                            </Panel>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    info: state.info,
});

export default withLayout(MainLayout)(connect(mapStateToProps)(Settings));
