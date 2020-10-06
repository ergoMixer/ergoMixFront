import React from 'react';
import QRCode from "react-qr-code";
import ProjectModal from "../../modal/modal";
import { ReactComponent as QrcodeSVG } from '../../../assets/img/qrcode.svg';
import { connect } from "react-redux";
import CovertCardFooter from './CovertCardFooter';
import CopyClipboard from "../../copy-clipboard/CopyClipboard";
import CovertTokenProgress from "./CovertTokenProgress";

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

    render() {
        const assets = [...this.props.assets].slice(0, 3)
        return (
            <div className="col-12 col-md-6">
                <ProjectModal close={this.hideQrCode} show={this.state.showQrCode}>
                    <div className="text-center">
                        <CopyClipboard value={this.props.deposit}/>
                        <br/>
                        <QRCode size={256} value={this.props.deposit}/>
                    </div>
                </ProjectModal>
                <div className="card card-stats">
                    <div className="card-header card-header-success card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">call_split</i>
                        </div>
                        {/*<CardHeaderTitle {...this.props}/>*/}
                    </div>
                    <div className="card-body statistic-card text-left">
                        {assets.map((item, index) => {
                            if(item.need > 0) {
                                return <CovertTokenProgress {...item} key={index}/>
                            }
                            return null
                        })}
                        <div className="mt-2">
                            Deposit Address <QrcodeSVG className="pull-right"
                                                       onClick={this.showQrCode}>gradient</QrcodeSVG>
                        </div>
                        <div>
                            <CopyClipboard value={this.props.deposit}/>
                        </div>
                        <CovertCardFooter {...this.props} showDetails={this.showDetails}/>
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

