import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import CopyClipboard from "../../copy-clipboard/CopyClipboard";


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
            <div>{this.props.label}:&nbsp;
                <b>
                    <CopyClipboard value={this.props.content}/>
                </b>
            </div>
        )
    };
}

export default CopyRow;

