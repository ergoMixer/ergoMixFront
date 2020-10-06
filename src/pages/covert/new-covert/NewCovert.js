import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { connect } from "react-redux";
import Panel from "../../../components/panel/Panel";
import { ApiNetwork } from "../../../network/api";
import MultiStep from "../../../components/multistep/MultiStep";
import CovertStep1 from "./covert-step-1/CovertStep1";
import CovertStep2 from "./covert-step-2/CovertStep2";
import Loading from "../../../components/loading/Loading";

class NewCovert extends React.Component {
    state = {
        values: {
            addresses: [],
            level: 2,
            fillingType: 'later',
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
                title: "Number of mixing round",
                component: CovertStep1,
                useCard: false,
                props: {
                    saveValue: this.saveValue,
                    level: this.state.values.level,
                }
            },
            {
                title: "Enter withdrawal addresses",
                component: CovertStep2,
                props: {
                    addresses: this.state.values.addresses,
                    saveValue: this.saveValue,
                    fillingType: this.state.values.fillingType,
                },
                useCard: false
            },
        ];
    }

    submit = () => {
        return new Promise((resolve, reject) => {
            const values = this.state.values;
            const request = {
                addresses: values.addresses ? values.addresses : [],
                numRounds: this.props.levels[values.level].token,
            }
            ApiNetwork.covertRequest(request).then(response => {
                resolve();
                this.props.history.push("/covert")
            }).catch(exp => {
                reject(exp);
            })
        });
    }

    render() {
        let loaded = true;
        Object.keys(this.props.loadedData).forEach(key => {
            if (!this.props.loadedData[key])
                loaded = false;
        })
        return (
            <Loading empty={false} loadingMessage={[]} loaded={loaded}>
                <MultiStep
                    steps={this.getSteps()}
                    submit={this.submit}
                    submitTitle="Create Covert Address"
                    values={this.state.values}/>
                <div className="clearfix"/>
            </Loading>
        )
    }
}

const mapStateToProps = state => ({
    loadedData: state.loadedData,
    tokens: state.tokens,
    levels: state.mixLevel,
});

export default withLayout(MainLayout)(connect(mapStateToProps)(NewCovert));
