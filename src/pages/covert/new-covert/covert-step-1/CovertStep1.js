import React from 'react';
import { connect } from "react-redux";
import Panel from "../../../../components/panel/Panel";
import LevelSelect from "../../../../components/level-select/LevelSelect";

const CovertStep1 = props => {
    let loaded = true;
    Object.keys(props.loadedData).forEach(key => {
        if (!props.loadedData[key])
            loaded = false;
    })
    if (loaded) {
        props.setValid(true);
        return (
            <div className="row">
                <div className="col-12">
                    <Panel bodyClass="text-center">
                        <h4>
                            Specify your desired mixing level. The higher the mixing level, the more the mixing
                            rounds; note that the exact number of rounds cannot be guaranteed.
                        </h4>
                    </Panel>
                </div>
                <LevelSelect selectedLevel={props.level}
                             fullWidth={true}
                             select={(event, selected) => props.saveValue({level: selected})}/>
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
};

const mapStateToProps = state => ({
    loadedData: state.loadedData,
    tokens: state.tokens,
    levels: state.mixLevel,
});

export default connect(mapStateToProps)(CovertStep1);
