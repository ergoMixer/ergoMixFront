import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../../network/api";
import StatusCard from "./status_card/StatusCard";
import Panel from "../../../components/panel/Panel";


class ActiveStat extends React.Component {
    state = {
        mixGroup: [],
        copy: {},
        showModal: false,
        loaded: false
    };

    componentWillMount() {
        ApiNetwork.mixRequestGroupActiveList().then((response => {
            this.setState({mixGroup: response.data, loaded: true})
        })).catch(error => {

        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <Panel>
                            <div className="help-content-wrapper">
                                <i className="material-icons box-display warning">schedule</i>
                                <span className="helper-text"> Pending deposit </span>
                                <i className="material-icons box-display info">compare_arrows</i>
                                <span className="helper-text">Pre-mixing</span>
                                <i className="material-icons box-display success">autorenew</i>
                                <span className="helper-text">Mixing</span>
                            </div>
                            <div className="text-center mt-3">excess deposit will be considered as donation</div>
                        </Panel>
                    </div>
                </div>
                {(this.state.loaded && this.state.mixGroup.length) ? (
                    <div className="row">
                        {this.state.mixGroup.map((group, index) => (
                            <StatusCard key={group.id} {...group}/>
                        ))}
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <Panel>
                                {this.state.loaded ? (
                                    <h3 className="text-center">
                                        No Mix Available
                                    </h3>
                                ) : (
                                    <React.Fragment>
                                        <h3 className="text-danger text-center">
                                            Loading data
                                        </h3>
                                        <h3 className="text-center text-danger">
                                            Please wait <i className="fa fa-circle-o-notch fa-spin"/>
                                        </h3>
                                    </React.Fragment>
                                )}
                            </Panel>
                        </div>
                    </div>
                )}
            </React.Fragment>

        )
    };
}

export default withLayout(MainLayout)(ActiveStat);

