import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    components: {
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0,0,0,0.0)',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.0)'
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(0,0,0,0.0)'
                    }
                },
            },
        },
    },
});

class App extends React.Component {
    componentDidMount = () => {
        this.props.getSupportedToken();
        this.props.getMixLevel();
        this.props.getRings();
        this.props.getInfo();
    };

    render = () => {
        return (
          <ThemeProvider theme={theme}>
            <BrowserRouter basename={"/dashboard/"}>
                <NotificationContainer/>
                <Routes>
                <Route path="/index.html" element={(<Navigate to="/" replace={true} />)} />
                    <Route path="/mix/history/:groupId" element={<StatDetail path='history'/>}/>
                    <Route path="/mix/history" element={<Stat />}/>
                    <Route path="/mix/active/new" element={<Mix />}/>
                    <Route path="/mix/active/:groupId" element={<StatDetail path='active'/>}/>
                    <Route path="/mix/active" element={<ActiveStat />}/>
                    <Route path="/ring" element={<Ring />}/>
                    <Route path="/settings" element={<Settings />}/>
                    <Route path="/covert/new" element={<NewCovert />}/>
                    <Route path="/covert/:covertId/asset/:assetId/ring/:oldRing" element={<CovertSetRing />}/>
                    <Route path="/covert/:covertId/asset/ring/:oldRing" element={<CovertSetRing />}/>
                    <Route path="/covert/:covertId/asset/" element={<CovertAsset />}/>
                    <Route path="/covert/:covertId/address/" element={<CovertAddress />}/>
                    <Route path="/covert/:covertId/" element={<StatDetail path='covert'/>}/>
                    <Route path="/covert" element={<CovertList />}/>
                    <Route path="/shutdown" element={<Shutdown />}/>
                    <Route element={(<Home/>)} index={true} />
                </Routes>
            </BrowserRouter>
          </ThemeProvider>
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
