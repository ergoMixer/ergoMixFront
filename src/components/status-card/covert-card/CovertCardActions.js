import React from 'react';
import { withStyles } from '@mui/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import MoreVertIcon from "@mui/icons-material/MoreVert";
import HistoryIcon from "@mui/icons-material/History"
import EditIcon from "@mui/icons-material/Edit"
import Tooltip from "../../tooltip/Tooltip";


const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

export default function CustomizedMenus(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleClose();
        props.handleEdit();
    }

    const handlePrivateKey = () => {
        handleClose();
        props.handlePrivateKey();
    }

    const handleWithdrawAllAssets = () => {
        handleClose();
        props.handleWithdraw();
    }

    const handleAllAssets = () => {
        handleClose()
        history.push('/covert/' + props.id + '/asset');
    }

    const handleEditAddress = () => {
        handleClose()
        history.push("/covert/" + props.id + '/address');
    }

    const handleHistory = () => {
        handleClose()
        history.push('/covert/' + props.id + '/');
    }

    return (
        <div className="float-right" style={{paddingLeft: "14px"}}>
            <Tooltip title="History" arrow>
                <IconButton
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    aria-label="History"
                    onClick={handleHistory}
                >
                    <HistoryIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="More" arrow>
                <IconButton
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    aria-label="more"
                    onClick={handleClick}
                >
                    <MoreVertIcon/>
                </IconButton>
            </Tooltip>

            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleAllAssets}>
                    All Assets
                </MenuItem>
                <MenuItem onClick={handleEditAddress}>
                    Edit Addresses
                </MenuItem>
                <MenuItem onClick={handlePrivateKey}>
                    Show PrivateKey
                </MenuItem>
                {props.showWithdrawAssets ? (
                    <MenuItem onClick={handleWithdrawAllAssets}>
                        Withdraw All Assets
                    </MenuItem>
                ) : null}
                <MenuItem onClick={handleHistory}>
                    <HistoryIcon/> &nbsp;
                    History
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <EditIcon/> &nbsp;
                    Edit Name
                </MenuItem>
            </StyledMenu>
        </div>
    );
}
