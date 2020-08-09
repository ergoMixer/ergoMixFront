import React from 'react';

const ChangeCountBtn = props => {
    const act = () => {
        if(props.enabled){
            props.act();
        }
    }
    return (
        <i style={props.enabled ? {cursor: "pointer"} : {}}
           className={props.enabled ? "material-icons text-success" : "material-icons"}
           onClick={act}>{props.children}</i>
    )
};

export default ChangeCountBtn;