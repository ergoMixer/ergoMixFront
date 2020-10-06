import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { ApiNetwork } from "../../../network/api";

// Valid Data COLOR is data-color="purple | azure | green | orange | danger"
// data-background-color: red-white-black
const MENU_ITEMS = [
    {url: '/mix/active', exact: false, title: 'Active Mixes', icon: 'compare_arrows', iconClass:'material-icons'},
    {url: '/mix/history', exact: false, title: 'Mixing History', icon: 'history', iconClass:'material-icons'},
    // {url: '/covert/new', exact: true, title: 'Create Covert Address', icon: 'call_split', iconClass:'material-icons'},
    {url: '/covert/', exact: false, title: 'Covert Address', icon: 'call_split', iconClass:'material-icons'},
    {url: '/ring', exact: true, title: 'Ring Statistics', icon: 'show_chart', iconClass:'material-icons'},
    {url: '/settings', exact: true, title: 'Configuration', icon: 'settings', iconClass:'material-icons'},
    {url: '/', exact: true, title: 'About', icon: 'info_outline', iconClass:'material-icons'},
    {url: '/shutdown', exact: true, title: 'Shutdown', icon: 'power_settings_new', iconClass:'material-icons'},
]
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
                    {MENU_ITEMS.map((item, index) => (
                        <li className="nav-item" key={index}>
                            <NavLink className="nav-link" to={item.url} exact={item.exact}>
                                <i className={item.iconClass}>{item.icon}</i>
                                <p>{item.title}</p>
                            </NavLink>
                        </li>
                    ))}
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
