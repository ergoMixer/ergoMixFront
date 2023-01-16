import React from 'react';
import { NavLink } from "react-router-dom";

const cardFooter = (props) => {
    return (
        <>
            <hr style={{margin: 0}}/>
            <div className="card-action">
                <button className="btn btn-outline-secondary" onClick={props.showDetails}>Show More</button>
                <NavLink className="btn btn-outline-primary" to={"/mix/active/" + props.id}>Details</NavLink>
            </div>
        </>
    )
};

export default cardFooter;

