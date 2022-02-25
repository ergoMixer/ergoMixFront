import React from 'react';
// import { withRouter } from "react-router";
import * as formatter from "../../../../../formatter/formatters";
import { connect } from "react-redux";

const pendingAsset = props => {
    const handleClick = () => {
        const ringUrl = '/covert/' + props.covertId + '/asset/' + (props.tokenId ? props.tokenId + '/ring/' : 'ring/') + props.ring;
        props.history.push(ringUrl);
    }

    const handleWithdraw =() => {
        props.withdraw(props.tokenId)
    }

    return (
        <div className="col-12 col-md-6">
            <div className="card card-stats">
                <div className="card-header card-header-warning card-header-icon">
                    <div className="card-icon">
                        <i className="material-icons">error_outline</i>
                    </div>
                    <h3 className="card-title">
                        {formatter.tokenName(props.tokenId ? props.tokenId : "")}
                    </h3>
                </div>
                <div className="card-body text-left progress-card">
                    <div>
                        Deposited: {formatter.token(props.confirmedDeposit, props.tokenId)}
                        <br/>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="float-right ml-2">
                                <button className="btn btn-outline-primary" onClick={handleClick}>Select Ring</button>
                            </div>
                                {props.tokenId === '' ?
                                    null :
                                    <div className="float-right">
                                        <button className="btn btn-outline-primary" onClick={handleWithdraw}>Withdraw
                                        </button>
                                    </div>
                                }

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

// export default connect(mapStateToProps)(withRouter(pendingAsset));
export default connect(mapStateToProps)(pendingAsset);