import React from 'react';
import ProjectModal from "../../components/modal/modal";
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../network/api";
import { useNavigate } from "react-router-dom";

export const Shutdown = (props) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        activeMix: false,
        loading: false,
    })

    React.useEffect(() => {
        ApiNetwork.mixRequestGroupActiveList().then((response => {
            setState({ ...state, activeMix: response.data.length > 0})
        })).catch(error => {

        });
    }, []);

    const closeModal = () => {
        navigate("/");
    }

    const shutdown = () => {
        setState({ ...state, loading: true})
        ApiNetwork.shutdown().catch(error => {
            setState({ ...state, loading: false, showComplete: true})
        });
    }

    return (
        <React.Fragment>
            <ProjectModal close={closeModal} show={!state.showComplete}>
                <div className="row">
                    <div className="col-12 text-center">
                        {state.activeMix ? (
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
                        <button className="btn btn-danger" onClick={shutdown}>
                            Shutdown &nbsp;
                            {state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                        </button>
                        &nbsp;
                        <button className="btn" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </ProjectModal>
            <ProjectModal close={closeModal} show={state.showComplete}>
                <div className="row">
                    <div className="col-12 text-center">
                        <b>Shutdown request successfully was sent! It may take a few seconds for ErgoMixer to peacefully shutdown...</b>
                        <br/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <button className="btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </ProjectModal>
        </React.Fragment>
    );
}

export default withLayout(MainLayout)(Shutdown);