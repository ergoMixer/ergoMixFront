import React from 'react';
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../network/api";
import * as formatter from '../../formatter/formatters'
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Panel from "../../components/panel/Panel";

class Stat extends React.Component {
    state = {
        mixGroup: [],
        loaded: false
    };

    componentWillMount() {
        ApiNetwork.mixRequestGroupCompleteList().then((response => {
            this.setState({mixGroup: response.data, loaded: true})
        })).catch(error => {

        })
    }

    render() {
        return (
            <div className={"row"}>
                <div className="col-12">
                    <Panel>
                        {(this.state.loaded && this.state.mixGroup.length) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className=" text-primary">
                                    <tr>
                                        <th>ID</th>
                                        <th>Amount</th>
                                        <th>Creation Date</th>
                                        <th>Deposit Address</th>
                                        <th>Status</th>
                                        <th/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.mixGroup.map((group, index) => (
                                        <tr key={index}>
                                            <td title={group.id}>
                                                <CopyToClipboard
                                                    render={({copy}) => (
                                                        <div onClick={() => copy(group.id)}>
                                                            {formatter.id(group.id)}
                                                        </div>
                                                    )}
                                                />
                                            </td>
                                            <td>
                                                {formatter.token(group.mixingTokenId ? group.mixingTokenAmount : group.amount, group.mixingTokenId)}
                                            </td>
                                            <td>{group.createdDate}</td>
                                            <td>
                                                <CopyToClipboard
                                                    render={({copy}) => (
                                                        <div onClick={() => copy(group.deposit)}>
                                                            {group.deposit}
                                                        </div>
                                                    )}
                                                />
                                            </td>
                                            <td>{group.status}</td>
                                            <td>
                                                <NavLink className="btn btn-outline-primary"
                                                         to={"/stat/history/" + group.id}>Details</NavLink>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div>
                                {this.state.loaded ? (
                                    <h3 className="text-center">
                                        No Mix Available
                                    </h3>
                                ) : (
                                    <React.Fragment>
                                        <h3 className="text-danger text-center">
                                            Loading data
                                        </h3>
                                        <h3 className="text-center text-danger">
                                            Please wait <i className="fa fa-circle-o-notch fa-spin"/>
                                        </h3>
                                    </React.Fragment>
                                )}
                            </div>
                        )}
                    </Panel>
                </div>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    info: state.tokens,
});


export default withLayout(MainLayout)(connect(mapStateToProps)(Stat));

