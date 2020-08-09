import React from 'react';
import { NotificationManager } from "react-notifications";
import { ApiNetwork } from "../../../network/api";
import * as formatter from '../../../formatter/formatters';

class Withdraw extends React.Component {
    state = {
        withdraw: null,
        mix: null,
        loading: "",
        focused: "",
    };

    loadData = () => {
        if (this.state.mix !== this.props.mix) {
            this.setState({withdraw: this.props.withdraw, mix: this.props.mix})
        }
    }

    callApi = mixNow => {
        ApiNetwork.withdraw(this.state.mix, this.state.withdraw, mixNow).then(response => {
            this.setState({loading: ""});
            this.props.close();
        }).catch(exp => {
            this.setState({loading: ""});
            NotificationManager.error(formatter.errorMessage(exp), 'Update Exception!', 5000);
        })
    };

    updateWithdraw = () => {
        this.setState({loading: "update"});
        this.callApi(false);
    };

    withdrawNow = () => {
        this.setState({loading: "withdraw"});
        this.callApi(true);
    };

    componentDidMount() {
        this.loadData();
    }

    render() {
        let addressInputClass = "form-group bmd-form-group";
        if (this.state.focused === "withdraw") addressInputClass += " is-focused";
        if (this.state.withdraw) addressInputClass += " is-filled";
        return (
            <div className="row">
                <div className="col-12">
                    <div className={addressInputClass}>
                        <label className="bmd-label-floating">Withdraw Address</label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={event => this.setState({withdraw: event.target.value})}
                            onFocus={() => this.setState({focused: "withdraw"})}
                            onBlur={() => this.setState({focused: ""})}
                            value={this.state.withdraw}
                        />
                    </div>
                </div>
                <div className="col-6">
                    <button className="btn btn-outline-primary" style={{width: "100%"}} onClick={this.updateWithdraw}>
                        {this.state.loading === "update" ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                        &nbsp;&nbsp;update withdraw address
                    </button>
                </div>
                <div className="col-6">
                    <button className="btn btn-outline-warning" style={{width: "100%"}} onClick={this.withdrawNow}>
                        {this.state.loading === "withdraw" ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                        &nbsp;&nbsp;Withdraw Now
                    </button>
                </div>
            </div>
        )
    };
}

export default Withdraw;

