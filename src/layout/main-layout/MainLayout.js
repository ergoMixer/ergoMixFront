import React from 'react';
import Navigation from './navigation/Navigation';
import Footer from './footer/Footer';
import Toggle from './toggle/Toggle';
import { changeSidebar } from "../../store/action";
import { connect } from "react-redux";

class MainLayout extends React.Component {
    state = {
        navigationOpen: false
    };

    toggleSidebar = () => {
        this.props.toggleSidebar();
    };

    toggleNavigation = () => {
        this.setState(state => {
            return {...state, navigationOpen: !state.navigationOpen};
        });
    };

    render = () => {
        let className = this.props.sidebarMini ? "sidebar-mini " : "";
        className += this.state.navigationOpen ? "nav-open" : "";
        return (
            <div className={className}>
                <div className="wrapper">
                    <Navigation/>
                    <div className="main-panel">
                        <Toggle
                            toggleNavigation={this.toggleNavigation}
                            toggleSidebar={this.toggleSidebar}
                            navigationOpen={this.state.navigationOpen}
                            create={this.props.create}
                        />
                        <div className="content">
                            <div className="container-fluid">
                                {this.props.children}
                            </div>
                        </div>
                        <Footer/>
                        <div onClick={this.toggleNavigation}
                             className={"close-layer " + (this.state.navigationOpen ? "visible" : "")}/>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    sidebarMini: state.sidebarMini,
});

const mapDispatchToProps = dispatch => {
    return {
        toggleSidebar: () => dispatch(changeSidebar())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
