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
import OrderTd from "../../components/order-td/OrderTd";

class Stat extends React.Component {
    state = {
        mixGroup: [],
        loaded: false,
        order: "id",
        orderDir: "asc"
    };

    sortMixGroup = (mixes, order, orderDir) => {
        if (order) {
            return mixes.sort(function (a, b) {
                const keyA = a[order],
                    keyB = b[order];
                // Compare the 2 dates
                if (keyA < keyB) return orderDir === "asc" ? -1 : 1;
                if (keyA > keyB) return orderDir === "asc" ? 1 : -1;
                return 0;
            });
        }
        return mixes
    }

    componentWillMount() {
        ApiNetwork.mixRequestGroupCompleteList().then((response => {
            this.setState({mixGroup: this.sortMixGroup(response.data, this.state.order, this.state.orderDir), loaded: true})
        })).catch(error => {

        })
    }

    setOrder = (order) => {
        this.setState(state => {
            const orderDir = (state.order === order && state.orderDir === "asc") ? "desc" : "asc";
            const mixes = this.sortMixGroup(state.mixGroup, order, orderDir);
            return {...state, orderDir: orderDir, order: order, mixGroup: mixes}
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
                                        <th>&nbsp;</th>
                                        <OrderTd itemLabel="ID"
                                                 itemKey={"id"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Amount"
                                                 itemKey={(this.state.mixGroup.length > 0 && this.state.mixGroup[0].mixingTokenId)
                                                     ? "mixingTokenAmount" : "amount"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Creation Date"
                                                 itemKey={"createdDate"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Deposit Address"
                                                 itemKey={"deposit"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Status"
                                                 itemKey={"status"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <th/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.mixGroup.map((group, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Tooltip title={<span className="tooltip-text">{group.id}</span>} arrow>
                                                    <div>
                                                        <CopyClipboard value={group.id} display={formatter.id(group.id)}/>
                                                    </div>
                                                </Tooltip>
                                            </td>
                                            <td>
                                                {formatter.token(group.mixingTokenId ? group.mixingTokenAmount : group.amount, group.mixingTokenId)}
                                            </td>
                                            <td>{formatter.dateTime(group.createdDate)}</td>
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

