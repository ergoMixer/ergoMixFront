import React from 'react';
import { connect } from "react-redux";

const RingStatistic = props => {
    let statistics = {};
    const tokenRings = (props.tokenId ? props.rings[props.tokenId] : props.rings.erg);
    if(tokenRings !== undefined){
        statistics = tokenRings["" + props.amount];
        if(statistics === undefined){
            statistics = {unspentHalf: 0, spentHalf: 0};
        }
    }
    return (
        <React.Fragment>
            <h4 className="card-category">Available Half Boxes: {statistics.unspentHalf}</h4>
            <h4 className="card-category">Ring Activity (Mixes in Last 24h): {statistics.spentHalf}</h4>
        </React.Fragment>
    )
};

const mapStateToProps = state => ({
    rings: state.rings,
    tokens: state.tokens,
});


export default connect(mapStateToProps)(RingStatistic);