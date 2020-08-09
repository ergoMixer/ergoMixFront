import React from 'react';
import { connect } from "react-redux";
import MainLayout from "../../layout/main-layout/MainLayout";
import withLayout from '../../hoc/with_layout/withLayout';
import MixRing from "../../components/mix-ring/MixRing";
import Panel from "../../components/panel/Panel";

class Step2 extends React.Component {
    state = {
        boxes: [],
        selected: '',
    };

    render() {
        const tokens = this.props.tokens.filter(item => item.type !== 'custom')
        return (
            <React.Fragment>
                <div className="non-selectable">
                    {tokens.map((token, index) => (
                        <React.Fragment key={token.id + index}>
                            <div className="row">
                                <div className="col-12">
                                    <Panel cardClass="pointer" onClick={() => this.setState({selected: token.id})}>
                                        {token.name}
                                        {this.state.selected === token.id ? (
                                            <i className="fa fa-angle-left float-right arrow"/>
                                        ) : (
                                            <i className="fa fa-angle-down float-right arrow"/>
                                        )}
                                    </Panel>
                                </div>
                            </div>
                            {this.state.selected === token.id ? (
                                <div className="row non-selectable">
                                    {token.rings.map((item, index) => (
                                        <MixRing tokenId={token.id} amount={item} key={index}>
                                        </MixRing>
                                    ))}
                                </div>
                            ) : null}
                        </React.Fragment>
                    ))}
                </div>
            </React.Fragment>
        )
    };
}

const mapStateToProps = state => ({
    rings: state.rings,
    tokens: state.tokens,
});


export default withLayout(MainLayout)(connect(mapStateToProps)(Step2));
