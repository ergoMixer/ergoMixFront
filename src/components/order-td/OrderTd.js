import React from 'react';


const orderTd = props => {
    var angleClass = props.orderDir === "asc" ? "fa fa-caret-down" : "fa fa-caret-up";
    return (
        <th
            style={{cursor: "pointer"}}
            onClick={() => props.setOrder(props.itemKey)}>
            {props.itemLabel} &nbsp;
            {props.order === props.itemKey ? (
                <i className={angleClass}/>
            ) : null}
        </th>
    )
}


export default orderTd;