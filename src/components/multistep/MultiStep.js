import React  from 'react';
import Step from './step/Step'
import { NotificationManager } from 'react-notifications';
import * as formatter from '../../formatter/formatters';
import Panel from "../panel/Panel";

class MultiStep extends React.Component {
    state = {
        step: 0,
        validated: -1,
        loading: false,
    };

    next = () => {
        this.gotoStep(this.state.step + 1);
    };

    saveValidate = (index) => {
        this.setState({
            validated: index
        })
    };

    prev = () => {
        this.gotoStep(this.state.step - 1);
    };

    gotoStep = stepId => {
        if (this.state.validated >= stepId - 1) {
            this.setState({step: stepId});
        }
    };

    setValid = isValid => {
        const validated = isValid ? this.state.step : this.state.step - 1;
        if(validated !== this.state.validated){
            this.setState({validated: validated})
        }
    }

    getStepContent = (step) => {
        const Component = step.component;
        return <Component {...step.props} setValid={this.setValid}/>
    };

    submit = () => {
        if (!this.state.loading) {
            this.setState({loading: true});
            this.props.submit().then(() => {
                this.setState({loading: false});
            }).catch(exp => {
                NotificationManager.error(formatter.errorMessage(exp), 'Submission Exception!', 5000);
                this.setState({loading: false});
            })
        }
    };

    render() {
        const step = this.props.steps[this.state.step];
        const stepContent = this.getStepContent(step);
        return (
            <div className="multi-step">
                <ul className="multi-step-bar">
                    {this.props.steps.map((item, index) => (
                        <Step
                            title={item.title}
                            active={index <= this.state.step}
                            key={index}
                            valid={this.state.validated >= index - 1}
                            setStep={() => this.gotoStep(index)}/>
                    ))}
                </ul>
                {step.useCard === false ? stepContent : (
                    <Panel>
                        {stepContent}
                    </Panel>
                )}
                <div className="action-bar">
                    {this.state.step === 0 ? null : <button className="btn btn-info" onClick={this.prev}>Prev.</button>}
                    {
                        this.state.step === this.props.steps.length - 1 ?
                            null :
                            <button className={"btn pull-right " + (this.state.validated >= this.state.step ? "btn-info": "btn-default")} onClick={this.next}>Next</button>
                    }
                    {
                        this.state.step === this.props.steps.length - 1 ?
                            (
                                <button className={"btn pull-right " + (this.state.validated >= this.state.step ? "btn-success": "btn-default")}
                                    onClick={() => this.submit()}>
                                    {this.props.submitTitle}
                                    &nbsp;&nbsp;
                                    {this.state.loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                                </button>
                            ) :
                            null
                    }
                </div>
            </div>
        )
    };
}

export default MultiStep;
