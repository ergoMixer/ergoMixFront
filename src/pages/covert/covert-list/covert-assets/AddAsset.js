import React from 'react';
import MaterialSelect from "../../../../components/select/MaterialSelect";
import { MenuItem, TextField } from "@mui/material";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Add from "@mui/icons-material/Add";

export const AddAsset = (props) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        tokenIndex: "",
        token: {},
        validation: {
            token: "",
        },
        focused: {
            token: false,
        }

    });

    const saveToken = index => {
        const value = props.tokens[index];
        const newState = {
            ...state,
            tokenIndex: index,
            token: {...value},
        };
        if (value.type === 'custom') {
            newState.validation = {...newState.validation, token: 'This Field is required'}
        } else {
            newState.validation = {...newState.validation, token: ''}
        }
        if (props.saveValue) {
            if (state.validation.amount) {
                props.saveValue({token: value});
            } else {
                props.saveValue({amount: Math.pow(10, value.decimals) * newState.amount, token: value});
            }
        }
        setState(newState);
    }

    const saveTokenId = value => {
        let validation = "";
        if (value === "") {
            validation = "Required";
        }else if (props.currentTokens.has(value)){
            validation = "Already exists";
        }
        const newState = {
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
        if (props.saveValue) {
            props.saveValue({token: newState.token});
        }
        setState(newState);
    }

    const configureRing = () => {
        if(isValid()) {
            const ringUrl = '/covert/' + props.covertId + '/asset/' + (state.token.id ? state.token.id + '/ring/0' : 'ring/0');
            navigate(ringUrl);
        }
    }

    const isValid = () => {
        return (state.token.id || state.token.type === 'defined') && !props.currentTokens.has(state.token.id);
    }

    const haveTokenId = state.token && (state.token.type === "custom" || (state.token.id !== '' && state.token.id !== undefined));
    const tokens = props.tokens.map(item => {
        return {...item, enabled:(!props.currentTokens.has(item.id) || item.type === 'custom')}
    });
    const rowZeroPadding = state.validation.token !== '' && state.focused.token;
    return (
        <div className="col-12 col-md-6">
            <div className="card card-stats">
                <div className="card-header card-header-info card-header-icon">
                    <div className="card-icon">
                        <i className="material-icons"><Add /></i>
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
                                value={state.tokenIndex}
                                onChange={event => saveToken(event.target.value)}
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
                                    onBlur={event => saveTokenId(state.token.id)}
                                    onChange={event => saveTokenId(event.target.value)}
                                    error={state.validation.token !== '' && state.focused.token}
                                    disabled={state.token.type !== "custom"}
                                    value={state.token.id}
                                    required={state.token.type === "custom"}
                                    variant='filled'
                                />
                                {state.validation.token !== '' && state.focused.token ? (
                                    <div className="text-danger text-sm">{state.validation.token}</div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className={"btn pull-right " + (isValid() ? "btn-outline-primary": "btn-outline")} onClick={configureRing}>Configure Ring To Add Token</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

const mapStateToProps = state => ({
    tokens: state.tokens
});

// export default withRouter(connect(mapStateToProps)(AddAsset));
export default connect(mapStateToProps)(AddAsset);
