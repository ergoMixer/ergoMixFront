import React from 'react';
import { ApiNetwork } from "../../../network/api";
import * as formatter from '../../../formatter/formatters';
import Tooltip from "../../../components/tooltip/Tooltip";
import {
    feeToMintRc,
    feeToMintSc,
    maxRcToMint,
    maxScToMint, priceToMintRc,
    priceToMintSc,
    rcPrice,
    scPrice
} from "../../../utils/ageHelper";
import { currentHeight } from "../../../utils/explorer";
import { mintSc } from "../../../utils/mintSc";
import { mintRc } from "../../../utils/mintRc";

class AgeUsd extends React.Component {
    state = {
        mix: [],
        loading: "",
        selected: 'stable',
        stableCoins: {},
        reserveCoins: {},
    };

    componentDidMount = () => {
        const mixCopy = [];
        this.props.mix.forEach((box, index) => {
            if (box.checked)
                mixCopy.push({...box, loading: ""})
        });
        this.setState({
            mix: mixCopy,
        });
        this.calcStableValue();
    };

    async binarySearchPrice(ergs, price, curHeight, maxCount, priceFn, feeFn, decimalFactor) {
        let count = Math.floor(ergs / price);
        let upBoundary = Math.min(count * 2, maxCount), downBoundary = 0;
        while (downBoundary<upBoundary) {
            count = Math.ceil((upBoundary + downBoundary) / 2);
            let countStr = "" + (count / decimalFactor);
            let price = await priceFn(countStr);
            let fee = await feeFn(countStr);
            let total = price + fee;
            if (total<=ergs) {
                downBoundary = count;
                if (total === ergs) break;
            } else {
                upBoundary = count - 1;
            }
        }
        let res = downBoundary / decimalFactor;
        return {
            count: res,
            mintPrice: await priceToMintSc("" + res),
            fee: await feeToMintRc("" + res)
        }
    }

    async calcStableCount(prices, curHeight) {
        const stablePrice = await scPrice();
        const maxCount = await maxScToMint(curHeight);
        let values = {};
        for (let index = 0; index<prices.length; index++) {
            const ergs = prices[index];
            values[ergs] = await this.binarySearchPrice(
                ergs,
                stablePrice,
                curHeight,
                maxCount,
                priceToMintSc,
                feeToMintSc,
                100
            );
        }
        this.setState(state => ({
            ...state,
            stableCoins: {
                ...state.stableCoins,
                ...values
            }
        }));
    }

    async calcReserveCount(prices, curHeight) {
        const reservePrice = await rcPrice();
        const maxCount = await maxRcToMint(curHeight);
        let values = {};
        for (let index = 0; index<prices.length; index++) {
            const ergs = prices[index];
            values[ergs] = await this.binarySearchPrice(
                ergs,
                reservePrice,
                curHeight,
                maxCount,
                priceToMintRc,
                feeToMintRc,
                1
            );
        }
        this.setState(state => ({
            ...state,
            reserveCoins: {
                ...state.reserveCoins,
                ...values
            }
        }));
    }

    async buySingleCoin(mix, bankBox) {
        const price = (this.state.selected === 'stable' ? scPrice : rcPrice);
        const maxToMint = (this.state.selected === 'stable' ? maxScToMint : maxRcToMint);
        const priceToMint = (this.state.selected === 'stable' ? priceToMintSc : priceToMintRc);
        const feeToMint = (this.state.selected === 'stable' ? feeToMintSc : feeToMintRc);
        const mint = (this.state.selected === 'stable' ? mintSc : mintRc);
        const decimalFactor = (this.state.selected === 'stable' ? 100 : 1);
        const curHeight = await currentHeight();
        let count = await this.binarySearchPrice(
            mix.amount,
            await price(),
            curHeight,
            await maxToMint(curHeight),
            priceToMint,
            feeToMint,
            decimalFactor,
        )
        return await mint("" + count.count, mix.withdraw, bankBox);
    }

    setMixState = (index, status, message="") => {
        this.setState(state => {
            const mix = [...this.state.mix];
            mix[index] = {...mix[index], loading: status, message: message}
            return {
                ...state,
                mix: mix
            }
        })
    }

    async buyCoin(){
        let transaction = null
        for(let index=0; index < this.state.mix.length; index ++ ) {
            if(this.isBoxValid(this.state.mix[index])) {
                try {
                    this.setMixState(index, "Start")
                    let bankBox = (transaction ? transaction.outputs[0] : null);
                    const newTransaction = await this.buySingleCoin(this.state.mix[index], bankBox);
                    transaction = (await ApiNetwork.mint(this.state.mix[index].id, transaction, newTransaction)).data;
                    this.setMixState(index, "Done");
                } catch (e) {
                    console.log(e);
                    this.setMixState(index, "Failed", e);
                    // break;
                }
            }
        }
        this.setState({loading: ""});
    }

    calcStableValue = () => {
        let values = [];
        this.props.mix.forEach(mix => {
            if (values.indexOf(mix.amount) === -1) {
                values.push(mix.amount);
            }
        });
        currentHeight().then(curHeight => {
            this.calcStableCount(values, curHeight);
            this.calcReserveCount(values, curHeight);
        })
    }

    getStableBtnClass = () => {
        return this.state.selected === 'stable' ? 'nav-link active' : 'nav-link';
    }

    getReserveBtnClass = () => {
        return this.state.selected === 'reserve' ? 'nav-link active' : 'nav-link';
    }

    setPage = pageId => {
        if(this.state.loading === '') {
            const newMixes = this.state.mix.map(item => ({...item, loading: '', message: ''}))
            this.setState({selected: pageId, mix: newMixes});
            this.calcStableValue();
        }
    }

    getStableCount = amount => {
        const value = this.state.stableCoins[amount];
        if (value === undefined) {
            return <i className="fa fa-circle-o-notch fa-spin"/>
        }
        return value.count;
    }

    getReserveCount = amount => {
        const value = this.state.reserveCoins[amount];
        if (value === undefined) {
            return <i className="fa fa-circle-o-notch fa-spin"/>
        }
        return value.count;
    }

    buyCoins = () => {
        this.setState({loading: "withdraw"});
        this.buyCoin();
    }

    isBoxValid = box => {
        return box.status === 'complete' && box.withdrawStatus === 'nothing' && box.withdraw;
    }

    getBoxMessage = box => {
        if(box.status !== 'complete')
            return "Only completed mixes can be used to buy SigUSD/SigRSV."
        if(box.withdrawStatus !== 'nothing')
            return "The box is withdrawn or processing."
        return 'Withdraw address is not set.'
    }

    render() {
        return (
            <div>
                <div className="col-12 alert alert-primary">
                    <ul className="nav nav-tabs" data-tabs="tabs">
                        <li className="nav-item">
                            <a className={this.getStableBtnClass()} onClick={() => this.setPage('stable')}>
                                <i className="material-icons" style={{color: "white"}}>edit</i> Stable Coin
                                <div className="ripple-container"/>
                            </a>
                        </li>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <li className="nav-item" style={{color: "white"}}>
                            <a className={this.getReserveBtnClass()} onClick={() => this.setPage('reserve')}>
                                <i className="material-icons" style={{color: "white"}}>edit</i> Reserve Coin
                                <div className="ripple-container"/>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="card-body" style={{overflowY: 'scroll', maxHeight: '40vh'}}>
                    <div className="table-responsive">
                        <table className="table">
                            <thead className=" text-primary">
                            <tr>
                                <th>ID</th>
                                <th>Amount</th>
                                <th>Withdraw Address</th>
                                {this.state.selected === 'stable' ? <th>Stable Coin Count</th> : null}
                                {this.state.selected === 'reserve' ? <th>Reserve Coin Count</th> : null}
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.mix.map((box, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>
                                            <Tooltip title={<span className="tooltip-text">{box.id}</span>} arrow>
                                                <div>{formatter.id(box.id)}</div>
                                            </Tooltip>
                                        </td>
                                        <td>{formatter.token(box.mixingTokenId ? box.mixingTokenAmount : box.amount, box.mixingTokenId)}</td>
                                        <td>{formatter.address(box.withdraw)}</td>
                                        {this.state.selected === 'stable' ?
                                            <td>{this.getStableCount(box.amount)}</td> : null}
                                        {this.state.selected === 'reserve' ?
                                            <td>{this.getReserveCount(box.amount)}</td> : null}
                                        <td>
                                            {box.loading === "Start" ?
                                                <i className="fa fa-circle-o-notch fa-spin"/> : box.loading === "Done" ?
                                                <i className="material-icons" style={{color: "green"}}>done</i> : box.loading === "Failed" ?
                                                <i className="material-icons" style={{color: "red"}}>clear</i> : null
                                            }
                                        </td>
                                    </tr>
                                    {box.message || !this.isBoxValid(box) ? (
                                        <tr>
                                            <td colSpan={5} style={{color: "red", fontSize: "75%", paddingTop: 0}}>
                                                {box.message ? box.message : this.getBoxMessage(box)}
                                            </td>
                                        </tr>
                                    ) : null}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row" style={{padding: 20}}>
                    <div className="col-md-12">
                        <button className="btn btn-outline-warning" style={{width: "100%"}} onClick={this.buyCoins}>
                            {this.state.loading === "withdraw" ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
                            &nbsp;&nbsp;
                            {this.state.selected === 'stable' ? "Buy Stable Coins" : "Buy Reserve Coins"}
                        </button>
                    </div>
                </div>
            </div>
        )
    };
}

export default AgeUsd;
