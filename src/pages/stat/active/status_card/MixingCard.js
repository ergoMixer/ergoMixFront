import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import QRCode from "react-qr-code";
import LinearProgress from '@material-ui/core/LinearProgress';
import * as formatter from '../../../../formatter/formatters'
import ProjectModal from "../../../../components/modal/modal";
import MoreDetail from "./MoreDetail";
import CardHeaderTitle from './details/CardHeaderTitle';
import CardFooter from "./details/CardFooter";

class MixingCard extends React.Component {
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
        const totalProgress = this.props.groupStat.numComplete / this.props.groupStat.numBoxes * 100
        const boxProgress = this.props.groupStat.doneMixRound / this.props.groupStat.totalMixRound * 100
        return (
            <div className="col-12 col-md-6">
                <ProjectModal close={this.hideQrCode} show={this.state.showQrCode}>
                    <div className="text-center">
                        <b>
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
                        </b>
                        <br/>
                        <QRCode size={128} value={this.props.deposit}/>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.hideDetails} show={this.state.showDetail}>
                    <MoreDetail {...this.props}/>
                </ProjectModal>

                <div className="card card-stats">
                    <div className="card-header card-header-success card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">autorenew</i>
                        </div>
                        <CardHeaderTitle {...this.props}/>
                    </div>
                    <div className="card-body statistic-card text-left">
                        <div>
                            Total Boxes: {this.props.groupStat.numBoxes} /
                            Completed Boxes: {this.props.groupStat.numComplete} /
                            Withdrawn Boxes: {this.props.groupStat.numWithdrawn}</div>
                        <LinearProgress variant='determinate' color="secondary" value={totalProgress}/>

                        <br/>
                        <br/>
                        <div>
                            Mixing Progress
                            {/*    Total Mix Round for Uncompleted boxes: {this.props.groupStat.totalMixRound} /*/}
                            {/*    Deposited: {this.props.groupStat.doneMixRound}*/}
                        </div>
                        <LinearProgress variant='determinate' color="secondary" value={boxProgress}/>
                        <CardFooter {...this.props} showDetails={this.showDetails}/>
                    </div>
                </div>
            </div>
        )
    };
}

export default MixingCard;

