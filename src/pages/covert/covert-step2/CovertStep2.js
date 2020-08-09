import React from 'react';
import { connect } from "react-redux";
import MixRing from "../../../components/mix-ring/MixRing";
import Panel from "../../../components/panel/Panel";


const covertStep2 = props => {
    const selectRing = amount => {
        props.saveValue({'ring': amount});
        props.setValid(true);
    }
    return (
        <React.Fragment>
            <div className="row text-center non-selectable">
                <div className="col-12 text-center">
                    <Panel>
                        <h4>Select Payment Ring</h4>
                        {props.token.id !== "" ? (
                            <React.Fragment>
                                <h4>You are mixing:&nbsp;
                                    <b>
                                        {props.token.name}
                                    </b>
                                </h4>
                                <h4>
                                    Token ID: <b>{props.token.id}</b>
                                </h4>
                            </React.Fragment>
                        ) : null}
                    </Panel>
                </div>
            </div>
            <div className="row non-selectable">
                {props.token.rings.map((amount, index) => (
                    <MixRing
                        key={index}
                        amount={amount}
                        tokenId={props.token.id}
                    >
                        {props.ring === amount ? (
                            <button className="btn btn-primary">Selected</button>
                        ) : (
                            <button className="btn btn-outline-primary" onClick={() => selectRing(amount)}>Use
                                this Ring</button>
                        )}
                    </MixRing>
                ))}
            </div>
        </React.Fragment>
    )
};


const mapStateToProps = state => ({
    rings: state.rings,
});

export default connect(mapStateToProps)(covertStep2);
