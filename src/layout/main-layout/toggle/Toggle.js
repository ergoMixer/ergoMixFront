import React from 'react';


const toggle = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
            <div className="container-fluid">
                <div className="navbar-wrapper">
                    <div className="navbar-minimize">
                        <button id="minimizeSidebar"
                                onClick={props.toggleSidebar}
                                className="btn btn-just-icon btn-white btn-fab btn-round">
                            <i className="material-icons text_align-center visible-on-sidebar-regular">more_vert</i>
                            <i className="material-icons design_bullet-list-67 visible-on-sidebar-mini">view_list</i>
                            <div className="ripple-container"/>
                        </button>
                    </div>
                </div>
                <button className={props.navigationOpen ? "navbar-toggler toggled": "navbar-toggler"} type="button" data-toggle="collapse"
                        onClick={props.toggleNavigation}
                        aria-controls="navigation-index" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="navbar-toggler-icon icon-bar"/>
                    <span className="navbar-toggler-icon icon-bar"/>
                    <span className="navbar-toggler-icon icon-bar"/>
                </button>
            </div>
        </nav>
    )
};

export default toggle;
