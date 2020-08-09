import React from 'react';
import { connect } from "react-redux";
import Slider from '@material-ui/core/Slider';
import * as formatter from '../../../formatter/formatters';
import Panel from "../../../components/panel/Panel";

class Step4 extends React.Component {
    state = {
        addresses: [],
        selectedLevel: 2
    };

    componentDidMount = () => {
        const selectedLevel = isNaN(this.props.selectedLevel) ? 2 : this.props.selectedLevel;
        let new_addresses = [];
        let tokenCount = 1
        if (this.props.mixLevel) {
            tokenCount = this.props.mixLevel[selectedLevel].token
        }
        (this.props.addresses ? this.props.addresses : []).forEach(address => {
            const tmp_address = {...address, token: tokenCount};
            new_addresses.push(tmp_address)
        });
        if (this.props.saveValue) {
            this.props.saveValue({addresses: new_addresses, selectedLevel: selectedLevel});
        }
        this.props.setValid(true);
        this.setState({addresses: new_addresses, selectedLevel: selectedLevel});
    };

    rowFee = row => {
        let res = this.props.startFee;
        const mixLevel = this.props.mixLevel[this.state.selectedLevel];
        if (mixLevel !== undefined)
            res += mixLevel.price;
        if (this.props.rate !== 0)
            res += parseInt(row.amount / this.props.rate);
        return res;
    };

    tokenFee = row => {
        let res = 0;
        if (this.props.rate !== 0)
            res += parseInt(row.mixingTokenAmount / this.props.rate);
        return res;
    }

    totalPrice = () => {
        let result = Math.ceil(this.props.addresses.length / this.props.boxInTransaction) * this.props.distributeFee;
        this.props.addresses.forEach(address => {
            result += this.rowFee(address)
        });
        return result;
    };

    totalToken = () => {
        let result = 0;
        this.props.addresses.forEach(address => {
            result += this.tokenFee(address);
        });
        return result;
    }

    setMixLevel = (event, mixLevelIndex) => {
        const addresses = this.state.addresses.map(address => {
            return {...address, token: parseInt(this.props.mixLevel[mixLevelIndex].token)};
        });
        this.props.setValid(true);
        if (this.props.saveValue) {
            this.props.saveValue({addresses: addresses, selectedLevel: mixLevelIndex});
        }
        this.setState({addresses: addresses, selectedLevel: mixLevelIndex});
    };

    render = () => {
        const total_fee = this.totalPrice();
        let total_price = total_fee;
        let total_fee_token = this.totalToken()
        let total_token = total_fee_token;
        this.state.addresses.forEach(address => {
            total_price += address.amount;
            total_token += address.mixingTokenAmount;
        });
        const marks = this.props.mixLevel.map((item, index) => {
            return {value: index, label: "Level " + (index + 1)}
        });
        const level = this.props.mixLevel[this.state.selectedLevel];
        return (
            <React.Fragment>
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
                                    <label className="font-weight-bold">Total Fee:&nbsp;</label>
                                    {formatter.erg(total_fee)} {this.props.token.id ? (
                                    <React.Fragment>
                                        <span className="small"> and </span>
                                        {formatter.token(total_fee_token, this.props.token.id)}
                                    </React.Fragment>
                                ) : null}
                                </div>
                                <div>
                                    <label className="font-weight-bold">Deposit:&nbsp;</label>
                                    {formatter.erg(total_price)} {this.props.token.id ? (
                                    <React.Fragment>
                                        <span className="small"> and </span>
                                        {formatter.token(total_token, this.props.token.id)}
                                    </React.Fragment>
                                ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="card card-stats">
                            <div className="card-header card-header-success card-header-icon">
                                <div className="card-icon">
                                    <i className="material-icons">call_merge</i>
                                </div>
                                <h4 className="card-title ">Mixing Level</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="tab-content">
                                            <div className="tab-pane active text-left">
                                                <div style={{margin: "30px 30px 0 30px"}}>
                                                    <Slider
                                                        max={marks.length - 1}
                                                        mix={0}
                                                        defaultValue={this.state.selectedLevel}
                                                        color={"secondary"}
                                                        steps={null}
                                                        onChangeCommitted={this.setMixLevel}
                                                        valueLabelDisplay="off"
                                                        valueLabelFormat={this.valueLabelFormat}
                                                        marks={marks}
                                                    />
                                                </div>
                                                {level !== undefined ? (
                                                    <React.Fragment>
                                                        <div>
                                                            <label className="font-weight-bold">Cost per
                                                                Box:&nbsp;</label>
                                                            {formatter.erg(level.price)}</div>
                                                        <div>
                                                            <label className="font-weight-bold">Approximate
                                                                Mixes:&nbsp;</label>
                                                            {level.token} rounds
                                                        </div>
                                                    </React.Fragment>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header card-header-icon card-header-rose">
                                <div className="card-icon">
                                    <i className="material-icons">assignment</i>
                                </div>
                                <h4 className="card-title ">Details</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className=" text-primary">
                                        <tr>
                                            <th>Amount</th>
                                            <th>Withdraw Address</th>
                                            <th>Fee</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.addresses.map((address, index) => (
                                            <tr key={index}>
                                                <td>{formatter.token(address.mixingTokenId ? address.mixingTokenAmount : address.amount, address.mixingTokenId)}</td>
                                                <td>{address.withdraw === "" ? "(MANUAL)" : address.withdraw}</td>
                                                <td>
                                                    {formatter.erg(this.rowFee(address))}
                                                    {address.mixingTokenId ? " / " + formatter.token(this.tokenFee(address), address.mixingTokenId) : null}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    };
}

const mapStateToProps = state => ({
    rings: state.rings,
    startFee: state.startFee,
    distributeFee: state.distributeFee,
    rate: state.rate,
    boxInTransaction: state.boxInTransaction,
    mixLevel: state.mixLevel,
});

export default connect(mapStateToProps)(Step4);
