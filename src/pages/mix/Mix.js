import React from 'react';
import MultiStep from "../../components/multistep/MultiStep";
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../network/api";
import Step1 from "./step1/Step1";
import Step2 from "./step2/Step2";
import Step3 from "./step3/Step3";
import Step4 from "./step4/Step4";
import { connect } from "react-redux";
import Loading from "../../components/loading/Loading";


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
                this.props.history.push("/mix/active")
            }).catch(exp => {
                reject(exp);
            })
        });
    };

    saveValue = (values) => {
        this.setState(state => {
            return {...state, values: {...state.values, ...values}}
        });
    };

    getSteps = () => {
        return [
            {
                title: "Number of Erg/Tokens to mix",
                component: Step1,
                useCard: false,
                props: {
                    saveValue: this.saveValue,
                    mix: this.state.values.mix,
                    amount: this.state.values.amount,
                    token: this.state.values.token
                }
            },
            {
                title: "Select rings",
                component: Step2,
                props: {
                    total: this.state.values.amount,
                    boxes: this.state.values.boxes,
                    token: this.state.values.token,
                    saveValue: this.saveValue
                },
                useCard: false
            },
            {
                title: "set withdraw addresses",
                component: Step3,
                props: {
                    boxes: this.state.values.boxes,
                    filling: this.state.values.filling,
                    addresses: this.state.values.addresses,
                    saveValue: this.saveValue,
                    token: this.state.values.token,
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
        return (
            <Loading empty={false} loaded={loaded} emptyMessage={[]}>
                <MultiStep
                    steps={this.getSteps()}
                    submit={this.submit}
                    submitTitle="Start Mixing"
                    values={this.state.values}/>
                <div className="clearfix"/>
            </Loading>
        )
    };
}

const mapStateToProps = state => ({
    loadedData: state.loadedData,
    tokens: state.tokens
});

export default withLayout(MainLayout)(connect(mapStateToProps)(Mix));
