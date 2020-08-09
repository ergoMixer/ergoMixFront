import React from 'react';
import {connect} from "react-redux";
import * as formatter from '../../../formatter/formatters';

class Step2 extends React.Component {
    state = {
        boxes: []
    };

    componentDidMount = () => {
        let mixed = 0;
        this.props.boxes.map(item => {
            mixed += item.amount * item.count
        });
        if (mixed < this.props.total) {
            this.saveBoxes([]);
        } else {
            this.setState({boxes: [...this.props.boxes]});
        }
    };

    saveBoxes = (boxes) => {
        this.setState({boxes: boxes});
        this.props.saveValue('boxes', boxes);
        const mixed = this.mixed(boxes);
        const remain = this.props.total - mixed;
        this.props.setValid(remain === 0);
    };

    mixed = (boxes) => {
        boxes = boxes === undefined ? this.state.boxes : boxes;
        let mixed = 0;
        boxes.map(item => {
            mixed += item.amount * item.count
        });
        return mixed;
    };

    subtractFromBox = amount => {
        if (this.props.rings.findIndex(item => item.amount === amount) === -1) return;
        let boxes = [...this.state.boxes];
        const boxIndex = boxes.findIndex(item => item.amount === amount);
        if (boxIndex >= 0 && boxes[boxIndex].count > 0) {
            boxes[boxIndex] = {...boxes[boxIndex]};
            boxes[boxIndex].count--;
        }
        this.saveBoxes(boxes);

    };

    addToBox = (amount) => {
        if (this.props.total - this.mixed() < amount) return;
        if (this.props.rings.findIndex(item => item.amount === amount) === -1) return;
        let boxes = [...this.state.boxes];
        const boxIndex = boxes.findIndex(item => item.amount === amount);
        if (boxIndex === -1) {
            boxes.push({amount: amount, count: 1})
        } else {
            boxes[boxIndex] = {...boxes[boxIndex]};
            boxes[boxIndex].count++;
        }
        this.saveBoxes(boxes);
    };

    distribute = (amount, old_boxes) => {
        let pools = [...this.props.rings];
        pools.sort((a, b) => b.amount - a.amount);
        let boxes = [];
        pools.map(item => {
            if (item.amount <= amount) {
                const tmpBox = {amount: item.amount, count: parseInt(amount / item.amount)};
                amount -= tmpBox.count * tmpBox.amount;
                boxes.push(tmpBox)
            }
        });
        [...old_boxes].map(old_box => {
            const boxIndex = boxes.findIndex(item => item.amount === old_box.amount);
            if (boxIndex === -1) {
                boxes.push({...old_box});
            } else {
                boxes[boxIndex].count += old_box.count;
            }
        });
        this.saveBoxes(boxes);
    };

    render() {
        const mixed = this.mixed();
        const remain = this.props.total - mixed;
        let totalBox = 0;
        this.state.boxes.map(item => {
            totalBox += item.count;
        });
        return (
            <React.Fragment>
                <div className="row text-center non-selectable">
                    <div className="col-12 text-center">
                        <div className="card">
                            <div className="card-body">
                                <h4>Distribute Ergs in different rings automatically or manually using + and - signs.</h4>
                            </div>
                        </div>
                    </div>
                    <div className={"col-12 col-sm-4"}>
                        <div className="card card-pricing card-raised">
                            <div className="card-body">
                                <h4 className="card-category">Total number of Ergs</h4>
                                <h3 className="card-title">{formatter.ergWithoutSuffix(this.props.total)}</h3>
                                <button className="btn btn-rose btn-round btn-fill"
                                        onClick={() => this.distribute(this.props.total, [])}>Distribute all
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={"col-12 col-sm-4"}>
                        <div className="card card-pricing card-raised">
                            <div className="card-body">
                                <h4 className="card-category">Ergs distributed into boxes</h4>
                                <h3 className="card-title">{formatter.erg(mixed)} in {totalBox} boxes</h3>
                                <button className="btn btn-rose btn-round btn-fill"
                                        onClick={() => this.saveBoxes([])}>Reset
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={"col-12 col-sm-4"}>
                        <div className="card card-pricing card-raised">
                            <div className="card-body">
                                <h4 className="card-category">Remaining Ergs to distribute</h4>
                                <h3 className="card-title">{formatter.ergWithoutSuffix(remain)}</h3>
                                <button className="btn btn-rose btn-round btn-fill"
                                        onClick={() => this.distribute(remain, this.state.boxes)}>Distribute
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row non-selectable">
                    {this.props.rings.map((item, index) => {
                        if (item.amount > this.props.total) return null;
                        let count = 0;
                        const boxIndex = this.state.boxes.findIndex(boxItem => item.amount === boxItem.amount);
                        if (boxIndex >= 0) {
                            count += this.state.boxes[boxIndex].count;
                        }
                        return (
                            <div className="col-lg-4 col-md-6 col-sm-12" key={item.amount}>
                                <div className="card card-stats" key={item.amount}>
                                    <div className="card-header card-header-warning card-header-icon">
                                        <div className="card-icon">
                                            <i className="">{formatter.erg(item.amount)}</i>
                                        </div>
                                    </div>
                                    <div className="card-body text-center">
                                        <p className="card-category">Available Half Boxes: {item.unspentHalf}</p>
                                        <p className="card-category">Ring Activity (Mixes in Last 24h): {item.spentHalf}</p>
                                        <div className="stats">
                                            <i style={count > 0 ? {cursor: "pointer"} : {}}
                                               className={count > 0 ? "material-icons text-success" : "material-icons"}
                                               onClick={() => this.subtractFromBox(item.amount)}>remove</i>

                                            <span className="badge badge-warning"
                                                  style={{
                                                      "fontSize": "30px",
                                                      background: "linear-gradient(60deg, #ffa726, #fb8c00)",
                                                      color: "white"
                                                  }}>{count}</span>
                                            <i style={remain >= item.amount ? {cursor: "pointer"} : null}
                                               className={remain >= item.amount ? "material-icons text-success" : "material-icons"}
                                               onClick={() => this.addToBox(item.amount)}>add</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    };
}

const mapStateToProps = state => ({
    rings: state.rings,
});


export default connect(mapStateToProps)(Step2);
