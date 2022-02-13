import * as React from 'react';
import { Tooltip } from "@material-ui/core";
import * as formatter from "../../formatter/formatters";


const DataTable = (props)  => {
    const updateRows = (index) => {
        if(props.selectedRows.indexOf(index) >= 0){
            props.rowsUpdateCallBack(props.selectedRows.filter(item => item !== index));
        }else{
            props.rowsUpdateCallBack([...props.selectedRows].concat([index]))
        }
    }
    const allChecked = Array(props.rows.length).fill("").filter((item, index) => props.selectedRows.indexOf(index) >= 0).length
    const changeAllChecked = () => {
        if(allChecked) {
            props.rowsUpdateCallBack([])
        }else{
            props.rowsUpdateCallBack(Array(props.rows.length).fill("").map((item, index)=> index));
        }
    }
    return (
        <div style={{height: 300, width: '100%'}}>
            <div className="table-responsive">
                <table className="table">
                    <thead className=" text-primary">
                    <tr>
                        <th><input type="checkbox" checked={allChecked} onChange={changeAllChecked}/></th>
                        <th>Token Name</th>
                        <th>Token ID</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input type="checkbox" checked={props.selectedRows.indexOf(index) >= 0} onChange={() => updateRows(index)}/>
                            </td>
                            <td>{row.tokenName}</td>
                            <td>
                                <Tooltip title={row.tokenId}>
                                    <div>{formatter.id(row.tokenId, 20)}</div>
                                </Tooltip>
                            </td>
                            <td>{row.value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
