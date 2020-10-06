import React from 'react';
import { NavLink } from "react-router-dom";

const SinglePath = props => {
    if (props.url) {
        return <NavLink to={props.url}>{props.title}</NavLink>
    }
    return <span>{props.title}</span>
}

const Breadcrumb = props => {
    return (
        <div className="col-12">
            {props.path.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 ? " / " : null}
                    <SinglePath {...item}/>
                </React.Fragment>
            ))}
        </div>
    )
};

export default Breadcrumb;