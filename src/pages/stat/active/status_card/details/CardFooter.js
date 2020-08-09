import React from 'react';
import { NavLink } from "react-router-dom";

const cardFooter = (props) => {
    return (
        <div className="card-action">
            <hr/>
                <button className="btn btn-outline-secondary" onClick={props.showDetails}>Show More
                </button>
                &nbsp;
                <NavLink className="btn btn-outline-primary" to={"/stat/active/" + props.id}>Details</NavLink>
        </div>
    )
};

export default cardFooter;

