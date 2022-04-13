import ProjectModal from "../modal/modal";
import React, { useState } from "react";
import { ReactComponent as YoroiIcon } from '../../assets/icons/yoroi-logo-icon.svg';
import { ReactComponent as NautilusIcon } from '../../assets/icons/nautilus-logo-icon.svg';
import Button from "@material-ui/core/Button";

const getButtonStyle = () => {
    const width = 200;
    const height = 50;
    return {
        width: `${width}px`, height: `${height}px`
    }
}

const WalletSelectionModal = (props) => {
    const [buttonStyle] = useState(getButtonStyle());
    return (
        <ProjectModal close={props.closeModal} show={props.showModal} scroll={'hidden'}>
            <div className="row">
                <div className="col-sm-12 text-center">
                    <Button style={buttonStyle} endIcon={<NautilusIcon/>}
                            className="btn bg-transparent btn-outline-primary m-3"
                            onClick={() => {
                                props.walletCallBack("Nautilus")
                            }}>Nautilus Wallet </Button>
                    <Button style={buttonStyle} endIcon={<YoroiIcon/>}
                            className="btn bg-transparent btn-outline-primary m-3" onClick={() => {
                        props.walletCallBack("Yoroi")
                    }}>Yoroi Wallet </Button>
                </div>
            </div>
        </ProjectModal>)
}

export default WalletSelectionModal;
