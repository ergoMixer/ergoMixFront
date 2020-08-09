import React from 'react';
import { connect } from "react-redux";
import Slider from '@material-ui/core/Slider';
import * as formatter from '../../../formatter/formatters';

class Step4 extends React.Component {
    state = {
        addresses: [],
        selectedLevel: 1
    };

    componentDidMount = () => {
        const selectedLevel = isNaN(this.props.selectedLevel) ? 1 : this.props.selectedLevel;
        let new_addresses = [];
        (this.props.addresses ? this.props.addresses : []).map(address => {
            const tmp_address = {...address};
            if (tmp_address.token === undefined) tmp_address.token = this.props.mixLevel[selectedLevel].token;
            new_addresses.push(tmp_address)
        });
        if (this.props.saveValue) {
            this.props.saveValue('addresses', new_addresses);
            this.props.saveValue('selectedLevel', selectedLevel);
        }
        this.props.setValid(true);
        this.setState({addresses: new_addresses, selectedLevel: selectedLevel});
    };

    rowFee = row => {
        let res = this.props.fee;
        const mixLevel = this.props.mixLevel[this.state.selectedLevel];
        if (mixLevel !== undefined)
            res += mixLevel.price;
        if (this.props.rate !== 0)
            res += parseInt(row.amount / this.props.rate);
        return res;
    };

    totalPrice = () => {
        let result = Math.ceil(this.props.addresses.length / this.props.boxInTransaction) * this.props.fee;
        this.props.addresses.forEach(address => {
            result += this.rowFee(address)
        });
        return result;
    };

    setMixLevel = (event, mixLevelIndex) => {
        const addresses = this.state.addresses.map(address => {
            return {...address, token: parseInt(this.props.mixLevel[mixLevelIndex].token)};
        });
        this.props.setValid(true);
        if (this.props.saveValue) {
            this.props.saveValue('addresses', addresses);
            this.props.saveValue('selectedLevel', mixLevelIndex);
        }
        this.setState({addresses: addresses, selectedLevel: mixLevelIndex});
    };

    render = () => {
        const total_fee = this.totalPrice();
        let total_price = total_fee;
        this.state.addresses.forEach(address => {
            total_price += address.amount;
        });
        const marks = this.props.mixLevel.map((item, index) => {
            return {value: index, label: "Level " + (index + 1)}
        });
        const level = this.props.mixLevel[this.state.selectedLevel];
        console.log(this.state.selectedLevel, this.props.mixLevel, level);
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4>
                                    Specify your desired mixing level. The higher the mixing level, the more the mixing rounds; note that the exact number of rounds cannot be guaranteed.
                                </h4>
                            </div>
                        </div>
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
                                <div><text className="font-weight-bold">Total fee:</text> {formatter.erg(total_fee)}</div>
                                <div><text className="font-weight-bold">Deposit amount:</text> {formatter.erg(total_price)}</div>
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
                                                        <div><text className="font-weight-bold">Token price:</text> {formatter.erg(level.price)}</div>
                                                        <div><text className="font-weight-bold">Number of tokens:</text> {level.token}</div>
                                                        <div><text className="font-weight-bold">Approximate mixes:</text> {level.token} rounds</div>
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
                                            <th>Fee Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.addresses.map((address, index) => (
                                            <tr key={index}>
                                                <td>{formatter.erg(address.amount)}</td>
                                                <td>{address.withdraw === "" ? "(MANUAL)" : address.withdraw}</td>
                                                <td>{formatter.erg(this.rowFee(address))}</td>
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
    fee: state.fee,
    rate: state.rate,
    boxInTransaction: state.boxInTransaction,
    mixLevel: state.mixLevel,
});


export default connect(mapStateToProps)(Step4);
