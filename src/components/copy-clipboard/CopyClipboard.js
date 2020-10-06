import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";

class CopyClipboard extends React.Component {
    state = {
        copied: false
    }

    copyDeposit = copyFunction => {
        copyFunction(this.props.value);
        this.setState({copied: true});
        setTimeout(() => {
            this.setState({copied: false})
        }, 5000);
    }

    render() {
        return (
            <CopyToClipboard
                render={({copy}) => (
                    <div onClick={() => this.copyDeposit(copy)}>
                        {this.props.display ? this.props.display : this.props.value}
                        {this.state.copied ? (
                            <span className="text-success">
                                    &nbsp;&nbsp;
                                <i className="fa fa-check"/>Copied
                            </span>
                    ) : null}
                    </div>
                )}
            />

        )
    }
}

export default CopyClipboard;