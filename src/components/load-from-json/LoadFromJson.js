import React from 'react';

class LoadFromJson extends React.Component {
    state = {
        focus: '',
        inputJson: '',
        error: false,
    }

    loadAddress = () => {
        try {
            this.props.saveAddresses(JSON.parse(this.state.inputJson));
        }catch (e) {
            this.setState({error: true})
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className={"form-group bmd-form-group " +
                (this.state.focus === "inputJson" ? "is-focused" : "") +
                ((this.state.inputJson && this.state.focus !== "inputJson") ? "is-filled" : "")}>
                    <label htmlFor="inputJson" className="bmd-label-floating">Enter a list of addresses
                        to be used. ["addr1", "addr2",
                        ...]</label>
                    <textarea
                        className="form-control "
                        id="intpuJson"
                        value={this.state.inputJson}
                        onChange={event => {
                            this.setState({inputJson: event.target.value})
                        }}
                        onFocus={() => this.setState({focus: "inputJson"})}
                        onBlur={() => this.setState({focus: ""})}
                        rows={5}/>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <button onClick={this.loadAddress}
                                className="btn btn-outline-primary">Load From Json
                        </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default LoadFromJson;