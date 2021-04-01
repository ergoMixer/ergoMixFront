import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Mix from "../pages/mix/Mix";
import Ring from "../pages/ring/Ring";
import Stat from '../pages/stat/Stat';
import StatDetail from "../pages/stat/stat_detail/StatDetail";
import { loadInfoAsync, loadMixLevelAsync, loadRingsAsync, loadSupportedTokensAsync } from "../store/action";
import 'react-notifications/lib/notifications.css';
import './App.css';
import { connect } from "react-redux";
import { NotificationContainer } from 'react-notifications';
import ActiveStat from "../pages/stat/active/ActiveStat";
import Settings from "../pages/settings/Settings";
import CovertList from "../pages/covert/covert-list/CovertList";
import NewCovert from "../pages/covert/new-covert/NewCovert";
import Home from "../pages/home/Home";
import CovertAsset from "../pages/covert/covert-list/covert-assets/CovertAsset";
import CovertSetRing from "../pages/covert/covert-list/covert-assets/set-ring/CovertSetRing";
import CovertAddress from "../pages/covert/covert-list/covert-address/CovertAddress";
import Shutdown from "../pages/shutdown/Shutdown";

class App extends React.Component {
    componentDidMount = () => {
        this.props.getSupportedToken();
        this.props.getMixLevel();
        this.props.getRings();
        this.props.getInfo();
    };

    render = () => {
        return (
            <BrowserRouter basename={"dashboard"}>
                <NotificationContainer/>
                <Switch>
                    <Route path="/mix/history/:groupId" component={(props) => <StatDetail {...props} path='history'/>}/>
                    <Route path="/mix/history" component={Stat}/>
                    <Route path="/mix/active/new" component={Mix}/>
                    <Route path="/mix/active/:groupId" component={(props) => <StatDetail {...props} path='active'/>}/>
                    <Route path="/mix/active" component={ActiveStat}/>
                    <Route path="/ring" component={Ring}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/covert/new" component={NewCovert}/>
                    <Route path="/covert/:covertId/asset/:assetId/ring/:oldRing" component={CovertSetRing}/>
                    <Route path="/covert/:covertId/asset/ring/:oldRing" component={CovertSetRing}/>
                    <Route path="/covert/:covertId/asset/" component={CovertAsset}/>
                    <Route path="/covert/:covertId/address/" component={CovertAddress}/>
                    <Route path="/covert/:covertId/" component={(props) => <StatDetail {...props} path='covert'/>}/>
                    <Route path="/covert" component={CovertList}/>
                    <Route path="/shutdown" component={Shutdown}/>
                    <Route path="/" component={Home} exact={true}/>
                    <Redirect to="/"/>
                </Switch>
            </BrowserRouter>
        )
    };
}

const mapStateToProps = () => ({});


const mapDispatchToProps = dispatch => {
    return {
        getSupportedToken: () => dispatch(loadSupportedTokensAsync()),
        getMixLevel: () => dispatch(loadMixLevelAsync()),
        getRings: () => dispatch(loadRingsAsync()),
        getInfo: () => dispatch(loadInfoAsync()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
