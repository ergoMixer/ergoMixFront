import React from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon  from '@mui/icons-material/IndeterminateCheckBox'

class CheckboxesTags extends React.Component {
    icon = <CheckBoxOutlineBlankIcon fontSize="small" color="action"/>;
    checkedIcon = <CheckBoxIcon fontSize="small" color="secondary"/>;
    IndeterminateCheckBoxIcon  = <IndeterminateCheckBoxIcon fontSize="small" color="action"/>;
    state = {
        options: [],
        open: false,
        selectedIndex: 0,
    };

    anchorRef = React.createRef();


    handleMenuItemClick = (event, index) => {
        this.props.onClick(index);
        this.setState({selectedIndex: index, open: false});
    };

    handleToggle = () => {
        this.setState({open: !this.state.open});
    };

    handleClose = event => {
        if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
            return;
        }

        this.setState({open: false});
    };
    getPlacement = () => {
        return "bottom-" + (this.props.placeLeft ? "end" : "start")
    }

    render() {
        return (
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12}>
                    <ButtonGroup variant="outlined"  ref={this.anchorRef} aria-label="split button">
                        <Checkbox
                        indeterminate={this.props.indeterminate}
                        icon={this.icon}
                        checkedIcon={this.checkedIcon}
                        indeterminateIcon={this.IndeterminateCheckBoxIcon}
                        style={{ marginLeft:20, padding: 0, border: 0 , minWidth: 0}}
                        checked={this.props.checked}
                        onChange={event => this.props.onChange(event)}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <Button
                            size="small"
                            aria-controls={this.state.open ? 'split-button-menu' : undefined}
                            aria-expanded={this.state.open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            style={{ border: 0, padding: 0, marginLeft: 0, minWidth: 0 }}
                            color={"inherit"}
                            onClick={this.handleToggle}
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>
                    <Popper open={this.state.open} placement={this.getPlacement()} anchorEl={this.anchorRef.current} role={undefined} transition>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={this.handleClose}>
                                        <MenuList id="simple-menu">
                                            {this.props.options.map((option, index) => (
                                                <MenuItem
                                                    key={option.title}
                                                    selected={index === this.state.selectedIndex}
                                                    onClick={(event) => this.handleMenuItemClick(event, index)}
                                                >
                                                    {option.title}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </Grid>
        );
    };
}

export default CheckboxesTags;
