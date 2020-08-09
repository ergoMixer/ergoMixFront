import React from 'react';
import withLayout from '../../../../hoc/with_layout/withLayout';
import MainLayout from '../../../../layout/main-layout/MainLayout';
import {ApiNetwork} from "../../../../network/api";
import * as formatter from '../../../../formatter/formatters'

import {NavLink} from "react-router-dom";
import ProjectModal from "../../../../components/modal/modal";
import Withdraw from "../../withdraw/Withdraw";
import {connect} from "react-redux";
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";

class ActiveStatDetail extends React.Component {
    state = {
        mix: [],
        group: null,
        withdrawShow: false,
        transactionShow: false,
        withdrawAddress: '',
        miIid: '',
    };

    loadData = () => {
        const group = this.props.match.params.groupId;
        ApiNetwork.mixRequestList(group).then((response => {
            this.setState({mix: response.data, group: group});
        })).catch(error => {

        });
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        const group = this.props.match.params.groupId;
        if (this.state.group !== group) {
            this.loadData();
        }
    }

    componentDidMount() {
        this.loadData();
    }

    closeModal = () => {
        this.setState({withdrawShow: false, transactionShow: false});
        this.loadData();
    }
    withdraw = (mixItem) => {
        this.setState({
            withdrawShow: true,
            withdrawAddress: mixItem.withdraw,
            mixId: mixItem.id,
        })
    }
    showTransaction = mixItem => {
        this.setState({
            transactionId: mixItem.withdrawTxId,
            transactionShow: true,
        })
    }
    copyDeposit = copyFunction => {
        copyFunction(this.state.transactionId);
        this.setState({transactionCopied: true});
        setTimeout(() => {
            this.setState({transactionCopied: false})
        }, 5000);
    }

    render() {
        return (
            <div className={"row"}>
                <ProjectModal close={this.closeModal} show={this.state.withdrawShow}>
                    <Withdraw mix={this.state.mixId} withdraw={this.state.withdrawAddress} close={this.closeModal}/>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.transactionShow}>
                    <div>Transaction ID:</div>
                    <CopyToClipboard
                        render={({copy}) => (
                            <div onClick={() => this.copyDeposit(copy)}>
                                {this.state.transactionId}
                                {this.state.transactionCopied ? (
                                <span className="text-success">&nbsp;&nbsp;
                                    <i className="fa fa-check"/>Copied
                                </span>
                            ) : null}
                            </div>
                        )}
                    />
                    <div className="text-center">
                        <CopyToClipboard
                            render={({copy}) => (
                                <button className="btn btn-outline-primary" onClick={() => this.copyDeposit(copy)}>
                                    Copy Tx Id
                                </button>
                            )}
                        /> &nbsp;
                        <a href={this.props.info.ergoExplorerFront + "/en/transactions/" + this.state.transactionId}
                           target="_blank"
                           className="btn btn-outline-primary">
                            View In Explorer
                        </a>

                    </div>
                </ProjectModal>
                <div className="col-12"><NavLink to={"/stat/active"}>Stat</NavLink> / {this.props.match.params.groupId}
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className=" text-primary">
                                    <tr>
                                        <th>Id</th>
                                        <th>Amount</th>
                                        <th>Creation date</th>
                                        <th>Box type</th>
                                        <th>Round</th>
                                        <th>Withdraw Address</th>
                                        <th>Status</th>
                                        <th/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.mix.map((mixItem, index) => (
                                        <tr key={index}>
                                            <td title={mixItem.id}>{formatter.id(mixItem.id)}</td>
                                            <td>{formatter.erg(mixItem.amount)}</td>
                                            <td>{mixItem.createdDate}</td>
                                            <td>{mixItem.boxType}</td>
                                            <td>{mixItem.rounds}</td>
                                            <td>{mixItem.withdraw === "" ? "(MANUAL)" : mixItem.withdraw}</td>
                                            <td>{mixItem.status}</td>
                                            <td>
                                                {mixItem.withdrawStatus === "nothing" ? (
                                                    <button className="btn btn-outline-primary"
                                                            onClick={() => this.withdraw(mixItem)}>Withdraw</button>
                                                ) : mixItem.withdrawTxId === "" ? "Transaction is being generated" : (
                                                    <button className="btn btn-outline-primary"
                                                            onClick={() => this.showTransaction(mixItem)}
                                                    >View Transaction</button>
                                                )}
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
        )
    }
    ;
}


const mapStateToProps = state => ({
    info: state.info,
});

export default withLayout(MainLayout)(connect(mapStateToProps)(ActiveStatDetail));

