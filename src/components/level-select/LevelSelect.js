import React from 'react';
import Slider from "@mui/material/Slider";
import * as formatter from "../../formatter/formatters";
import { connect } from "react-redux";
import CallMerge from "@mui/icons-material/CallMerge";

const levelSelect = props => {
    const marks = props.mixLevel.map((item, index) => {
        return {value: index, label: "Level " + (index + 1)}
    });
    const level = props.mixLevel[props.selectedLevel];
    return (
        <div className={props.fullWidth ? "col-12" : "col-12 col-md-6"}>
            <div className="card card-stats">
                <div className="card-header card-header-success card-header-icon">
                    <div className="card-icon">
                        <i className="material-icons"><CallMerge /></i>
                    </div>
                    <h4 className="card-title ">Mixing Level</h4>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <div className="tab-content">
                                <div className="tab-pane active text-left">
                                    <div style={{margin: "30px 30px 0 30px"}}>
                                        <Slider
                                            max={marks.length - 1}
                                            mix={0}
                                            defaultValue={props.selectedLevel}
                                            color={"secondary"}
                                            steps={null}
                                            onChangeCommitted={props.select}
                                            valueLabelDisplay="off"
                                            // valueLabelFormat={this.valueLabelFormat}
                                            marks={marks}
                                        />
                                    </div>
                                    {level !== undefined ? (
                                        <React.Fragment>
                                            <div>
                                                <label className="font-weight-bold">Cost per
                                                    Box:&nbsp;</label>
                                                {formatter.erg(level.price)}</div>
                                            <div>
                                                <label className="font-weight-bold">Approximate
                                                    Mixes:&nbsp;</label>
                                                {level.token} rounds
                                            </div>
                                        </React.Fragment>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    rings: state.rings,
    startFee: state.startFee,
    distributeFee: state.distributeFee,
    rate: state.rate,
    boxInTransaction: state.boxInTransaction,
    mixLevel: state.mixLevel,
});

export default connect(mapStateToProps)(levelSelect);