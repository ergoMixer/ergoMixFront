import React from 'react';
import MultiStep from "../../components/multistep/MultiStep";
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../network/api";
import Step1 from "./step1/Step1";
import Step2 from "./step2/Step2";
import Step3 from "./step3/Step3";
import Step4 from "./step4/Step4";

class Mix extends React.Component {
    state = {
        values: {
            amount: "",
            mix: "",
            boxes: [],
            addresses: [],
            filling: "manual",
        }
    };

    submit = () => {
        return new Promise((resolve, reject) => {
            ApiNetwork.mixRequest(this.state.values.addresses).then(response => {
                resolve();
                this.props.history.push("/stat/active")
            }).catch(exp => {
                reject(exp);
            })
        });
    };

    saveValue = (key, value) => {
        this.setState(state => {
            return {...state, values: {...state.values, [key]: value}}
        });
    };

    render() {
        const steps = [
            {
                title: "Number of Ergs to mix",
                component: Step1,
                props: {saveValue: this.saveValue, mix: this.state.values.mix, amount: this.state.values.amount}
            },
            {
                title: "Select rings",
                component: Step2,
                props: {total: this.state.values.amount, boxes: this.state.values.boxes, saveValue: this.saveValue},
                useCard: false
            },
            {
                title: "set withdraw addresses",
                component: Step3,
                props: {
                    boxes: this.state.values.boxes,
                    filling: this.state.values.filling,
                    addresses: this.state.values.addresses,
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
                    saveValue: this.saveValue
                },
                useCard: false
            }
        ];
        return (
            <div>
                <MultiStep
                    steps={steps}
                    submit={this.submit}
                    submitTitle="Start Mixing"
                    values={this.state.values}/>
            </div>
        )
    };
}

export default withLayout(MainLayout)(Mix);
