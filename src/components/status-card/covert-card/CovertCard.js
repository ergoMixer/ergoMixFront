import React from 'react';
import QRCode from "react-qr-code";
import ProjectModal from "../../modal/modal";
import QrcodeSVG from '../../../assets/img/qrcode.svg';
import {connect} from "react-redux";
import CopyClipboard from "../../copy-clipboard/CopyClipboard";
import CovertTokenProgress from "./CovertTokenProgress";
import CovertCardAction from './CovertCardActions';
import CallSplit from "@mui/icons-material/CallSplit";

class CovertCard extends React.Component {
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
    cardHeaderClass = assets => {
        const running = (
            assets.length == 0
                ? 0
                : assets.map(item => item.runningMixingAmount)
                    .reduce(
                        (accumulator, currentValue) => accumulator + currentValue)
        );
        const current = (
            assets.length == 0 ? 0
                : assets.map(item => item.currentMixingAmount)
                    .reduce(
                        (accumulator, currentValue) => accumulator + currentValue
                    ));
        const card_class = "card-header card-header-icon"
        if (running > 0) {
            return card_class + " card-header-success"
        } else if (current - running > 0) {
            return card_class + " card-header-info"
        }
        return card_class + " card-header-warning"
    }

    render() {
        const assets = [...this.props.assets].slice(0, 3)
        const extraAssetCount = this.props.assets.filter(item => item.tokenId).length
        return (
            <div className="col-12 col-md-6">
                <ProjectModal close={this.hideQrCode} show={this.state.showQrCode} scroll={'hidden'}>
                    <div className="text-center">
                        <CopyClipboard value={this.props.deposit}/>
                        <br/>
                        <QRCode size={256} value={this.props.deposit}/>
                    </div>
                </ProjectModal>
                <div className="card card-stats">
                    <div className={this.cardHeaderClass(assets)}>
                        <div className="card-icon">
                            <i className="material-icons"><CallSplit /></i>
                        </div>
                        <h3 className="card-title">
                            <CovertCardAction
                                showWithdrawAssets={extraAssetCount > 0}
                                {...this.props}
                                handleEdit={() => this.props.edit(this.props.id, this.props.nameCovert)}
                                handlePrivateKey={()=>this.props.privateKey(this.props.id)}
                                handleWithdraw={()=>{this.props.withdraw(this.props.id)}}
                            />
                            <div
                                style={{padding: "6px 12px 6px 0", textAlign: "left"}}
                            >
                                {this.props.nameCovert ? this.props.nameCovert : "No Name"}
                            </div>
                        </h3>
                    </div>
                    <div className="card-body statistic-card card-little text-left">
                        {assets.map((item, index) => {
                            if (item.need > 0) {
                                return <CovertTokenProgress {...item} key={index}/>
                            }
                            return null
                        })}
                        <div className="mt-2">
                            Deposit Address
                        </div>
                        <div>
                            <QrcodeSVG className="pull-right" onClick={this.showQrCode}>gradient</QrcodeSVG>
                            <CopyClipboard value={this.props.deposit}/>
                        </div>
                        {/*<CovertCardFooter {...this.props} showDetails={this.showDetails}/>*/}
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = (state) => ({
    tokens: state.tokens
});

export default connect(mapStateToProps)(CovertCard);

