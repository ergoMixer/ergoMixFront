import React from 'react';
import { connect } from "react-redux";
import MainLayout from "../../layout/main-layout/MainLayout";
import withLayout from '../../hoc/with_layout/withLayout';
import Panel from "../../components/panel/Panel";

const settings = props => {
    return (
        <div className="row">
            <Panel>
                <div><label className="font-weight-bold">Used Node Address:&nbsp;</label> {props.info.ergoNode}</div>
                <div><label className="font-weight-bold">Used Explorer Address:&nbsp;</label> {props.info.ergoExplorer}</div>
            </Panel>
        </div>
    )
}

const mapStateToProps = state => ({
    info: state.info,
});


export default withLayout(MainLayout)(connect(mapStateToProps)(settings));
