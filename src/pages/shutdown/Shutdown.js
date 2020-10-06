import React from 'react';
import ProjectModal from "../../components/modal/modal";
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import Panel from "../../components/panel/Panel";
import { ApiNetwork } from "../../network/api";

class Shutdown extends React.Component {
    state = {
        activeMix: false,
        loading: false,
    }

    componentDidMount() {
        ApiNetwork.mixRequestGroupActiveList().then((response => {
            this.setState({activeMix: response.data.length > 0})
        })).catch(error => {

        });
    }

    closeModal = () => {
        this.props.history.push("/");
    }

    shutdown = () => {
        this.setState({loading: true})
        ApiNetwork.shutdown().catch(error => {
            this.setState({loading: false, showComplete: true})
        });
    }

    render() {
        return (
            <React.Fragment>
                <ProjectModal close={this.closeModal} show={!this.state.showComplete}>
                    <div className="row">
                        <div className="col-12 text-center">
                            {this.state.activeMix ? (
                                <React.Fragment>
                                    <div>There are some mixes in progress. Shutting the mixer down will result in
                                        pausing
                                        all mixes.
                                    </div>
                                    <div>Mixes will resume when you start the ErgoMixer again.</div>
                                    <br/>
                                    <div>Shutdown anyway?</div>
                                </React.Fragment>
                            ) : (
                                <div>Do you want to shutdown the mixer?</div>
                            )}

                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn btn-danger" onClick={this.shutdown}>
                                Shutdown &nbsp;
                                {this.state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                            </button>
                            &nbsp;
                            <button className="btn" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.showComplete}>
                    <div className="row">
                        <div className="col-12 text-center">
                            <b>Shutdown request successfully was sent! It may take a few seconds for ErgoMixer to peacefully shutdown...</b>
                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn" onClick={this.closeModal}>Close</button>
                        </div>
                    </div>
                </ProjectModal>
            </React.Fragment>
        )
    }
}

export default withLayout(MainLayout)(Shutdown);