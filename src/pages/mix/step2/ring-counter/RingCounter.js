import React from 'react';
import ChangeCountBtn from "./ChangeCountBtn";

class RingCounter extends React.Component {
    state = {
        count: 0,
    }

    increment = () => {
        this.props.setCount(this.props.count + 1, this.props.amount);
    }

    decrement = () => {
        this.props.setCount(this.props.count - 1, this.props.amount);
    }

    setCount = value => {
        if(!isNaN(parseInt(value))){
            const total = this.props.count + Math.floor(this.props.remain / this.props.amount);
            this.props.setCount(Math.max(0, Math.min(total, parseInt(value))), this.props.amount);
        }else if(value === ""){
            this.props.setCount("", this.props.amount);
        }
    }

    render() {
        return (
            <div className="stats row">
                <div className="col-4 mt-4">
                    <div className="float-right">
                        <ChangeCountBtn enabled={this.props.count > 0} act={this.decrement}>
                            remove
                        </ChangeCountBtn>
                    </div>
                </div>
                <div className="form-group col-4">
                    <input
                        className="form-control text-center"
                        value={"" + this.props.count}
                        onChange={event => this.setCount(event.target.value)}/>
                </div>
                <div className="col-4 mt-4">
                    <div className="float-left">
                        <ChangeCountBtn enabled={this.props.remain >= this.props.amount} act={this.increment}>
                            add
                        </ChangeCountBtn>
                    </div>
                </div>
            </div>
        )
    }
}

export default RingCounter;