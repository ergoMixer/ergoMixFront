import React from 'react';
import Panel from "../../../../components/panel/Panel";
import LoadFromJson from "../../../../components/load-from-json/LoadFromJson";
import LoadFromNode from "../../../../components/load-from-node/LoadFromNode";
import SettingsEthernet from "@mui/icons-material/SettingsEthernet";
import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";
import Cloud from "@mui/icons-material/Cloud";
import ExitToApp from "@mui/icons-material/ExitToApp";
import LoadFromWallet from "../../../../components/load-from-wallet/LoadFromWallet";

const CovertStep3 = props => {
    const setValid = (fillingType, addresses) => {
        if (fillingType === "later" || addresses.length !== 0) {
            props.setValid(true)
        } else {
            props.setValid(false);
        }
    }

    const setFillingType = value => {
        props.saveValue({fillingType: value});
        setValid(value, props.addresses)
    }

    const deleteRow = (index) => {
        let tmpAddresses = [...props.addresses];
        tmpAddresses.splice(index, 1);
        props.saveValue({addresses: tmpAddresses});
    }

    const addRow = () => {
        props.saveValue({addresses: [...props.addresses, '']});
    }

    const saveAddress = (index, address) => {
        let tmpAddresses = [...props.addresses];
        if (index < props.addresses.length && index !== -1) {
            tmpAddresses[index] = address
        } else {
            tmpAddresses.push(address);
        }
        props.saveValue({addresses: tmpAddresses})
        setValid(props.fillingType, tmpAddresses);
    }

    setValid(props.fillingType, props.addresses)
    return (
        <div className="row">
            <div className="col-12 text-center">
                <Panel>
                    <h4>
                        When a new mix starts for this covert address, its withdraw address will
                        be selected randomly from the list of addresses you specify here.
                        You can change this list later and also leave it empty and withdraw manually. <br/>
                        Since these addresses will be reused randomly, the more addresses you provide, the better the
                        security gains.
                    </h4>
                </Panel>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="card-header card-header-tabs card-header-primary">
                        <div className="nav-tabs-navigation">
                            <div className="nav-tabs-wrapper">
                                <ul className="nav nav-tabs" data-tabs="tabs">
                                    <li className="nav-item">
                                        <a className={props.fillingType === "json" ? "nav-link active" : "nav-link"}
                                           onClick={() => setFillingType("json")}>
                                            <i className="material-icons"><SettingsEthernet /></i> Using Json
                                            <div className="ripple-container"/>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={props.fillingType === "node" ? "nav-link active" : "nav-link"}
                                           onClick={() => setFillingType("node")}>
                                            <i className="material-icons"><Cloud /></i> Using a Node
                                            <div className="ripple-container"/>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={props.fillingType === "dapp" ? "nav-link active" : "nav-link"}
                                           onClick={() => setFillingType("dapp")}>
                                            <i className="material-icons" style={{color: "white"}}><ExitToApp /></i> Using
                                            Dapp Connector
                                            <div className="ripple-container"/>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={props.fillingType === "later" ? "nav-link active" : "nav-link"}
                                           onClick={() => setFillingType("later")}>
                                            <i className="material-icons"><ArrowRightAlt /></i> Set later
                                            <div className="ripple-container"/>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row"
                             style={props.fillingType === 'manual' ? {} : {"display": 'none'}}>
                            <div className="col-12 pb-2">
                                You can set any of withdraw addresses now and leave others empty.
                            </div>
                        </div>
                        <div style={{"display": props.fillingType === 'json' ? 'block' : 'none'}}>
                            <LoadFromJson saveAddresses={addresses => props.saveValue({addresses: [...addresses]})}/>
                        </div>
                        <div className="row" style={props.fillingType === 'node' ? {} : {"display": 'none'}}>
                            <LoadFromNode
                                manualCount={true}
                                setAddress={addresses => props.saveValue({addresses: [...addresses]})}/>
                        </div>
                        <div className="row" style={props.fillingType === 'dapp' ? {} : {"display": 'none'}}>
                            <LoadFromWallet
                                manualCount={true}
                                setAddress={addresses => props.saveValue({addresses: [...addresses]})}/>
                        </div>
                        {props.fillingType === "later" ? (
                            <div className="col-12">
                                You can withdraw manually or add addresses later.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className=" text-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Withdraw Address</th>
                                        <th style={{width: "100px"}}></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {props.addresses.map((address, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <input className={"form-control"}
                                                       value={address}
                                                       onChange={(event) => saveAddress(index, event.target.value)}/>
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-primary"
                                                        onClick={() => deleteRow(index)}>
                                                    <i className="fa fa-trash"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="row">
                            {
                                props.fillingType !== "later" ?
                                    <button className="btn btn-outline-primary"
                                            onClick={addRow}>Add Row
                                    </button>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CovertStep3;