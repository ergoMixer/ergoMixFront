import React from 'react';
import { ApiNetwork } from "../../network/api";
import { NotificationManager } from "react-notifications";
import * as formatter from "../../formatter/formatters";

class LoadFromNode extends React.Component {
    state = {
        focus: '',
        nodeAddress: '',
        nodeApiKey: '',
        count: '',
    }

    isLoadingEnabled = () => {
        let count = this.props.count;
        if(this.props.manualCount){
            count = this.state.count
        }
        if(count && this.state.nodeAddress && this.state.nodeApiKey){
            return true;
        }
        return false;
    }

    loadAddressFromNode = () => {
        if(!this.isLoadingEnabled()){
            return;
        }
        let count = this.props.count;
        if(this.props.manualCount){
            count = this.state.count
        }
        this.setState({loadingNode: true});
        ApiNetwork.getNodeAddress(this.state.nodeAddress, this.state.nodeApiKey, count).then(response => {
            this.setState({loadingNode: false});
            this.props.setAddress(response.data);
        }).catch(error => {
            this.setState({loadingNode: false});
            NotificationManager.error(formatter.errorMessage(error), 'Network problem!', 5000);
        })
    };

    render() {
        const loadingEnabled = this.isLoadingEnabled();
        const elementRowClass = this.props.manualCount ? "col-md-4 col-xs-12" : "col-md-6 col-xs-12";
        return (
            <React.Fragment>
                <div className="col-12 pb-2">
                    Connect to a node to import your desired number of addresses automatically.
                    This information will be used just now and for this specific purpose.
                </div>
                <div className={elementRowClass}>
                    <div className={"form-group bmd-form-group " +
                    (this.state.focus === "nodeAddress" ? "is-focused" : "") +
                    ((this.state.nodeAddress && this.state.focus !== "nodeAddress") ? "is-filled" : "")}>
                        <label htmlFor="nodeAddress" className="bmd-label-floating">Node Address
                            (http://127.0.0.1:9053)</label>
                        <input type="text"
                               className="form-control"
                               value={this.state.nodeAddress}
                               onChange={event => {
                                   this.setState({nodeAddress: event.target.value})
                               }}
                               onFocus={() => this.setState({focus: "node address"})}
                               onBlur={() => this.setState({focus: ""})}
                               id="nodeAddress"/>
                    </div>
                </div>
                <div className={elementRowClass}>
                    <div className={"form-group bmd-form-group " +
                    (this.state.focus === "nodeApiKey" ? "is-focused" : "") +
                    ((this.state.nodeApiKey && this.state.focus !== "nodeApiKey") ? "is-filled" : "")}>
                        <label htmlFor="nodeApiKey" className="bmd-label-floating">Node Api Key</label>
                        <input type="text"
                               className="form-control"
                               value={this.state.nodeApiKey}
                               onChange={event => {
                                   this.setState({nodeApiKey: event.target.value})
                               }}
                               onFocus={() => this.setState({focus: "nodeApiKey"})}
                               onBlur={() => this.setState({focus: ""})}
                               id="nodeApiKey"/>
                    </div>
                </div>
                <div className={elementRowClass}>
                    <div className={"form-group bmd-form-group " +
                    (this.state.focus === "count" ? "is-focused" : "") +
                    ((this.state.count !== "" && this.state.focus !== "count") ? "is-filled" : "")}>
                        <label htmlFor="nodeApiKey" className="bmd-label-floating">Count</label>
                        <input type="text"
                               className="form-control"
                               value={this.state.count}
                               onChange={event => {
                                   this.setState({count: event.target.value})
                               }}
                               onFocus={() => this.setState({focus: "count"})}
                               onBlur={() => this.setState({focus: ""})}
                               id="Count"/>
                    </div>
                </div>
                <div className="col-md-12 text-center">
                    <button onClick={this.loadAddressFromNode}
                            disabled={!loadingEnabled}
                            style={loadingEnabled ? {}: {cursor: 'not-allowed'}}
                            className={"btn " + (loadingEnabled ? "btn-outline-primary" : "btn-outline")}>
                        {this.state.loadingNode ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                        {this.state.loadingNode ? " " : null}
                        Load addresses
                    </button>
                </div>
            </React.Fragment>
        )
    }
}

export default LoadFromNode;