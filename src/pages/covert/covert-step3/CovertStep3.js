import React from 'react';
import { connect } from "react-redux";
import Slider from '@material-ui/core/Slider';
import * as formatter from '../../../formatter/formatters';
import Panel from "../../../components/panel/Panel";

class CovertStep3 extends React.Component {

    // componentDidMount = () => {
    //     const selectedLevel = isNaN(this.props.selectedLevel) ? 2 : this.props.selectedLevel;
    //     debugger
    //     let new_addresses = [];
    //     console.log(this.props.mixLevel, selectedLevel);
    //     let tokenCount = 1
    //     if(this.props.mixLevel){
    //         tokenCount = this.props.mixLevel[selectedLevel].token
    //     }
    //     (this.props.addresses ? this.props.addresses : []).forEach(address => {
    //         const tmp_address = {...address, token: tokenCount};
    //         new_addresses.push(tmp_address)
    //     });
    //     if (this.props.saveValue) {
    //         this.props.saveValue({addresses: new_addresses, selectedLevel: selectedLevel});
    //     }
    //     this.props.setValid(true);
    //     this.setState({addresses: new_addresses, selectedLevel: selectedLevel});
    // };
    //
    // rowFee = row => {
    //     let res = this.props.fee;
    //     const mixLevel = this.props.mixLevel[this.state.selectedLevel];
    //     if (mixLevel !== undefined)
    //         res += mixLevel.price;
    //     if (this.props.rate !== 0)
    //         res += parseInt(row.amount / this.props.rate);
    //     return res;
    // };
    //
    // tokenFee = row => {
    //     let res = 0;
    //     if (this.props.rate !== 0)
    //         res += parseInt(row.mixingTokenAmount / this.props.rate);
    //     return res;
    // }
    //
    // totalPrice = () => {
    //     let result = Math.ceil(this.props.addresses.length / this.props.boxInTransaction) * this.props.fee;
    //     this.props.addresses.forEach(address => {
    //         result += this.rowFee(address)
    //     });
    //     return result;
    // };
    //
    // totalToken = () => {
    //     let result = 0;
    //     this.props.addresses.forEach(address => {
    //         result += this.tokenFee(address);
    //     });
    //     return result;
    // }
    //
    // setMixLevel = (event, mixLevelIndex) => {
    //     const addresses = this.state.addresses.map(address => {
    //         return {...address, token: parseInt(this.props.mixLevel[mixLevelIndex].token)};
    //     });
    //     this.props.setValid(true);
    //     if (this.props.saveValue) {
    //         this.props.saveValue({addresses: addresses, selectedLevel: mixLevelIndex});
    //     }
    //     this.setState({addresses: addresses, selectedLevel: mixLevelIndex});
    // };
    //
    // render = () => {
    //     const total_fee = this.totalPrice();
    //     let total_price = total_fee;
    //     let total_fee_token = this.totalToken()
    //     let total_token = total_fee_token;
    //     this.state.addresses.forEach(address => {
    //         total_price += address.amount;
    //         total_token += address.mixingTokenAmount;
    //     });
    //     const marks = this.props.mixLevel.map((item, index) => {
    //         return {value: index, label: "Level " + (index + 1)}
    //     });
    //     const level = this.props.mixLevel[this.state.selectedLevel];
    //     // return (
    //     // )
    // };
}

const covertStep3 = props => {
    const total_fee = this.totalPrice();
    let total_price = total_fee;
    let total_fee_token = this.totalToken()
    let total_token = total_fee_token;
    this.state.addresses.forEach(address => {
        total_price += address.amount;
        total_token += address.mixingTokenAmount;
    });
    return (
        <div className="row">
            <div className="col-12">
                <Panel bodyClass="text-center">
                    <h4>
                        Specify your desired mixing level. The higher the mixing level, the more the mixing
                        rounds; note that the exact number of rounds cannot be guaranteed.
                    </h4>
                </Panel>
            </div>
            <div className="col-md-6 col-12">
                <div className="card card-stats">
                    <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">receipt</i>
                        </div>
                        <h4 className="card-title ">Summary</h4>
                    </div>
                    <div className="card-body text-left">
                        <div>
                            <label className="font-weight-bold">Total Fee ERGs:</label>
                            {formatter.erg(total_fee)}</div>
                        <div>
                            <label className="font-weight-bold">Deposit ERGs:</label>
                            {formatter.erg(total_price)}
                        </div>
                        {props.token.id ? (
                            <React.Fragment>
                                <div>
                                    <label className="font-weight-bold">Total Fee Tokens: </label>
                                    {formatter.token(total_fee_token, props.token.id)}
                                </div>
                                <div>
                                    <label className="font-weight-bold">Total Deposit Tokens: </label>
                                    {formatter.token(total_token, props.token.id)}
                                </div>
                            </React.Fragment>
                        ) : null}
                    </div>
                </div>
            </div>
            {/*<div className="col-md-6 col-12">*/}
            {/*    <div className="card card-stats">*/}
            {/*        <div className="card-header card-header-success card-header-icon">*/}
            {/*            <div className="card-icon">*/}
            {/*                <i className="material-icons">call_merge</i>*/}
            {/*            </div>*/}
            {/*            <h4 className="card-title ">Mixing Level</h4>*/}
            {/*        </div>*/}
            {/*        <div className="card-body">*/}
            {/*            <div className="row">*/}
            {/*                <div className="col-12">*/}
            {/*                    <div className="tab-content">*/}
            {/*                        <div className="tab-pane active text-left">*/}
            {/*                            <div style={{margin: "30px 30px 0 30px"}}>*/}
            {/*                                <Slider*/}
            {/*                                    max={marks.length - 1}*/}
            {/*                                    mix={0}*/}
            {/*                                    defaultValue={this.state.selectedLevel}*/}
            {/*                                    color={"secondary"}*/}
            {/*                                    steps={null}*/}
            {/*                                    onChangeCommitted={this.setMixLevel}*/}
            {/*                                    valueLabelDisplay="off"*/}
            {/*                                    valueLabelFormat={this.valueLabelFormat}*/}
            {/*                                    marks={marks}*/}
            {/*                                />*/}
            {/*                            </div>*/}
            {/*                            {level !== undefined ? (*/}
            {/*                                <React.Fragment>*/}
            {/*                                    <div>*/}
            {/*                                        <label className="font-weight-bold">Token price:</label>*/}
            {/*                                        {formatter.erg(level.price)}</div>*/}
            {/*                                    <div>*/}
            {/*                                        <label className="font-weight-bold">Approximate mixes:</label>*/}
            {/*                                        {level.token} rounds*/}
            {/*                                    </div>*/}
            {/*                                </React.Fragment>*/}
            {/*                            ) : null}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}

const mapStateToProps = state => ({
    rings: state.rings,
    fee: state.distributeFee,
    rate: state.rate,
    boxInTransaction: state.boxInTransaction,
    mixLevel: state.mixLevel,
});

export default connect(mapStateToProps)(covertStep3);
