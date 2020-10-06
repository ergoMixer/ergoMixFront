import React from 'react';
import Panel from "../panel/Panel";

const Loading = props => {
    if (props.loaded) {
        if (!props.empty) {
            return props.children
        } else {
            return (
                <div className="row">
                    <div className="col-12">
                        <Panel>
                            {props.emptyMessage.map((message, index) => (
                                <h3 className="text-center" key={index}>
                                    {message}
                                </h3>
                            ))}
                        </Panel>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div className="row">
                <div className="col-12">
                    <Panel>
                        <h3 className="text-danger text-center">
                            Loading data from ERGO blockchain
                        </h3>
                        <h3 className="text-center text-danger">
                            Please wait <i className="fa fa-circle-o-notch fa-spin"/>
                        </h3>
                    </Panel>
                </div>
            </div>
        )
    }
};

export default Loading;