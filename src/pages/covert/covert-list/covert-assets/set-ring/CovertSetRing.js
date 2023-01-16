import React from 'react';
import MixRing from "../../../../../components/mix-ring/MixRing";
import { connect } from "react-redux";
import withLayout from "../../../../../hoc/with_layout/withLayout";
import MainLayout from "../../../../../layout/main-layout/MainLayout";
import { CUSTOM_TOKEN } from "../../../../../const";
import Breadcrumb from "../../../../../components/broadcom/Breadcrumb";
import * as formatter from "../../../../../formatter/formatters";
import { ApiNetwork } from "../../../../../network/api";
import { useNavigate, useParams } from "react-router-dom";

export const CovertSetRing = (props) => {
    const navigate = useNavigate();
    const { oldRing, assetId, covertId } = useParams();
    const [state, setState] = React.useState({
        selected: 0,
        loading: false,
    });

    React.useEffect(() => {
        setState({...state, selected: parseInt(oldRing)});
    }, [])

    const breadcrumbPath = () => {
        if(!props.covertLoaded){
            ApiNetwork.covertList();
        }
        const address = props.covertMap[covertId];
        return [
            {url: '/covert', title: "Covert Address"},
            {url: '/covert/' + covertId + '/asset', title: address},
            {title: formatter.tokenName(assetId ? assetId : '', true)}
        ]
    }

    const saveRing = () => {
        setState({ ...state, loading: true})
        ApiNetwork.covertAssetSet(
            covertId,
            assetId ? assetId : '',
            state.selected
        ).then(data => {
            navigate(`/covert/${covertId}/asset`)
        }).catch(exp => {
            setState({ ...state, loading: false});
        });
    }

    let token = CUSTOM_TOKEN;
    const tokenId = assetId ? assetId : '';
    props.tokens.forEach(item => {
        if (tokenId === item.id && item.type !== 'custom') {
            token = item
        }
    });
    return (
        <React.Fragment>
            <Breadcrumb path={breadcrumbPath()}/>
            <div className="row non-selectable mt-4">
                {token.rings.map((ring, index) => (
                    <MixRing
                        key={index}
                        amount={ring}
                        tokenId={tokenId}
                    >
                        {state.selected === ring ? (
                            <button className="btn btn-primary">Selected</button>
                        ) : (
                            <button className="btn btn-outline-primary"
                                    onClick={() => setState({ ...state, selected: ring })}>Use This Ring</button>
                        )}

                    </MixRing>
                ))}
            </div>
            <div className="row">
                <div className="col-12">
                    <button className="btn btn-success float-right" onClick={saveRing}>
                        Save
                        &nbsp;&nbsp;
                        {state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    tokens: state.tokens,
    covertMap: state.covertMap,
    covertLoaded: state.covertLoaded
});

export default withLayout(MainLayout)(connect(mapStateToProps)(CovertSetRing));