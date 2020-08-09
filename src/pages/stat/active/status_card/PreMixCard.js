import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import {NavLink} from "react-router-dom";
import QRCode from "react-qr-code";
import LinearProgress from '@material-ui/core/LinearProgress';
import * as formatter from '../../../../formatter/formatters'
import ProjectModal from "../../../../components/modal/modal";
import MoreDetail from "./MoreDetail";


class PreMixCard extends React.Component {
    state = {
        depositCopied: false,
        showDetail: false,
    };

    copyDeposit = copyFunction => {
        copyFunction(this.props.deposit);
        this.setState({depositCopied: true});
        setTimeout(() => {
            this.setState({depositCopied: false})
        }, 5000);
    }

    showDetails = () => {
        this.setState({showDetail: true})
    }

    hideDetails = () => {
        this.setState({showDetail: false})
    }

    render() {
        const progressValue = 100 * this.props.doneDeposit / this.props.amount;
        return (
            <div className="col-4 col-sm-6 col-xs-12">
                <ProjectModal close={this.hideDetails} show={this.state.showDetail}>
                    <MoreDetail {...this.props}/>
                </ProjectModal>

                <div className="card card-stats">
                    <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">compare_arrows</i>
                        </div>
                        <h3 className="card-title">Mixing {formatter.erg(this.props.mixingAmount)}</h3>
                    </div>
                    <div className="card-body text-left">
                        <div>Creating Mix Boxes...</div>
                        <br/>
                        <br/>
                        <br/>
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

export default PreMixCard;

