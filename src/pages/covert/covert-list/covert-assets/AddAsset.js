import React from 'react';
import MaterialSelect from "../../../../components/select/MaterialSelect";
import { MenuItem, TextField } from "@material-ui/core";
import { withRouter } from "react-router";
import { connect } from "react-redux";

class AddAsset extends React.Component {
    state = {
        tokenIndex: "",
        token: {},
        validation: {
            token: "",
        },
        focused: {
            token: false,
        }

    }

    saveToken = index => {
        const value = this.props.tokens[index];
        this.setState(state => {
            const res = {
                ...state,
                tokenIndex: index,
                token: {...value},
            };
            if (value.type === 'custom') {
                res.validation = {...res.validation, token: 'This Field is required'}
            } else {
                res.validation = {...res.validation, token: ''}
            }
            if (this.props.saveValue) {
                if (this.state.validation.amount) {
                    this.props.saveValue({token: value});
                } else {
                    this.props.saveValue({amount: Math.pow(10, value.decimals) * res.amount, token: value});
                }
            }
            return res;
        });
    }

    saveTokenId = value => {
        let validation = "";
        if (value === "") {
            validation = "Required";
        }else if (this.props.currentTokens.has(value)){
            validation = "Already exists";
        }
        this.setState(state => {
            const res = {
                ...state,
                token: {
                    ...state.token,
                    id: value
                },
                validation: {
                    ...state.validation,
                    token: validation,
                },
                focused: {
                    ...state.focused,
                    token: true
                }
            };
            if (this.props.saveValue) {
                this.props.saveValue({token: res.token});
            }
            return res
        });
    }

    configureRing = () => {
        if(this.isValid()) {
            const ringUrl = '/covert/' + this.props.covertId + '/asset/' + (this.state.token.id ? this.state.token.id + '/ring/0' : 'ring/0');
            this.props.history.push(ringUrl);
        }
    }

    isValid = () => {
        return (this.state.token.id || this.state.token.type === 'defined') && !this.props.currentTokens.has(this.state.token.id);
    }

    render = () => {
        const haveTokenId = this.state.token && (this.state.token.type === "custom" || (this.state.token.id !== '' && this.state.token.id !== undefined));
        const tokens = this.props.tokens.map(item => {
            return {...item, enabled:(!this.props.currentTokens.has(item.id) || item.type === 'custom')}
        });
        const rowZeroPadding = this.state.validation.token !== '' && this.state.focused.token;
        return (
            <div className="col-12 col-md-6">
                <div className="card card-stats">
                    <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">add</i>
                        </div>
                        <h3 className="card-title">
                            Add New
                        </h3>
                    </div>
                    <div className="card-body progress-card text-left" style={{paddingTop: '0'}}>
                        <div className="row">
                            <div
                                className={"col-12 mb-6 " + (haveTokenId ? 'col-sm-4' : '')}>
                                <MaterialSelect
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Token"
                                    value={this.state.tokenIndex}
                                    onChange={event => this.saveToken(event.target.value)}
                                >
                                    <MenuItem selected disabled value="">
                                        <em>Select Token</em>
                                    </MenuItem>
                                    {tokens.map((tokenItem, index) => <MenuItem value={index} disabled={!tokenItem.enabled} key={index}>{tokenItem.name}</MenuItem>)}
                                </MaterialSelect>
                            </div>
                            {haveTokenId ? (
                                <div className="col-12 col-md-8 form-group" style={rowZeroPadding ? {paddingBottom: '0'} : {}}>
                                    <TextField
                                        label={"Token ID"}
                                        onBlur={event => this.saveTokenId(this.state.token.id)}
                                        onChange={event => this.saveTokenId(event.target.value)}
                                        error={this.state.validation.token !== '' && this.state.focused.token}
                                        disabled={this.state.token.type !== "custom"}
                                        value={this.state.token.id}
                                        required={this.state.token.type === "custom"}
                                    />
                                    {this.state.validation.token !== '' && this.state.focused.token ? (
                                        <div className="text-danger text-sm">{this.state.validation.token}</div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button className={"btn pull-right " + (this.isValid() ? "btn-outline-primary": "btn-outline")} onClick={this.configureRing}>Configure Ring To Add Token</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    tokens: state.tokens
});

export default withRouter(connect(mapStateToProps)(AddAsset));
