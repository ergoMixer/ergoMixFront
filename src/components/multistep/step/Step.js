import React from 'react';


const step = (props) => {
    let className = "";
    if(props.active) className += " active";
    if (props.valid) className += " valid";
    return (
        <li className={className} onClick={props.setStep}>{props.title}</li>
    )
};

export default step;
