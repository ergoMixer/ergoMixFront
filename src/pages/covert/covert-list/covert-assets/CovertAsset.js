import React from 'react';
import withLayout from "../../../../hoc/with_layout/withLayout";
import MainLayout from "../../../../layout/main-layout/MainLayout";
import Breadcrumb from "../../../../components/broadcom/Breadcrumb";
import Loading from "../../../../components/loading/Loading";
import { ApiNetwork } from "../../../../network/api";
import AssetProgressSelect from "./asset-progress/AssetProgressSelect";
import AddAsset from "./AddAsset";
import { TextField } from "@material-ui/core";
import ProjectModal from "../../../../components/modal/modal";
import { NotificationManager } from "react-notifications";
import * as formatter from "../../../../formatter/formatters";

class CovertAsset extends React.Component {
    state = {
        assets: [],
        loaded: false,
        loading: false,
        covertId: null,
        address: '',
        isEditing: false,
        showWithdraw: false,
        selectedTokenId: '',
        depositAddress: ''
    }

    closeModal = () => {
        this.setState({showWithdraw: false, isEditing: false, depositAddress: '', selectedTokenId: ''})
    }

    handleWithdraw = () => {
        this.setState({isEditing: true})
        return null
    }

    handleAddress = (e) => {
        this.setState({depositAddress: e.target.value});
    }

    withdrawAsset = () => {
        ApiNetwork.withdrawCovertAsset(
            this.state.covertId,
            [this.state.selectedTokenId],
            this.state.depositAddress
        ).then(() => {
            NotificationManager.success('Withdraw Was Successful', 'Success');
        }).catch(
            error => {
                NotificationManager.error(formatter.errorMessage(error), 'Update Exception!', 5000);
            }
        );
        this.closeModal();
    }

    loadAssets = () => {
        if (this.state.loading) {
            return
        }
        if (this.state.covertId !== this.props.match.params.covertId) {
            this.setState({loading: true})
            ApiNetwork.covertAsset(this.props.match.params.covertId).then(response => {
                this.setState({
                    loaded: true,
                    loading: false,
                    covertId: this.props.match.params.covertId,
                    assets: response.data.assets,
                    address: response.data.deposit
                });
            }).catch(error => {
                this.setState({
                    loaded: true,
                    loading: false,
                    covertId: this.props.match.params.covertId,
                    assets: []
                });
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.loadAssets();
    }

    componentDidMount() {
        this.loadAssets();
    }

    breadcrumbPath = () => [
        {url: '/covert', title: "Covert Address"},
        {title: this.state.address ? this.state.address : this.props.match.params.covertId}
    ]

    render() {
        const currentAssetIds = new Set(this.state.assets.map(item => item.tokenId));
        return (
            <React.Fragment>
                {/*<div className={"row"}>*/}
                <Breadcrumb path={this.breadcrumbPath()}/>
                <Loading empty={this.state.assets.length === 0}
                         loaded={this.state.loaded}
                         emptyMessage={["There are no asset for this address"]}
                >
                    <ProjectModal close={this.closeModal} show={this.state.isEditing} scroll={'hidden'}>
                        <div className="row">
                            <div className="col-12">
                                <TextField
                                    label="Withdraw Address"
                                    onChange={this.handleAddress}
                                    error={this.state.depositAddress === ''}
                                    value={this.state.depositAddress}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button className="btn" onClick={this.closeModal}>Close</button>
                                <button
                                    className="btn btn-success"
                                    disabled={this.state.depositAddress === ''}
                                    onClick={this.withdrawAsset}>
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </ProjectModal>
                    <div className="row">
                        {this.state.assets.map((item, index) => (
                            <AssetProgressSelect {...item} key={index} covertId={this.props.match.params.covertId} withdraw={(id)=>this.setState(
                                {selectedTokenId:id},this.handleWithdraw)}/>
                        ))}
                        <AddAsset covertId={this.props.match.params.covertId} currentTokens={currentAssetIds}/>
                    </div>
                </Loading>
                {/*</div>*/}
            </React.Fragment>
        )
    }
}

export default withLayout(MainLayout)(CovertAsset);