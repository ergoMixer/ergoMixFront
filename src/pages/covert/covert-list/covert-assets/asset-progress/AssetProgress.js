import React from 'react';
import { useHistory } from "react-router-dom";
import CovertTokenProgress from "../../../../../components/status-card/covert-card/CovertTokenProgress";
import * as formatter from "../../../../../formatter/formatters";
import { connect } from "react-redux";

const AssetProgress = props => {
    const history = useHistory();
    const handleClick = () => {
        const ringUrl = '/covert/' + props.covertId + '/asset/' + (props.tokenId ? props.tokenId + '/ring/' : 'ring/') + props.ring;
        history.push(ringUrl);
    }
    return (
        <div className="col-12 col-md-6">
            <div className="card card-stats">
                <div className="card-header card-header-success card-header-icon">
                    <div className="card-icon">
                        <i className="material-icons">schedule</i>
                    </div>
                    <h3 className="card-title">
                        {formatter.tokenName(props.tokenId ? props.tokenId : "")}
                    </h3>
                </div>
                <div className="card-body text-left progress-card">
                    <CovertTokenProgress {...props}/>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="float-right">
                                <button className="btn btn-outline-primary" onClick={handleClick}>Change Ring</button>
                            </div>
                            <div>{formatter.token(props.ring, props.tokenId)} Ring</div>
                            {props.currentMixingAmount ? (
                                <div>Mixing {formatter.token(props.currentMixingAmount, props.tokenId)}</div>
                            ) : (
                                <div>No Active Mixes</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    tokens: state.tokens,
});

export default connect(mapStateToProps)(AssetProgress);