import React from 'react';
import { MenuItem, TextField } from "@mui/material";
import MaterialSelect from "../../../components/select/MaterialSelect";
import { connect } from "react-redux";
import Panel from "../../../components/panel/Panel";

class Step1 extends React.Component {
    state = {
        amount: "",
        tokenIndex: "",
        token: {},
        validation: {
            amount: "This Field is required",
            token: "",
        },
        focused: {
            amount: false,
            token: false,
        }
    };

    componentDidMount() {
        let tokenIndex = '';
        if (this.props.token) {
            this.props.tokens.forEach((token, index) => {
                if(this.props.token.type === token.type){
                    if(token.type === 'custom' || this.props.token.id === token.id){
                        tokenIndex = index;
                    }
                }
            });
        }
        let amount = ''
        if (this.props.token) {
            amount = parseInt(this.props.amount / Math.pow(10, this.props.token.decimals));
        }
        if (!amount) amount = '';
        this.setState(state => {
            return {
                ...state,
                amount: amount,
                tokenIndex: tokenIndex,
                token: this.props.token,
                validation: {
                    ...state.validation,
                    amount: this.validateAmount(amount),
                }
            }
        });
        this.setValid();
    }

    validateAmount = value => {
        let validation = "";
        if (value === "") {
            validation = " is required";
        } else {
            validation = this.validateNumber(value);
            if (validation === true) {
                validation = "";
            }
        }
        return validation
    }

    saveAmount = value => {
        let validation = "";
        if (value === "") {
            validation = " is required";
        } else {
            validation = this.validateNumber(value);
            if (validation === true) {
                validation = "";
            }
        }
        this.setState(state => {
            const res = {
                ...state,
                amount: value,
                validation: {
                    ...state.validation,
                    amount: validation
                },
                focused: {
                    ...state.focused,
                    amount: true
                }
            };
            if (this.props.saveValue) {
                this.props.saveValue({amount: Math.pow(10, this.state.token.decimals) * res.amount});
            }
            return res
        });
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
            validation = " is required";
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

    validateNumber = value => {
        const reg = /^[0-9]*(.[0-9]+)?$/;
        if (reg.test(String(value).toLowerCase())) {
            return true;
        } else {
            return "is not a valid number";
        }
    };

    setValid = () => {
        if (this.props.setValid) {
            this.props.setValid(this.state.validation.amount === '' && this.state.validation.token === '')
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setValid();
    }

    render() {
        return (
            <div className="col-sm-8 offset-sm-2">
                <Panel>
                    <div className="row">
                        <div
                            className={"col-12 mb-6 " + (this.state.token && (this.state.token.type === "custom" || this.state.token.id !== '') ? 'col-sm-4' : '')}>
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
                                {this.props.tokens.map((tokenItem, index) => {
                                    return <MenuItem value={index} key={index}>{tokenItem.name}</MenuItem>
                                })}
                            </MaterialSelect>
                        </div>
                        {this.state.token && (this.state.token.type === "custom" || this.state.token.id !== '') ? (
                            <div className="col-12 col-md-8 form-group">
                                <TextField
                                    label="Token ID"
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
                    {this.state.token ? (
                        <div className="row">
                            <div className="col-12">
                                <TextField
                                    label={this.state.token.name + " Amount"}
                                    onBlur={event => this.saveAmount(this.state.amount)}
                                    onChange={event => this.saveAmount(event.target.value)}
                                    error={this.state.validation.amount !== '' && this.state.focused.amount}
                                    value={this.state.amount}
                                />
                                {this.state.validation.amount !== '' && this.state.focused.amount ? (
                                    <div className="text-danger text-sm">{this.state.validation.amount}</div>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </Panel>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    tokens: state.tokens
});

export default connect(mapStateToProps)(Step1);
