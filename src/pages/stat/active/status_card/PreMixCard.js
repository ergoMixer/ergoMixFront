import React from 'react';
import ProjectModal from "../../../../components/modal/modal";
import MoreDetail from "./MoreDetail";
import CardHeaderTitle from "./details/CardHeaderTitle";
import CardFooter from "./details/CardFooter";

class PreMixCard extends React.Component {
    state = {
        depositCopied: false,
        showDetail: false,
    };

    showDetails = () => {
        this.setState({showDetail: true})
    }

    hideDetails = () => {
        this.setState({showDetail: false})
    }

    render() {
        const progressValue = 100 * this.props.doneDeposit / this.props.amount;
        return (
            <div className="col-12 col-md-6">
                <ProjectModal close={this.hideDetails} show={this.state.showDetail}>
                    <MoreDetail {...this.props}/>
                </ProjectModal>

                <div className="card card-stats">
                    <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">compare_arrows</i>
                        </div>
                        <CardHeaderTitle {...this.props}/>
                    </div>
                    <div className="card-body statistic-card text-left">
                        <div>Creating Mix Boxes...</div>
                        <CardFooter {...this.props} showDetails={this.showDetails}/>
                    </div>
                </div>
            </div>
        )
    };
}

export default PreMixCard;

