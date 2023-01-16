import React from 'react';
import { TextField } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import { connect } from "react-redux";
import Panel from "../../../../components/panel/Panel";
import { COVERT_NAME_SIZE } from "../../../../const";
import FormControlLabel from '@mui/material/FormControlLabel';

class CovertStep1 extends React.Component {
    state = {
        name: "",
        pk: "",
        needPK: false,
        needPKConfirm: false,
        validation: {
            pk: ''
        }
    };

    componentDidMount() {
        this.setState(state => {
            return {
                ...state,
                name: this.props.name,
                pk: this.props.pk,
            }
        });
        this.setValid();
    }

    saveName = value => {
        if (value) {
            value = value.substr(0, COVERT_NAME_SIZE);
        }
        this.setState(state => {
            const res = {
                ...state,
                name: value,
            };
            if (this.props.saveValue) {
                this.props.saveValue({name: value});
            }
            return res
        });
    }

    savePK = value => {
        this.setState(state => {
            const res = {
                ...state,
                pk: value,
            };
            if (this.props.saveValue) {
                this.props.saveValue({pk: value});
            }
            return res
        });
    }

    setValid = () => {
        if (this.props.setValid) {
            this.props.setValid(true)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setValid();
    }

    handleNeedPK = event => {
        this.setState({needPK: event.target.checked});
    }

    handleNeedPKConfirm = event => {
        this.setState({needPKConfirm: event.target.checked});
    }

    render() {
        return (
            <div className="col-sm-8 offset-sm-2">
                <Panel>
                    <div className="row">
                        <div className="col-12">
                            Specify a name for this covert address for future reference.
                            This name is optional and can be edited anytime.
                        </div>
                        <div className="col-12 form-group">
                            <TextField
                                label="Name (optional)"
                                onBlur={event => this.saveName(this.state.name)}
                                onChange={event => this.saveName(event.target.value)}
                                value={this.state.name}
                                required={false}
                            />
                        </div>
                    </div>
                </Panel>
                <Panel>
                    <div className="row">
                        <div className="col-12">
                            Optionally, if you want to import an existing address
                            from other wallets and convert it to a covert address,
                            input its private key here.
                        </div>
                        <div className="col-12 form-group">
                            <FormControlLabel
                                control={<Checkbox
                                    checked={this.state.needPK}
                                    onChange={this.handleNeedPK}
                                    inputProps={{'aria-label': 'primary checkbox'}}
                                />}
                                label="I want to import an existing private key."
                            />
                        </div>
                        {this.state.needPK ? (
                            <div className="col-12 form-group">
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={this.state.needPKConfirm}
                                        onChange={this.handleNeedPKConfirm}
                                        inputProps={{'aria-label': 'primary checkbox'}}
                                    />}
                                    label="I know what I am doing."
                                />

                            </div>
                        ) : null}
                        {this.state.needPK && this.state.needPKConfirm ? (
                            <div className="col-12 form-group">
                                <TextField
                                    label="Private Key (optional)"
                                    onBlur={event => this.savePK(this.state.pk)}
                                    onChange={event => this.savePK(event.target.value)}
                                    value={this.state.pk}
                                    required={false}
                                    disabled={!this.state.needPK}
                                />
                                <span className="small">To import address from other wallets (magnum or ...)</span>
                            </div>
                        ) : null}
                    </div>
                </Panel>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    tokens: state.tokens
});

export default connect(mapStateToProps)(CovertStep1);
