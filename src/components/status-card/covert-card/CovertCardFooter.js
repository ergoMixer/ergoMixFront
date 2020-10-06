import React from 'react';
import { NavLink } from "react-router-dom";

const CovertCardFooter = props => {
    return (
        <div className="card-action">
            <hr/>
            <NavLink className="btn btn-outline-primary" to={'/covert/' + props.id + '/asset'}>All Assets</NavLink>
            &nbsp;
            <NavLink className="btn btn-outline-primary" to={"/covert/" + props.id + '/address'}>Edit Addresses</NavLink>
            &nbsp;
            <NavLink className="btn btn-outline-primary" to={"/covert/" + props.id + '/'}>History</NavLink>
        </div>
    )
};

export default CovertCardFooter;