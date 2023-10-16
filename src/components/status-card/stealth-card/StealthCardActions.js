import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit"
import BoxIcon from '@mui/icons-material/WorkOutline'
import Tooltip from "../../tooltip/Tooltip";

const StyledMenu = ((props) => (
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

export default function CovertCardActions(props) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleGenerateAddress = () => {
        props.handleGenerateAddress();
        handleClose();
    }

    const handleEdit = () => {
        props.handleEdit();
        handleClose();
    }

    const handlePrivateKey = () => {
        handleClose();
        props.handlePrivateKey();
    }


    const gotoPage = () => {
        handleClose()
        navigate(`/stealth/${props.id}/boxes`);
    }

    return (
        <div className="float-right" style={{paddingLeft: "14px"}}>
            <Tooltip title="Show Boxes" arrow>
                <IconButton
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    aria-label="Show boxes"
                    onClick={gotoPage}
                >
                    <BoxIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="" arrow>
                <IconButton
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    aria-label=""
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
                <MenuItem onClick={handleGenerateAddress}>
                    Generate Payment Address
                </MenuItem>
                <MenuItem onClick={handlePrivateKey}>
                    Show PrivateKey
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <EditIcon/> &nbsp;
                    Edit Name
                </MenuItem>
                <MenuItem onClick={gotoPage}>
                    <BoxIcon/> &nbsp;
                    Show Boxes
                </MenuItem>
            </StyledMenu>
        </div>
    );
}
