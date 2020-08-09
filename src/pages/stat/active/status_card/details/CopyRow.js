import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";


class CopyRow extends React.Component {
    state = {
        copied: false
    }

    copyContent = copyFunction => {
        copyFunction(this.props.content);
        this.setState({copied: true});
        setTimeout(() => {
            this.setState({copied: false})
        }, 5000);
    }

    render = () => {
        return (
            <div>{this.props.label}:&nbsp;<b><CopyToClipboard
                render={({copy}) => (
                    <span onClick={() => this.copyContent(copy)}>
                        {this.props.content}{this.state.copied ? (
                            <span className="text-success">
                                &nbsp;&nbsp;<i className="fa fa-check"/>Copied
                            </span>
                        ) : null}
                    </span>
                )}
            /></b></div>
        )
    };
}

export default CopyRow;

