import React from 'react';
import { connect } from "react-redux";
import * as formatter from '../../../formatter/formatters';
import MixRing from "../../../components/mix-ring/MixRing";
import RingCounter from "./ring-counter/RingCounter";
import Panel from "../../../components/panel/Panel";


class Step2 extends React.Component {
    state = {
        boxes: [],
    };

    componentDidMount = () => {
        let boxes = this.initBoxes();
        let computed = 0
        this.props.boxes.forEach(boxOld => {
            boxes.forEach(box => {
                if (boxOld.amount === box.amount) {
                    let count = Math.max(0, Math.min(Math.floor((this.props.total - computed) / box.amount), boxOld.count));
                    box.count = count;
                    computed += count * box.amount;
                }
            })
        });
        this.saveBoxes(boxes);
    };

    initBoxes = () => {
        let boxes = []
        this.props.token.rings.forEach(amount => {
            if (amount <= this.props.total) {
                boxes.push({amount: amount, count: 0})
            }
        });
        return this.sortBoxes(boxes)
    }

    sortBoxes = boxes => {
        boxes.sort((a, b) => a.amount - b.amount);
        return boxes
    }

    saveBoxes = (boxes) => {
        this.setState({boxes: boxes});
        this.props.saveValue({boxes: boxes});
        const mixed = this.mixed(boxes);
        const remain = this.props.total - mixed;
        this.props.setValid(remain === 0);
    };

    mixed = (boxes) => {
        boxes = boxes === undefined ? this.state.boxes : boxes;
        let mixed = 0;
        boxes.forEach(item => {
            if(item.count !== '') {
                mixed += item.amount * item.count
            }
        });
        return mixed;
    };

    setCount = (count, amount) => {
        const remain = this.props.total - this.mixed();
        let boxes = [...this.state.boxes];
        const boxIndex = boxes.findIndex(item => item.amount === amount);
        const currentCount = boxes[boxIndex].count;
        if(count !== '') {
            count = Math.max(0, Math.min(Math.floor(remain / amount) + currentCount, count));
        }
        if (boxIndex !== -1) {
            boxes[boxIndex] = {...boxes[boxIndex], count: count};
        }
        this.saveBoxes(boxes);
    }

    distribute = (amount, old_boxes) => {
        debugger
        let boxes = [...old_boxes];
        boxes.reverse().forEach(item => {
            if (item.amount <= amount) {
                const item_count = parseInt(amount / item.amount);
                item.count += item_count;
                amount -= item_count * item.amount;
            }
        });
        this.saveBoxes(this.sortBoxes(boxes));
    };

    render() {
        const mixed = this.mixed();
        const remain = this.props.total - mixed;
        let totalBox = 0;
        this.state.boxes.forEach(item => {
            totalBox += item.count;
        });
        return (
            <React.Fragment>
                <div className="row text-center non-selectable">
                    <div className="col-12 text-center">
                        <Panel>
                            <h4>Distribute {this.props.token.name} in different rings
                                automatically or manually using + and -
                                signs.</h4>
                            {this.props.token.id !== "" ? (
                                <React.Fragment>
                                    <h4>You are mixing:&nbsp;
                                        <b>
                                            {this.props.token.name}
                                        </b>
                                    </h4>
                                    <h4>
                                        Token ID: <b>{this.props.token.id}</b>
                                    </h4>
                                </React.Fragment>
                            ) : null}
                        </Panel>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="card card-pricing card-raised">
                            <div className="card-body">
                                <h4 className="card-category">Total Amount</h4>
                                <h3 className="card-title">{formatter.token(this.props.total, this.props.token.id)}</h3>
                                <button className="btn btn-rose btn-round btn-fill"
                                        onClick={() => this.distribute(this.props.total, this.initBoxes())}>Distribute All
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="card card-pricing card-raised">
                            <div className="card-body">
                                <h4 className="card-category">{this.props.token.name} Distributed
                                    into Boxes</h4>
                                <h3 className="card-title">{formatter.token(mixed, this.props.token.id, true)} in {totalBox} Boxes</h3>
                                <button className="btn btn-rose btn-round btn-fill"
                                        onClick={() => this.saveBoxes(this.initBoxes())}>Reset
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="card card-pricing card-raised">
                            <div className="card-body">
                                <h4 className="card-category">Remaining {this.props.token.name} to
                                    Distribute</h4>
                                <h3 className="card-title">{formatter.token(remain, this.props.token.id)}</h3>
                                <button className="btn btn-rose btn-round btn-fill"
                                        onClick={() => this.distribute(remain, this.state.boxes)}>Distribute
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row non-selectable">
                    {this.state.boxes.map((box, index) => (
                        <MixRing
                            key={index}
                            amount={box.amount}
                            tokenId={this.props.token.id}
                        >
                            <RingCounter
                                amount={box.amount}
                                remain={remain}
                                count={box.count}
                                setCount={this.setCount}
                            />
                        </MixRing>
                    ))}
                </div>
            </React.Fragment>
        )
    };
}

const mapStateToProps = state => ({
    rings: state.rings,
});

export default connect(mapStateToProps)(Step2);
