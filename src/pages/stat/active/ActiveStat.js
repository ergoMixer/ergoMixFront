import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../../network/api";
import StatusCard from "../../../components/status-card/StatusCard";
import Panel from "../../../components/panel/Panel";
import Loading from "../../../components/loading/Loading";
import { NavLink } from "react-router-dom";
import Schedule from "@mui/icons-material/Schedule";
import CompareArrows from "@mui/icons-material/CompareArrows";
import Autorenew from "@mui/icons-material/Autorenew";

const create = (
    <NavLink className="btn btn-outline-primary" style={{marginRight: "15px"}} to='/mix/active/new'>
        Start New Mix
    </NavLink>
);

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
                <Loading
                    empty={this.state.mixGroup.length === 0}
                    emptyMessage={["There are no mixes available.", "You can create a new one."]}
                    loaded={this.state.loaded}>
                    <div className="row">
                        <div className="col-12">
                            <Panel>
                                <div className="help-content-wrapper">
                                    <i className="material-icons box-display warning"><Schedule /></i>
                                    <span className="helper-text"> Pending deposit </span>
                                    <i className="material-icons box-display info"><CompareArrows /></i>
                                    <span className="helper-text">Pre-mixing</span>
                                    <i className="material-icons box-display success"><Autorenew /></i>
                                    <span className="helper-text">Mixing</span>
                                </div>
                                <div className="text-center mt-3">excess deposit will be considered as donation</div>
                            </Panel>
                        </div>
                    </div>
                    <div className="row">
                        {this.state.mixGroup.map((group, index) => (
                            <StatusCard key={group.id} {...group}/>
                        ))}
                    </div>
                </Loading>
            </React.Fragment>

        )
    };
}

export default withLayout(MainLayout, {create:create})(ActiveStat);

