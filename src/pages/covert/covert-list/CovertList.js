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
        this.loadData();
    }

    closeModal = () => {
        this.setState({isEditing: false})
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

    saveName = event => {
        let value = event.target.value;
        if(value) {
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
                    <ProjectModal close={this.closeModal} show={this.state.isEditing}>
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
                                <button className="btn btn-success" disabled={this.state.editingName===''} onClick={this.submitName}>Save</button>
                            </div>
                        </div>
                    </ProjectModal>
                    <div className="row">
                        <div className="col-12">
                            <Panel>
                                <div className="help-content-wrapper">
                                    <i className="material-icons box-display warning">call_split</i>
                                    <span className="helper-text"> Without any active or completed mix </span>
                                    <i className="material-icons box-display info">call_split</i>
                                    <span className="helper-text">Have Some Completed Mix</span>
                                    <i className="material-icons box-display success">call_split</i>
                                    <span className="helper-text">Have Some Active Mix</span>
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
