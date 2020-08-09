import React from 'react';
import Slider from '@material-ui/core/Slider';

function valuetext(value) {
    return `${value}°C`;
}

function valueLabelFormat(value) {
    return marks.findIndex((mark) => mark.value === value) + 1;
}

const marks = [
    {
        value: 0,
        label: '0°C',
    },
    {
        value: 1,
        label: '20°C',
    },
    {
        value: 2,
        label: '37°C',
    },
    {
        value: 3,
        label: '100°C',
    },
];

class Step1 extends React.Component {
    state = {
        focused: "",
        amount: "",
        validation: {
            amount: "",
        }
    };

    componentDidMount() {
        let amount = parseInt(this.props.amount/1e9);
        if(!amount) amount = '';
        this.setState({
            amount: amount,
        })
    }

    saveValues = (key, value) => {
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
                [key]: value,
                validation: {
                    ...state.validation,
                    [key]: validation
                }
            };
            if (this.props.saveValue) {
                this.props.saveValue('amount', 1e9 * res.amount);
            }
            return res
        });
        this.props.setValid(validation === '');
    };

    validateNumber = value => {
        const reg = /^[0-9]*$/;
        if (reg.test(String(value).toLowerCase())) {
            return true;
        } else {
            return "is not a valid number";
        }
    };

    render() {
        let amountInputClass = "form-group bmd-form-group";
        if (this.state.focused === "amount") amountInputClass += " is-focused";
        if (this.state.amount) amountInputClass += " is-filled";
        let mixInputClass = "form-group bmd-form-group";
        if (this.state.focused === "mix") mixInputClass += " is-focused";
        return (
            <div className="row">
                <div className="col-12">
                    <div className={amountInputClass}>
                        <label className="bmd-label-floating">Number of Ergs</label>
                        <input
                            autoFocus
                            type="text"
                            className="form-control"
                            value={this.state.amount}
                            onChange={event => {
                                this.saveValues("amount", event.target.value)
                            }}
                            onFocus={() => this.setState({focused: "amount"})}
                            onBlur={() => this.setState({focused: ""})}
                        />
                        <label className="error">{this.state.validation.amount}</label>
                    </div>
                </div>
            </div>
        )
    };
}

export default Step1;
