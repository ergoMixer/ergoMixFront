import React from 'react';
import {connect} from "react-redux";
import MainLayout from "../../layout/main-layout/MainLayout";
import withLayout from '../../hoc/with_layout/withLayout';

const settings = props => {
    return (
        <div className="row">
            <div className="card">
                <div className="card-body">
                    <div>Used node address: {props.info.ergoNode}</div>
                    <div>Used explorer address: {props.info.ergoExplorer}</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    info: state.info,
});


export default withLayout(MainLayout)(connect(mapStateToProps)(settings));
