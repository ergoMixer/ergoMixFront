import React from 'react';
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../network/api";
import * as formatter from '../../formatter/formatters'
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Panel from "../../components/panel/Panel";
import Loading from "../../components/loading/Loading";
import CopyClipboard from "../../components/copy-clipboard/CopyClipboard";
import Tooltip from "../../components/tooltip/Tooltip";

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
                    <Loading
                        emptyMessage={["Nothing to show."]}
                        empty={this.state.mixGroup.length === 0}
                        loaded={this.state.loaded}>
                        <Panel>
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
                                            <td>
                                                <Tooltip title={<span className="tooltip-text">{group.id}</span>} arrow>
                                                    <CopyClipboard value={group.id} display={formatter.id(group.id)}/>
                                                </Tooltip>
                                            </td>
                                            <td>
                                                {formatter.token(group.mixingTokenId ? group.mixingTokenAmount : group.amount, group.mixingTokenId)}
                                            </td>
                                            <td>{group.createdDate}</td>
                                            <td>
                                                <CopyClipboard value={group.deposit}/>
                                            </td>
                                            <td>{group.status}</td>
                                            <td>
                                                <NavLink className="btn btn-outline-primary"
                                                         to={"/mix/history/" + group.id}>Details</NavLink>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Panel>
                    </Loading>
                </div>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    info: state.tokens,
});


export default withLayout(MainLayout)(connect(mapStateToProps)(Stat));

