import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import QRCode from "react-qr-code";
import LinearProgress from '@material-ui/core/LinearProgress';
import * as formatter from '../../../../formatter/formatters'
import ProjectModal from "../../../../components/modal/modal";
import MoreDetail from "./MoreDetail";
import { ReactComponent as QrcodeSVG } from '../../../../assets/img/qrcode.svg';
import CardHeaderTitle from './details/CardHeaderTitle';
import CardFooter from './details/CardFooter.js';
import { loadInfoAsync, loadMixLevelAsync, loadRingsAsync, loadSupportedTokensAsync } from "../../../../store/action";
import { connect } from "react-redux";

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
        const tokenProgressValue = this.props.tokenAmount > 0 ? Math.max(0, Math.min(100, 100 * this.props.doneTokenDeposit / this.props.tokenAmount)) : 0;
        return (
            <div className="col-12 col-md-6">
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
                        <CardHeaderTitle {...this.props}/>
                    </div>
                    <div className="card-body statistic-card text-left">
                        <div>
                            Pending Deposit: {formatter.erg(this.props.amount - this.props.doneDeposit)} /
                            Deposited: {formatter.erg(this.props.doneDeposit)}</div>
                        <LinearProgress variant='determinate' color="secondary" value={progressValue}/>
                        {this.props.mixingTokenId ? (
                            <div className="mt-2">
                                <div>
                                    Pending Deposit: {formatter.token(this.props.tokenAmount - this.props.doneTokenDeposit, this.props.mixingTokenId)} /
                                    Deposited: {this.props.doneTokenDeposit}</div>
                                <LinearProgress variant='determinate' color="secondary" value={tokenProgressValue}/>
                            </div>
                        ) : null}
                        <div className="mt-2">
                            Deposit Address <QrcodeSVG className="pull-right"
                                                       onClick={this.showQrCode}>gradient</QrcodeSVG>
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
                        <CardFooter {...this.props} showDetails={this.showDetails}/>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = () => ({
//     token:
});


export default connect(mapStateToProps)(PendingDepositCard);

