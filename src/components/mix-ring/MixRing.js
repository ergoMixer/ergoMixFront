import React from 'react';
import RingHeader from "./details/RingHeader";
import RingStatistic from "./details/RingStatistic";

const MixRing = props => {
    return (
        <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card card-stats">
                <RingHeader amount={props.amount} tokenId={props.tokenId}/>
                <div className="card-body text-center">
                    <RingStatistic tokenId={props.tokenId} amount={props.amount}/>
                    {props.children}
                </div>
            </div>
        </div>
    )
};


export default MixRing;