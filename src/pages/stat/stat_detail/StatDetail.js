import React from 'react';
import {ApiNetwork} from "../../../network/api";
import ProjectModal from "../../../components/modal/modal";
import {connect} from "react-redux";
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";

import CopyClipboard from "../../../components/copy-clipboard/CopyClipboard";
import Breadcrumb from "../../../components/broadcom/Breadcrumb";
import withLayout from '../../../hoc/with_layout/withLayout';
import MainLayout from '../../../layout/main-layout/MainLayout';
import * as formatter from '../../../formatter/formatters'
import CheckboxesTags from "../../../components/select/CheckboxesTags";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import WithdrawList from "../withdraw/WithdrawList";
import SetAddress from "./SetAddress";
import Tooltip from "../../../components/tooltip/Tooltip";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Loading from "../../../components/loading/Loading";
import OrderTd from '../../../components/order-td/OrderTd';

class StatDetail extends React.Component {
    state = {
        mix: [],
        group: null,
        transactionShow: false,
        setAddressShow: false,
        withdrawListShow: false,
        withdrawAddress: '',
        mixId: '',
        status: 'active',
        loadedStatus: '',
        order: "id",
        orderDir: "asc"
    };

    checkBoxFilterLists = [
        {title: 'All'},
        {title: 'Completed'},
        {title: 'Empty Addresses'}
    ];

    neededStatus = () => this.props.path === 'covert' ? this.state.status : undefined;

    sortMix = (mixes, order, orderDir) => {
        if (order) {
            return mixes.sort(function (a, b) {
                const keyA = a[order],
                    keyB = b[order];
                debugger
                // Compare the 2 dates
                if (keyA < keyB) return orderDir === "asc" ? -1 : 1;
                if (keyA > keyB) return orderDir === "asc" ? 1 : -1;
                return 0;
            });
        }
        return mixes
    }

    loadData = () => {
        const group = (this.props.path === 'covert' ? this.props.match.params.covertId : this.props.match.params.groupId);
        const neededStatus = this.neededStatus()
        if (this.state.group !== group || neededStatus !== this.state.loadedStatus) {
            ApiNetwork.mixRequestList(group, neededStatus).then((response => {
                const res = response.data.map(item => {
                    return {...item, checked: false}
                });
                this.setState({mix: this.sortMix(res, this.state.order, this.state.orderDir), group: group, loadedStatus: neededStatus});
            })).catch(error => {

            });
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.loadData();
    }

    componentDidMount() {
        this.loadData();
    };

    closeModal = () => {
        this.setState({
            transactionShow: false,
            withdrawListShow: false,
            setAddressShow: false,
            group: '',
        });
    };

    showTransaction = mixItem => {
        this.setState({
            transactionId: mixItem.withdrawTxId,
            transactionShow: true,
        })
    };

    breadcrumbPath = () => {
        if (this.props.path === 'history' && !this.props.historyLoaded) {
            ApiNetwork.mixRequestGroupCompleteList();
        }
        if (this.props.path === 'active' && !this.props.activeLoaded) {
            ApiNetwork.mixRequestGroupActiveList();
        }
        if (this.props.path === 'covert' && !this.props.covertLoaded) {
            ApiNetwork.covertList();
        }
        switch (this.props.path) {
            case 'history':
                return [
                    {'url': '/mix/history', 'title': "History"},
                    {title: this.props.historyMap[this.props.match.params.groupId]}
                ]
            case 'active':
                return [
                    {url: '/mix/active', title: 'Mixes'},
                    {title: this.props.activeMap[this.props.match.params.groupId]}
                ]
            case 'covert':
                return [
                    {url: '/covert', title: "Covert Address"},
                    {title: this.props.covertMap[this.props.match.params.covertId]},
                ]
            default:
                return []
        }
    };

    copyDeposit = copyFunction => {
        copyFunction(this.state.transactionId);
        this.setState({transactionCopied: true});
        setTimeout(() => {
            this.setState({transactionCopied: false})
        }, 5000);
    };

    handleSingleCheckboxChange = index => {
        let mixCopy = [...this.state.mix];
        let boxCopy = {...mixCopy[index]};
        boxCopy.checked = !boxCopy.checked;
        mixCopy[index] = boxCopy;
        this.setState({
            mix: mixCopy,
        });
    };

    handleChange = indexOption => {
        let mixCopy = [];
        // If selected All in dropDown
        if (indexOption === 0)
            mixCopy = this.state.mix.map(item => {
                return {...item, checked: item.withdrawStatus === "nothing"}
            });
        // If selected Completed in dropDown
        else if (indexOption === 1)
            mixCopy = this.state.mix.map(item => {
                return {...item, checked: (item.status === 'complete' && item.withdrawStatus === "nothing")};
            });
        // If selected Empty Addresses in dropDown
        else if (indexOption === 2)
            mixCopy = this.state.mix.map(item => {
                return {...item, checked: (item.withdraw === '' && item.withdrawStatus === "nothing")};
            });
        // If selected checkbox
        else {
            let stat = this.statusSelected();
            let status = (stat === 'All' || stat === 'Indeterminate');
            mixCopy = this.state.mix.map(item => {
                return item.withdrawStatus === "nothing" ? {...item, checked: !status} : {...item}
            });
        }
        this.setState({
            mix: mixCopy,
        });
    };

    statusSelected = () => {
        const countChecked = this.state.mix.filter(item => item.checked).length;
        const countAll = this.state.mix.filter(item => item.withdrawStatus === "nothing").length;
        if (countChecked === countAll && countAll !== 0)
            return 'All';
        else if (0 << countChecked || countChecked << countAll)
            return 'Indeterminate';
        else
            return 'None';
    };

    showWithdrawDetail = () => {
        this.setState({withdrawListShow: true})
    };

    showSetAddress = () => {
        this.setState({setAddressShow: true})
    };

    changeStatus = () => {
        this.setState(state => {
            return {...state, status: (state.status === 'all' ? 'active' : 'all')}
        })
    }

    setOrder = (order) => {
        this.setState(state => {
            const orderDir = (state.order === order && state.orderDir === "asc") ? "desc" : "asc";
            const mixes = this.sortMix(state.mix, order, orderDir);
            return {...state, orderDir: orderDir, order: order, mix: mixes}
        })
    }

    render() {
        console.log(this.state);
        const statusSelected = this.statusSelected();
        return (
            <div className="row">
                <ProjectModal close={this.closeModal} show={this.state.setAddressShow} padding={true}>
                    <SetAddress mix={this.state.mix} close={this.closeModal}/>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.withdrawListShow} padding={true}>
                    <WithdrawList mix={this.state.mix} close={this.closeModal}/>
                </ProjectModal>
                <ProjectModal close={this.closeModal} show={this.state.transactionShow}>
                    <div>Transaction ID:</div>
                    <CopyClipboard value={this.state.transactionId}/>
                    <div className="text-center">
                        <CopyToClipboard
                            render={({copy}) => (
                                <button className="btn btn-outline-primary" onClick={() => this.copyDeposit(copy)}>
                                    Copy Tx Id
                                </button>
                            )}
                        /> &nbsp;
                        <a href={this.props.info.ergoExplorerFront + "/en/transactions/" + this.state.transactionId}
                           target="_blank"
                           className="btn btn-outline-primary">
                            View In Explorer
                        </a>

                    </div>
                </ProjectModal>
                <Breadcrumb path={this.breadcrumbPath()}/>

                <div className="col-12">
                    <div className="card">
                        <div className="card-header card-header-tabs card-header-primary">
                            <ul className="nav nav-tabs" data-tabs="tabs">
                                <li className="nav-item">
                                    <a style={statusSelected !== "None" ? {cursor: "pointer"} : {cursor: "not-allowed"}}
                                       className={"nav-link active"}
                                       onClick={statusSelected !== "None" ? () => this.showSetAddress() : null}>
                                        <i className="material-icons">edit</i> Set Address
                                        <div className="ripple-container"/>
                                    </a>
                                </li>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <li className="nav-item">
                                    <a style={statusSelected !== "None" ? {cursor: "pointer"} : {cursor: "not-allowed"}}
                                       className={"nav-link active"}
                                       onClick={statusSelected !== "None" ? () => this.showWithdrawDetail() : null}>
                                        <i className="material-icons">edit</i> Withdraw Now
                                        <div className="ripple-container"/>
                                    </a>
                                </li>
                                {this.props.path === 'covert' ? (
                                    <li className="nav-item">
                                        <div className="header-slider">
                                            <FormControlLabel
                                                control={<Switch checked={this.state.status === 'active'}
                                                                 onChange={this.changeStatus}/>}
                                                label="Hide Withdrawn Boxes"
                                            />
                                        </div>
                                    </li>
                                ) : null}
                            </ul>
                        </div>
                        <div className="table-responsive">
                            <Loading loaded={this.state.loadedStatus === this.neededStatus()}
                                     empty={this.state.mix.length === 0}
                                     emptyMessage={["There are no boxes for this covert address"]}
                            >
                                <table className="table">
                                    <thead className=" text-primary">
                                    <tr style={{textAlign: "center"}}>
                                        <th>&nbsp;</th>
                                        <th>
                                            <CheckboxesTags
                                                indeterminate={statusSelected === 'Indeterminate'}
                                                options={this.checkBoxFilterLists}
                                                getOptionSelected={(option, value) => option.title === value.title}
                                                checked={statusSelected === 'All'}
                                                onChange={(e) => this.handleChange(e.target.checked)}
                                                onClick={(index) => this.handleChange(index)}
                                            />
                                        </th>
                                        <OrderTd itemLabel="ID"
                                                 itemKey={"id"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Amount"
                                                 itemKey={(this.state.mix.length > 0 && this.state.mix[0].mixingTokenId)
                                                     ? "mixingTokenAmount" : "amount"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Box Type"
                                                 itemKey={"boxType"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Latest Activity"
                                                 itemKey={"lastMixTime"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Round"
                                                 itemKey={"rounds"}
                                                 setOrder={this.setOrder}
                                                 order={this.state.order}
                                                 orderDir={this.state.orderDir}/>
                                        <OrderTd itemLabel="Withdraw Address"
                                                 itemKey={"withdraw"}
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
                                    {this.state.mix.map((mixItem, index) => (
                                        <tr key={index} style={{textAlign: "center"}}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Checkbox
                                                    icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                                    checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                                    disabled={mixItem.withdrawStatus !== "nothing"}
                                                    checked={!!this.state.mix[index].checked}
                                                    onChange={() => this.handleSingleCheckboxChange(index)}
                                                />
                                            </td>
                                            <td>
                                                <Tooltip title={<span className="tooltip-text">{mixItem.id}</span>}
                                                         arrow>
                                                    <div>{formatter.id(mixItem.id)}</div>
                                                </Tooltip>
                                            </td>
                                            <td>{formatter.token(mixItem.mixingTokenId ? mixItem.mixingTokenAmount : mixItem.amount, mixItem.mixingTokenId)}</td>
                                            <td>{mixItem.boxType}</td>
                                            <td>{mixItem.lastMixTime}</td>
                                            <td>{mixItem.rounds}</td>
                                            <td>
                                                <Tooltip title={<span
                                                    className="tooltip-text">{mixItem.withdraw === "" ? "(MANUAL)" : mixItem.withdraw}</span>}
                                                         arrow>
                                                    <div>{mixItem.withdraw === "" ? "(MANUAL)" : formatter.address(mixItem.withdraw)}</div>
                                                </Tooltip>
                                            </td>
                                            <td>{mixItem.status}</td>
                                            <td>
                                                {mixItem.withdrawStatus === "nothing" ? (
                                                    null
                                                ) : mixItem.withdrawTxId === "" ? "Transaction is being generated" : (
                                                    <button className="btn btn-outline-primary"
                                                            onClick={() => this.showTransaction(mixItem)}
                                                    >View Transaction</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Loading>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    info: state.info,
    tokens: state.tokens,
    activeMap: state.activeMap,
    activeLoaded: state.activeLoaded,
    covertMap: state.covertMap,
    historyMap: state.historyMap,
    historyLoaded: state.historyLoaded,
    covertLoaded: state.covertLoaded,
});

export default withLayout(MainLayout)(connect(mapStateToProps)(StatDetail));
