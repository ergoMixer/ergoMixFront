import React from 'react';
import withLayout from '../../../../hoc/with_layout/withLayout';
import MainLayout from '../../../../layout/main-layout/MainLayout';
import { ApiNetwork } from "../../../../network/api";
import * as formatter from '../../../../formatter/formatters'

import ProjectModal from "../../../../components/modal/modal";
import { connect } from "react-redux";
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import Panel from "../../../../components/panel/Panel";
import CopyClipboard from "../../../../components/copy-clipboard/CopyClipboard";
import Breadcrumb from "../../../../components/broadcom/Breadcrumb";
import Withdraw from "../../../stat/withdraw/Withdraw";
import Tooltip from "../../../../components/tooltip/Tooltip";
import { withParams } from '../../../../hoc/withParams';
class CovertHistory extends React.Component {
    state = {
        mix: [],
        group: null,
        withdrawShow: false,
        transactionShow: false,
        withdrawAddress: '',
        mixId: '',
    };

    loadData = () => {
        const group = this.props.match.params.covertId;
        if (this.state.group !== group) {
            ApiNetwork.mixRequestList(group).then((response => {
                this.setState({mix: response.data, group: group});
            })).catch(error => {

            });
        }
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.loadData();
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

    breadcrumbPath = () => {
        if(!this.props.covertLoaded){
            ApiNetwork.covertList();
        }
        const address = this.props.covertMap[this.props.match.params.covertId];
        return [
            {url: '/covert', title: "Covert Address"},
            {title: address},
        ]
    }

    render = () => {
        return (
            <div className={"row"}>
                <ProjectModal close={this.closeModal} show={this.state.withdrawShow}>
                    <Withdraw mix={this.state.mixId} withdraw={this.state.withdrawAddress} close={this.closeModal}/>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.transactionShow}>
                    <div>Transaction ID:</div>
                    <CopyClipboard value={this.state.transactionId}/>
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
                           rel="noopener noreferrer"
                           className="btn btn-outline-primary">
                            View In Explorer
                        </a>

                    </div>
                </ProjectModal>
                <Breadcrumb path={this.breadcrumbPath()}/>
                <div className="col-12">
                    <Panel>
                        <div className="table-responsive">
                            <table className="table">
                                <thead className=" text-primary">
                                <tr style={{textAlign: "center"}}>
                                    <th>ID</th>
                                    <th>Amount</th>
                                    <th>Box Type</th>
                                    <th>Latest Activity</th>
                                    <th>Round</th>
                                    <th>Withdraw Address</th>
                                    <th>Status</th>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.mix.map((mixItem, index) => (
                                    <tr key={index} style={{textAlign: "center"}}>
                                        <td>
                                            <Tooltip title={<span className="tooltip-text">{mixItem.id}</span>} arrow>
                                                <div>{formatter.id(mixItem.id)}</div>
                                            </Tooltip>
                                        </td>
                                        <td>{formatter.token(mixItem.mixingTokenId ? mixItem.mixingTokenAmount : mixItem.amount, mixItem.mixingTokenId)}</td>
                                        <td>{mixItem.boxType}</td>
                                        <td>{mixItem.lastMixTime}</td>
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
                    </Panel>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    info: state.info,
    tokens: state.tokens,
    covertMap: state.covertMap,
    covertLoaded: state.covertLoaded
});

export default withLayout(MainLayout)(connect(mapStateToProps)(withParams(CovertHistory)));

