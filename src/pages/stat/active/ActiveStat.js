import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import {ApiNetwork} from "../../../network/api";
import StatusCard from "./status_card/StatusCard";


class ActiveStat extends React.Component {
    state = {
        mixGroup: [],
        copy: {},
        showModal: false,
    };

    componentWillMount() {
        ApiNetwork.mixRequestGroupActiveList().then((response => {
            this.setState({mixGroup: response.data})
        })).catch(error => {

        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="material-icons box-display warning">schedule</i> Pending deposit &nbsp;&nbsp;&nbsp;
                                <i className="material-icons box-display info">compare_arrows</i> Pre-mixing &nbsp;&nbsp;&nbsp;
                                <i className="material-icons box-display success">autorenew</i> Mixing &nbsp;&nbsp;&nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12"> Stat</div>
                    {this.state.mixGroup.map((group, index) => (
                        <StatusCard key={group.id} {...group}/>
                    ))}
                </div>
            </React.Fragment>

        )
    };
}

export default withLayout(MainLayout)(ActiveStat);

