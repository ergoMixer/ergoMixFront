import React from 'react';
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from "../../layout/main-layout/MainLayout";
import { ApiNetwork } from "../../network/api";
import * as formatter from '../../formatter/formatters'
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import { NavLink } from "react-router-dom";

class Stat extends React.Component {
    state = {
        mixGroup: []
    };

    componentWillMount() {
        ApiNetwork.mixRequestGroupCompleteList().then((response => {
            this.setState({mixGroup: response.data})
        })).catch(error => {

        })
    }

    render() {
        return (
            <div className={"row"}>
                <div className="col-12"> Stat</div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className=" text-primary">
                                    <tr>
                                        <th>ID</th>
                                        <th>Amount</th>
                                        <th>Creation date</th>
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
                                            <td>{formatter.erg(group.amount)}</td>
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
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default withLayout(MainLayout)(Stat);

