import React from 'react';
import {ReactComponent as SwaggerIcon} from './swagger.svg';

const Footer = (props) => {
    return (
        <footer className="footer">
            <div className="container-fluid">
                {/*<nav className="float-left">*/}
                {/*    <ul>*/}
                {/*        <li>*/}
                {/*            <a href="/swagger">*/}
                {/*                <SwaggerIcon/>&nbsp;*/}
                {/*                <span  style={{display: "inline-block", lineHeight: "30px"}}>Swagger</span>*/}
                {/*            </a>*/}
                {/*        </li>*/}
                {/*    </ul>*/}
                {/*</nav>*/}
                <div className="copyright float-right">
                    No Rights Reserved - Use at Your Own Risk &nbsp;&nbsp;
                    <a rel="noopener noreferrer" href="https://github.com/ergoMixer" target="_blank" style={{display: "inline-block"}}>
                        <i className="fa fa-github"/>
                    </a>&nbsp;&nbsp;
                    <a href="/swagger" rel="noopener noreferrer" style={{lineHeight: "0px", verticalAlign: "bottom", display: "inline-block"}}>
                        <SwaggerIcon/>
                    </a>
                    {/*made with <i className="material-icons">favorite</i> for better using Ergo.*/}
                </div>
            </div>
        </footer>
    )
};

export default Footer;
