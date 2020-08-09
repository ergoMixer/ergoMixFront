import React from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import * as formatter from '../../../../formatter/formatters'


class MoreDetail extends React.Component {
    state = {
        depositCopied: false,
        idCopied: false,
    };

    copyDeposit = copyFunction => {
        copyFunction(this.props.deposit);
        this.setState({depositCopied: true});
        setTimeout(() => {
            this.setState({depositCopied: false})
        }, 5000);
    }
    copyId = copyFunction => {
        copyFunction(this.props.id);
        this.setState({idCopied: true});
        setTimeout(() => {
            this.setState({idCopied: false})
        }, 5000);
    }

    render() {
        return (
            <React.Fragment>
                <div>id: &nbsp;
                    <b>
                        <CopyToClipboard
                            render={({copy}) => (
                                <span onClick={() => this.copyId(copy)}>
                                        {this.props.id}{this.state.idCopied ? (
                                    <span className="text-success">
                                                &nbsp;&nbsp;<i className="fa fa-check"/>Copied
                                            </span>
                                ) : null}
                                    </span>
                            )}
                        />
                    </b>
                </div>
                <hr/>
                <div>Deposit Address : &nbsp;<b><CopyToClipboard
                    render={({copy}) => (
                        <span onClick={() => this.copyDeposit(copy)}>
                                {this.props.deposit}{this.state.depositCopied ? (
                            <span className="text-success">
                                                &nbsp;&nbsp;<i className="fa fa-check"/>Copied
                                            </span>
                        ) : null}
                            </span>
                    )}
                /></b></div>
                <hr/>
                <div>create date: <b>{this.props.createdDate}</b></div>
                <hr/>
                <div>Total amount: <b>{formatter.erg(this.props.amount)}</b></div>
            </React.Fragment>
        )
    };
}

export default MoreDetail;

