import React from 'react';
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import { connect } from "react-redux";
import Step1 from "./covert-step1/CovertStep1";
import Step2 from "./covert-step2/CovertStep2";
import Step4 from "./covert-step3/CovertStep3";
import MultiStep from "../../components/multistep/MultiStep";
import Panel from "../../components/panel/Panel";

class Covert extends React.Component {
    state = {
        values: {
            mix: "",
            ring: "",
            level: 2,
        }
    };

    saveValue = (values) => {
        this.setState(state => {
            return {...state, values: {...state.values, ...values}}
        });
    };

    getSteps = () => {
        return [
            {
                title: "What Your Address Accept",
                component: Step1,
                useCard: false,
                props: {
                    saveValue: this.saveValue,
                    mix: this.state.values.mix,
                    token: this.state.values.token
                }
            },
            {
                title: "Select rings",
                component: Step2,
                props: {
                    ring: this.state.values.ring,
                    token: this.state.values.token,
                    saveValue: this.saveValue
                },
                useCard: false
            },
            {
                title: "review and start",
                component: Step4,
                props: {
                    addresses: this.state.values.addresses,
                    selectedLevel: this.state.values.selectedLevel,
                    token: this.state.values.token,
                    saveValue: this.saveValue,
                },
                useCard: false
            }
        ];
    }

    render() {
        let loaded = true;
        Object.keys(this.props.loadedData).forEach(key => {
            if (!this.props.loadedData[key])
                loaded = false;
        })
        if (loaded) {
            return (
                <div>
                    <MultiStep
                        steps={this.getSteps()}
                        submit={this.submit}
                        submitTitle="Start Mixing"
                        values={this.state.values}/>
                    <div className="clearfix"/>
                </div>
            )
        }
        return (
            <Panel>
                <h3 className="text-danger text-center">
                    Loading data from ERGO blockchain
                </h3>
                <h3 className="text-center text-danger">
                    Please wait <i className="fa fa-circle-o-notch fa-spin"/>
                </h3>
            </Panel>
        )
    }
}

const mapStateToProps = state => ({
    loadedData: state.loadedData,
    tokens: state.tokens
});

export default withLayout(MainLayout)(connect(mapStateToProps)(Covert));
