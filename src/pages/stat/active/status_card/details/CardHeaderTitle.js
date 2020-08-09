import React from 'react';
import * as formatter from "../../../../../formatter/formatters";
import { connect } from "react-redux";

const cardHeaderTitle = props => {
    return <h3 className="card-title">Mixing {formatter.token(props.mixingTokenId ? props.mixingTokenAmount : props.mixingAmount, props.mixingTokenId)}</h3>;
};

const mapStateToProps = state => ({
    tokens: state.tokens,
});

export default connect(mapStateToProps)(cardHeaderTitle);

