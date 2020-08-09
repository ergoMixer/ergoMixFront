import React from 'react';
import { connect } from "react-redux";
import * as formatter from '../../formatter/formatters';
import MainLayout from "../../layout/main-layout/MainLayout";
import withLayout from '../../hoc/with_layout/withLayout';

class Step2 extends React.Component {
    state = {
        boxes: []
    };

    render() {
        let totalBox = 0;
        this.state.boxes.map(item=>{
            totalBox += item.count;
        });
        return (
            <React.Fragment>
                <div className="row non-selectable">
                    {this.props.rings.map((item, index) => {
                        if(item.amount > this.props.total) return null;
                        let count = 0;
                        const boxIndex= this.state.boxes.findIndex(boxItem => item.amount === boxItem.amount);
                        if(boxIndex >= 0){
                            count += this.state.boxes[boxIndex].count;
                        }
                        return (
                            <div className="col-lg-4 col-md-4 col-sm-6" key={item.amount}>
                                <div className="card card-stats" key={item.amount}>
                                    <div className="card-header card-header-warning card-header-icon">
                                        <div className="card-icon">
                                            <i className="">{formatter.erg(item.amount)}</i>
                                        </div>
                                    </div>
                                    <div className="card-body text-center">
                                        <p className="card-category">available Half Boxes: {item.unspentHalf}</p>
                                        <p className="card-category">Mix in last 24 hours: {item.spentHalf} Rounds</p>
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


export default withLayout(MainLayout)(connect(mapStateToProps)(Step2));
