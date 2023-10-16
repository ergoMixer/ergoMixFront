import React from 'react';
import Breadcrumb from "../../../components/broadcom/Breadcrumb";
import withLayout from '../../../hoc/with_layout/withLayout';
import MainLayout from '../../../layout/main-layout/MainLayout';
import Panel from '../../../components/panel/Panel';
import { TextField } from '@mui/material';
import { ApiNetwork } from '../../../network/api';
import CopyClipboard from '../../../components/copy-clipboard/CopyClipboard';
import QRCode from 'react-qr-code';

class StealthPaymentAddress extends React.Component {
    state = {
        pk: '',
        generated: true,
        generating: false,
        address: '',
        error: '',
    };

    generateNewAddress = () => {
        if(!this.state.generated && !this.state.generating){
            this.setState({
                generating: true
            })
            ApiNetwork.generateNewStealthAddress(this.state.pk).then(address => {
                this.setState({
                    generated: true,
                    generating: false,
                    address: address.address,
                    error: ''
                })
            }).catch(err=> {
                this.setState({
                    error: err.response.data.message,
                    generated: true,
                    generating: false,
                    address: ''
                })
                console.log(err)
            })
        }
    }

    componentDidUpdate = () => {
        this.generateNewAddress();
    }

    beginGenerate = () => {
        this.setState({
            generated: false
        })
    }

    breadcrumbPath = () => {
        return [
            {url: '/stealth', title: 'Stealth Address'},
            {title: 'Generate Payment Address'}
        ]
    };

    savePK = event => {
        this.setState({
            pk: event.target.value
        })
    }

    render() {
        return (
            <div className="row">
                <Breadcrumb path={this.breadcrumbPath()}/>

                <div className="col-8 offset-2">
                    <Panel>
                    <div className="row">
                            <div className="col-12">
                                <TextField
                                    label="Stealth PK"
                                    onChange={this.savePK}
                                    value={this.state.pk}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button
                                    className="btn btn-success"
                                    disabled={this.state.pk === ''}
                                    onClick={this.beginGenerate}>
                                    Generate new payment address
                                </button>
                            </div>
                        </div>   
                        {this.state.error}
 
                        {this.state.address ? (
                            <div className="text-center">
                                <CopyClipboard value={this.state.address}/>
                                <br/>
                                <QRCode size={256} value={this.state.address}/>
                            </div>
                        ) : null}           
                    </Panel>
                </div>
            </div>
        )
    }
}


export default withLayout(MainLayout)(StealthPaymentAddress);
