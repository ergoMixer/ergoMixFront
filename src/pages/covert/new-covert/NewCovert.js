import React from 'react';
import withLayout from "../../../hoc/with_layout/withLayout";
import MainLayout from "../../../layout/main-layout/MainLayout";
import { connect } from "react-redux";
import { ApiNetwork } from "../../../network/api";
import MultiStep from "../../../components/multistep/MultiStep";
import CovertStep1 from "./covert-step-1/CovertStep1";
import CovertStep2 from "./covert-step-2/CovertStep2";
import CovertStep3 from "./covert-step-3/CovertStep3";
import Loading from "../../../components/loading/Loading";
import { useNavigate } from "react-router-dom";

export const NewCovert = (props) => {
    const [state, setState] = React.useState({
        values: {
            addresses: [],
            level: 2,
            fillingType: 'later',
        }
    });

    const saveValue = (values) => {
        setState({...state, values: {...state.values, ...values}});
    };

    const getSteps = () => {
        return [
            {
                title: "Name / Import Keys",
                component: CovertStep1,
                useCard: false,
                props: {
                    saveValue: saveValue,
                    level: state.values.level,
                }
            },
            {
                title: "Number of mixing round",
                component: CovertStep2,
                useCard: false,
                props: {
                    saveValue: saveValue,
                    level: state.values.level,
                }
            },
            {
                title: "Withdrawal addresses",
                component: CovertStep3,
                props: {
                    addresses: state.values.addresses,
                    saveValue: saveValue,
                    fillingType: state.values.fillingType,
                },
                useCard: false
            },
        ];
    }

    const submit = (navigate) => {
        return new Promise((resolve, reject) => {
            const values = state.values;
            const request = {
                addresses: values.addresses ? values.addresses : [],
                numRounds: props.levels[values.level].token,
                privateKey: values.pk, nameCovert: values.name
            }
            ApiNetwork.covertRequest(request).then(response => {
                resolve();
                navigate("/covert");
            }).catch(exp => {
                reject(exp);
            })
        });
    }

    let loaded = true;
    const navigate = useNavigate();
    Object.keys(props.loadedData).forEach(key => {
        if (!props.loadedData[key])
            loaded = false;
    })
    return (
        <Loading empty={false} loadingMessage={[]} loaded={loaded}>
            <MultiStep
                steps={getSteps()}
                submit={() => submit(navigate)}
                submitTitle="Create Covert Address"
                values={state.values}/>
            <div className="clearfix"/>
        </Loading>
    )
}

const mapStateToProps = state => ({
    loadedData: state.loadedData,
    tokens: state.tokens,
    levels: state.mixLevel,
});

export default withLayout(MainLayout)(connect(mapStateToProps)(NewCovert));
