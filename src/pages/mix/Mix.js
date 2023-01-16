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
import { useNavigate } from "react-router-dom";

export const Mix = (props) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        values: {
            amount: "",
            mix: "",
            boxes: [],
            addresses: [],
            filling: "manual",
        }
    });

    const submit = () => {
        return new Promise((resolve, reject) => {
            ApiNetwork.mixRequest(state.values.addresses).then(response => {
                resolve();
                navigate("/mix/active")
            }).catch(exp => {
                reject(exp);
            })
        });
    };

    const saveValue = (values) => {
        setState({...state, values: {...state.values, ...values}});
    };

    const getSteps = () => {
        return [
            {
                title: "Number of Erg/Tokens to mix",
                component: Step1,
                useCard: false,
                props: {
                    saveValue: saveValue,
                    mix: state.values.mix,
                    amount: state.values.amount,
                    token: state.values.token
                }
            },
            {
                title: "Select rings",
                component: Step2,
                props: {
                    total: state.values.amount,
                    boxes: state.values.boxes,
                    token: state.values.token,
                    saveValue: saveValue
                },
                useCard: false
            },
            {
                title: "set withdraw addresses",
                component: Step3,
                props: {
                    boxes: state.values.boxes,
                    filling: state.values.filling,
                    addresses: state.values.addresses,
                    saveValue: saveValue,
                    token: state.values.token,
                },
                useCard: false
            },
            {
                title: "review and start",
                component: Step4,
                props: {
                    addresses: state.values.addresses,
                    selectedLevel: state.values.selectedLevel,
                    token: state.values.token,
                    saveValue: saveValue,
                },
                useCard: false
            }
        ];
    }

    let loaded = true;
    Object.keys(props.loadedData).forEach(key => {
        if (!props.loadedData[key])
            loaded = false;
    })
    return (
        <Loading empty={false} loaded={loaded} emptyMessage={[]}>
            <MultiStep
                steps={getSteps()}
                submit={submit}
                submitTitle="Start Mixing"
                values={state.values}/>
            <div className="clearfix"/>
        </Loading>
    )
}

const mapStateToProps = state => ({
    loadedData: state.loadedData,
    tokens: state.tokens
});

export default withLayout(MainLayout)(connect(mapStateToProps)(Mix));
