import React from 'react';
import withLayout from "../../../../hoc/with_layout/withLayout";
import MainLayout from "../../../../layout/main-layout/MainLayout";
import Breadcrumb from "../../../../components/broadcom/Breadcrumb";
import Loading from "../../../../components/loading/Loading";
import { ApiNetwork } from "../../../../network/api";
import AssetProgressSelect from "./asset-progress/AssetProgressSelect";
import AddAsset from "./AddAsset";

class CovertAsset extends React.Component {
    state = {
        assets: [],
        loaded: false,
        loading: false,
        covertId: null,
        address: ''
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
                    <div className="row">
                        {this.state.assets.map((item, index) => (
                            <AssetProgressSelect {...item} key={index} covertId={this.props.match.params.covertId}/>
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