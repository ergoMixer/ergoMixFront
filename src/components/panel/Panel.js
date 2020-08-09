import React from 'react';

const Panel = props => {
    return (
        <div className={props.cardClass ? "card " + props.cardClass : "card"} onClick={props.onClick}>
            <div className={props.bodyClass ? "card-body " + props.bodyClass : "card-body"}>
                {props.children}
            </div>
        </div>
    )
};

export default Panel;