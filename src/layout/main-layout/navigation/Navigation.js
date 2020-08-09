import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";

// Valid Data COLOR is data-color="purple | azure | green | orange | danger"
// data-background-color: red-white-black
const navigation = (props) => {
    return (
        <div className="sidebar" data-color="orange" data-background-color="black">
            <div className="logo">
                <div className="logo-tim"/>
                <a href="/" className="simple-text logo-normal">
                    Ergo Mixer
                    <span className="version">{props.info.versionMixer}</span>
                </a>
            </div>
            <div className="sidebar-wrapper">
                <ul className="nav">
                    {/*<li className="nav-item">*/}
                    {/*    <NavLink className="nav-link" to="/covert" exact={true}>*/}
                    {/*        <i className="material-icons">compare_arrows</i>*/}
                    {/*        <p>Covert Address</p>*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/mix" exact={true}>
                            <i className="material-icons">compare_arrows</i>
                            <p>Start Mixing</p>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/stat/active">
                            <i className="material-icons">autorenew</i>
                            <p>Active Mixes</p>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/stat/history">
                            <i className="material-icons">history</i>
                            <p>Mixing History</p>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/ring">
                            <i className="material-icons">show_chart</i>
                            <p>Ring Statistics</p>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/settings">
                            <i className="material-icons">settings</i>
                            <p>Configuration</p>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="sidebar-background sidebar-background-5"/>
        </div>
    )
};

const mapStateToProps = state => ({
    info: state.info,
});


export default connect(mapStateToProps)(navigation);
