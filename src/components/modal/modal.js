import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        maxWidth: 800,
        overflowX: "scroll",
        width: "90%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: '5px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const ProjectModal = (props) => {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const open = () => {

    }

    return props.show ? (
        <Modal
            open={open}
            onClose={props.close}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div style={modalStyle} className={classes.paper}>
                {props.children}
            </div>
        </Modal>
    ) : null;
}
export default ProjectModal;