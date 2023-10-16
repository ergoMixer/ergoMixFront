import React from 'react';
import QRCode from "react-qr-code";
import ProjectModal from "../../modal/modal";
import { ReactComponent as QrcodeSVG } from '../../../assets/img/qrcode.svg';
import CopyClipboard from "../../copy-clipboard/CopyClipboard";
import CallMerge from "@mui/icons-material/CallMerge";
import StealthCardActions from './StealthCardActions';
import { ApiNetwork } from '../../../network/api';
import { Button } from '@mui/material';
import * as formatter from "../../../formatter/formatters";

class StealthCard extends React.Component {
    state = {
        showQrCode: false,
        address: {
            show: false,
            value: '',
            generating: false,
            generated: false
        },
        generatedAddress: '',
        showDetail: false,
    };

    generateNewAddress = () => {
        if(this.state.address.show && !this.state.address.generated && !this.state.address.generating){
            this.setState(state => ({
                ...state,
                address:{
                    ...state.address,
                    generating: true
                }
            }))
            ApiNetwork.generateNewStealthAddress(this.props.pk).then(address => {
                this.setState(state => ({
                    ...state,
                    address: {
                        ...state.address,
                        generated: true,
                        generating: false,
                        address: address.address
                    }
                }))
            })
        }
    }

    componentDidUpdate = () => {
        this.generateNewAddress();
    }

    cardHeaderClass = () => {
        return 'card-header card-header-icon ' + (this.props.value > 0 ? 'card-header-info' : 'card-header-warning');
    }

    showQrCode = () => {
        this.setState({showQrCode: true});
    }

    showGenerateAddress = () => {
        this.setState({
            address: {
                show: true,
                generated: false,
                generating: false,
                address: '',
            },
            showQrCode: false
        })
    }

    closeAll = () => {
        this.setState(state => ({
            ...state,
            showQrCode: false,
            address: {
                ...state.address,
                show: false
            }
        }));
    }

    render() {
        return (
            <div className="col-12 col-md-6 d-flex">
                <ProjectModal close={this.closeAll} show={this.state.showQrCode} scroll={'hidden'}>
                    <div className="text-center">
                        <CopyClipboard value={this.props.pk}/>
                        <br/>
                        <QRCode size={256} value={this.props.pk}/>
                        <br/>
                        <Button className='btn btn-outline-primary' onClick={() => this.showGenerateAddress()}>Generate new payment address</Button>
                    </div>
                </ProjectModal>
                <ProjectModal close={this.closeAll} show={this.state.address.show} scroll={'hidden'}>
                    <div className="text-center">
                        {this.state.address.address ? (
                            <React.Fragment>
                        <CopyClipboard value={this.state.address.address}/>
                        <br/>
                        <QRCode size={256} value={this.state.address.address}/>
                        <br/>
                        <Button className='btn btn-outline-primary' onClick={() => this.showGenerateAddress()}>Generate new payment address</Button>
                        </React.Fragment>
                        ) : (
                            <div className="row">
                            <div className="col-12">
                                    <h3 className="text-center">
                                        Generating new payment address 
                                    </h3>
                                    <h3 className="text-center">
                                        Please wait <i className="fa fa-circle-o-notch fa-spin"/>
                                    </h3>
                            </div>
                        </div>
                                    )}
                    </div>
                </ProjectModal>
                <div className="card card-stats">
                    <div className={this.cardHeaderClass()}>
                        <div className="card-icon">
                            <i className="material-icons"><CallMerge /></i>
                        </div>
                        <h3 className="card-title">
                            <StealthCardActions
                                id={this.props.stealthId}
                                handleClose={this.closeAll}
                                handlePrivateKey={() => this.props.privateKey(this.props.stealthId)}
                                handleGenerateAddress={this.showGenerateAddress}
                                handleEdit={() => this.props.edit(this.props.stealthId, this.props.stealthName)}
                            />
                            <div
                                style={{padding: "6px 12px 6px 0", textAlign: "left"}}
                            >
                                {this.props.stealthName ? this.props.stealthName : "No Name"}
                            </div>
                        </h3>
                    </div>
                    <div className="card-body statistic-card card-little text-left">
                        <div className="mt-2">
                            Balance: {formatter.erg(this.props.value)} {this.props.assetsSize > 0 ? `and ${this.props.assetsSize} Tokens` : ''}
                        </div>
                        <div className="mt-2">
                            Stealth Public Key
                        </div>
                        <div>
                            <QrcodeSVG className="pull-right" onClick={this.showQrCode}>gradient</QrcodeSVG>
                            <CopyClipboard value={this.props.pk}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}


export default StealthCard;
