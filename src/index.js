import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './assets/material-dashboard.scss';
// import 'material-icons/iconfont/material-icons.scss'
import 'font-awesome/css/font-awesome.css'
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { store } from './store';
import { Provider } from 'react-redux';

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
