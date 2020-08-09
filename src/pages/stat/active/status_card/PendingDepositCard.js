import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import {NavLink} from "react-router-dom";
import QRCode from "react-qr-code";
import LinearProgress from '@material-ui/core/LinearProgress';
import * as formatter from '../../../../formatter/formatters'
import ProjectModal from "../../../../components/modal/modal";
import MoreDetail from "./MoreDetail";
import { ReactComponent as QrcodeSVG } from '../../../../assets/img/qrcode.svg';

class PendingDepositCard extends React.Component {
    state = {
        depositCopied: false,
        showQrCode: false,
        showDetail: false,
    };

    copyDeposit = copyFunction => {
        copyFunction(this.props.deposit);
        this.setState({depositCopied: true});
        setTimeout(() => {
            this.setState({depositCopied: false})
        }, 5000);
    }

    showQrCode = () => {
        this.setState({showQrCode: true});
    }

    hideQrCode = () => {
        this.setState({showQrCode: false});
    }

    showDetails = () => {
        this.setState({showDetail: true})
    }

    hideDetails = () => {
        this.setState({showDetail: false})
    }

    render() {
        const progressValue = Math.max(0, Math.min(100, 100 * this.props.doneDeposit / this.props.amount));
        return (
            <div className="col-4 col-sm-6 col-xs-12">
                <ProjectModal close={this.hideQrCode} show={this.state.showQrCode}>
                    <div className="text-center">
                        <CopyToClipboard
                            render={({copy}) => (
                                <div onClick={() => this.copyDeposit(copy)}>
                                    {this.props.deposit}{this.state.depositCopied ? (
                                    <span className="text-success">
                                                &nbsp;&nbsp;<i className="fa fa-check"/>Copied
                                            </span>
                                ) : null}
                                </div>
                            )}
                        />
                        <br/>
                        <QRCode size={256} value={this.props.deposit}/>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.hideDetails} show={this.state.showDetail}>
                    <MoreDetail {...this.props}/>
                </ProjectModal>

                <div className="card card-stats">
                    <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">schedule</i>
                        </div>
                        <h3 className="card-title">Mixing {formatter.erg(this.props.mixingAmount)}</h3>
                    </div>
                    <div className="card-body text-left">
                        <div>
                            Pending Deposit: {formatter.erg(this.props.amount - this.props.doneDeposit)} /
                            Deposited: {formatter.erg(this.props.doneDeposit)}</div>
                        <LinearProgress variant='determinate' color="secondary" value={progressValue}/>

                        <br/>
                        <div>
                            Deposit Address <QrcodeSVG className="pull-right" onClick={this.showQrCode}>gradient</QrcodeSVG>
                        </div>
                        <div>
                            <CopyToClipboard
                                render={({copy}) => (
                                    <div onClick={() => this.copyDeposit(copy)}>
                                        {this.props.deposit}{this.state.depositCopied ? (
                                        <span className="text-success">
                                                &nbsp;&nbsp;<i className="fa fa-check"/>Copied
                                            </span>
                                    ) : null}
                                    </div>
                                )}
                            />
                        </div>
                        <hr/>
                        <div className="text-center">
                            <button className="btn btn-outline-secondary" onClick={this.showDetails}>Show More</button>
                            &nbsp;
                            <NavLink className="btn btn-outline-primary"
                                     to={"/stat/active/" + this.props.id}>Details</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default PendingDepositCard;

