import React from 'react';
import Panel from "../../../components/panel/Panel";
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { connect } from "react-redux";
import { ApiNetwork } from "../../../network/api";
import Loading from "../../../components/loading/Loading";
import CovertCard from "../../../components/status-card/covert-card/CovertCard";
import Fab from '@material-ui/core/Fab/Fab';
import { NavLink } from "react-router-dom";

const create = (
    <NavLink className="btn btn-outline-primary" style={{marginRight: "15px"}} to='/covert/new'>
        New Covert Address
    </NavLink>
);


class CovertList extends React.Component {
    state = {
        loaded: false,
        addresses: [],
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
        this.loadData();
    }

    render() {
        return (
            <React.Fragment>
                <Loading loaded={this.state.loaded}
                         empty={this.state.addresses.length === 0}
                         emptyMessage={["There are no covert addresses.", "You can create a new one."]}
                >
                    <div className="row">
                        {this.state.addresses.map((address, index) => (
                            <CovertCard {...address} key={index}></CovertCard>
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

export default withLayout(MainLayout, {create:create})(connect(mapStateToProps)(CovertList));
