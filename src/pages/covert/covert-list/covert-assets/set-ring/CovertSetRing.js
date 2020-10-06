import React from 'react';
import MixRing from "../../../../../components/mix-ring/MixRing";
import { connect } from "react-redux";
import withLayout from "../../../../../hoc/with_layout/withLayout";
import MainLayout from "../../../../../layout/main-layout/MainLayout";
import { CUSTOM_TOKEN } from "../../../../../const";
import Breadcrumb from "../../../../../components/broadcom/Breadcrumb";
import * as formatter from "../../../../../formatter/formatters";
import { ApiNetwork } from "../../../../../network/api";

class CovertSetRing extends React.Component {
    state = {
        selected: 0,
        loading: false,
    }
    componentDidMount() {
        this.setState({selected: parseInt(this.props.match.params.oldRing)});
    }

    breadcrumbPath = () => {
        if(!this.props.covertLoaded){
            ApiNetwork.covertList();
        }
        const address = this.props.covertMap[this.props.match.params.covertId];
        return [
            {url: '/covert', title: "Covert Address"},
            {url: '/covert/' + this.props.match.params.covertId + '/asset', title: address},
            {title: formatter.tokenName(this.props.match.params.assetId ? this.props.match.params.assetId : '', true)}
        ]
    }

    saveRing = () => {
        this.setState({loading: true})
        ApiNetwork.covertAssetSet(
            this.props.match.params.covertId,
            this.props.match.params.assetId ? this.props.match.params.assetId : '',
            this.state.selected
        ).then(data => {
            this.props.history.push('/covert/' + this.props.match.params.covertId + '/asset')
        }).catch(exp => {
            this.setState({loading: false});
        });
    }

    render() {
        let token = CUSTOM_TOKEN;
        const tokenId = this.props.match.params.assetId ? this.props.match.params.assetId : '';
        this.props.tokens.forEach(item => {
            if (tokenId === item.id && item.type !== 'custom') {
                token = item
            }
        });
        return (
            <React.Fragment>
                <Breadcrumb path={this.breadcrumbPath()}/>
                <div className="row non-selectable mt-4">
                    {token.rings.map((ring, index) => (
                        <MixRing
                            key={index}
                            amount={ring}
                            tokenId={tokenId}
                        >
                            {this.state.selected === ring ? (
                                <button className="btn btn-primary">Selected</button>
                            ) : (
                                <button className="btn btn-outline-primary"
                                        onClick={() => this.setState({selected: ring})}>Use This Ring</button>
                            )}

                        </MixRing>
                    ))}
                </div>
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-success float-right" onClick={this.saveRing}>
                            Save
                            &nbsp;&nbsp;
                            {this.state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    tokens: state.tokens,
    covertMap: state.covertMap,
    covertLoaded: state.covertLoaded
});

export default withLayout(MainLayout)(connect(mapStateToProps)(CovertSetRing));