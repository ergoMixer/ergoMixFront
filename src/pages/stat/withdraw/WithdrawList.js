import React from 'react';
import { NotificationManager } from "react-notifications";
import { ApiNetwork } from "../../../network/api";
import * as formatter from '../../../formatter/formatters';
import Tooltip from "../../../components/tooltip/Tooltip";
import Done from "@mui/icons-material/Done";
import Clear from "@mui/icons-material/Clear";

class WithdrawList extends React.Component {
    state = {
        mix: [],
        loading: "",
    };

    componentDidMount = () => {
        const mixCopy = [];
        this.props.mix.forEach( (box, index) => {
            if (box.checked)
                mixCopy.push({...box, loading: ""})
        });
        this.setState({
            mix: mixCopy,
        });
    };

    withdrawNow = () => {
        let mixCopy = [...this.state.mix];
        this.setState({loading: "withdraw"});
        mixCopy.forEach( (box, index) => {
            mixCopy[index] = {...box, loading: "Start"};
            this.setState({mix: mixCopy});
            this.callApi(mixCopy, index, true);
        });
    };

    callApi = (mix, index, mixNow) => {
        ApiNetwork.withdraw(mix[index].id, mix[index].withdraw, mixNow).then(response => {
            mix[index] = {...mix[index], loading: 'Done'};
            this.setState({loading: ""});
            this.setState({mix: mix});
        }).catch(exp => {
            mix[index] = {...mix[index], loading: 'Failed'};
            this.setState({loading: ""});
            this.setState({mix: mix});
            NotificationManager.error(formatter.errorMessage(exp), 'Update Exception!', 5000);
        });
    };


    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="card-body" style={{overflowY: 'scroll', maxHeight: '40vh', minWidth: '800px'}}>
                        <div className="table-responsive">
                            <table className="table">
                                <thead className=" text-primary">
                                <tr>
                                    <th>ID</th>
                                    <th>Amount</th>
                                    <th>Withdraw Address</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.mix.map((box, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Tooltip title={<span className="tooltip-text">{box.id}</span>} arrow>
                                                <div>{formatter.id(box.id)}</div>
                                            </Tooltip>
                                        </td>
                                        <td>{formatter.token(box.mixingTokenId ? box.mixingTokenAmount : box.amount, box.mixingTokenId)}</td>
                                        <td>{box.withdraw}</td>
                                        <td>
                                            {box.loading === "Start" ? <i className="fa fa-circle-o-notch fa-spin"/> : box.loading === "Done" ? <i className="material-icons" style={{color: "green"}}><Done /></i> : box.loading === "Failed" ? <i className="material-icons" style={{color: "red"}}><Clear /></i> : null }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row" style={{padding:20}}>
                        <div className="col-md-12">
                            <button className="btn btn-outline-warning" style={{width: "100%"}} onClick={this.withdrawNow}>
                                {this.state.loading === "withdraw" ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                &nbsp;&nbsp;Withdraw Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default WithdrawList;
