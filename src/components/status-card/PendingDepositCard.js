import React from 'react';
import QRCode from "react-qr-code";
import LinearProgress from '@mui/material/LinearProgress';
import * as formatter from '../../formatter/formatters'
import ProjectModal from "../modal/modal";
import MoreDetail from "./MoreDetail";
import QrcodeSVG from '../../assets/img/qrcode.svg';
import CardHeaderTitle from './details/CardHeaderTitle';
import CardFooter from './details/CardFooter.js';
import { connect } from "react-redux";
import CopyClipboard from "../copy-clipboard/CopyClipboard";
import Schedule from "@mui/icons-material/Schedule";

class PendingDepositCard extends React.Component {
    state = {
        showQrCode: false,
        showDetail: false,
    };

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
                        <CopyClipboard value={this.props.deposit}/>
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
                            <i className="material-icons"><Schedule /></i>
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
                            <CopyClipboard value={this.props.deposit}/>
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

