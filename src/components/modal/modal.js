import React from 'react';
// import { useClasses } from '../../hoc/useClasses';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

// function getModalStyle() {
//     const top = 50;
//     const left = 50;

//     return {
//         top: `${top}%`,
//         left: `${left}%`,
//         transform: `translate(-${top}%, -${left}%)`,
//     };
// }

// const styles = theme => ({
//     paper: {
//         position: 'relative',
//         maxWidth: 800,
//         width: "90%",
//         backgroundColor: theme.palette.background.paper,
//         borderRadius: '5px',
//         boxShadow: theme.shadows[5],
//         padding: theme.spacing(2, 4, 3),
//     },
//     container: (props)=>({
//         maxHeight: "80vh",
//         overflowY: (props.scroll === undefined ? 'scroll' : props.scroll),
//         overflowX: "hidden"
//     }),
//     closeBtn: {
//         position: "absolute",
//         borderRadius: "50%",
//         width: "40px",
//         height: "40px",
//         textAlign: "center",
//         display: "block",
//         right: "-15px",
//         top: "-15px",
//         backgroundColor: "#fff",
//         color: "#999999",
//         lineHeight: "40px",
//         fontSize: "20px",
//         cursor: "pointer",
//         zIndex: "100",
//         boxShadow: "0 14px 26px -12px rgba(153, 153, 153, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(153, 153, 153, 0.2)"
//     }
// });

const ProjectModal = (props) => {
    // const classes = useStyles(props);
    // const classes = useClasses(styles);
    // getModalStyle is not a pure function, we roll the style only on the first render
    // const [modalStyle] = React.useState(getModalStyle);
    // const modalCopy = props.padding ? {...modalStyle, padding: 0} : {...modalStyle};

    const top = 50;
    const left = 50;
    const paperStyles = {
        position: 'relative',
        maxWidth: 800,
        width: "90%",
        backgroundColor: 'paper',
        borderRadius: '5px',
        boxShadow: 5,
        padding: props.padding || [2, 4, 3],
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };

    const containerStyles = {
        maxHeight: "80vh",
        overflowY: (props.scroll === undefined ? 'scroll' : props.scroll),
        overflowX: "hidden"
    };

    const closeBtnStyles = {
        position: "absolute",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        textAlign: "center",
        display: "block",
        right: "-15px",
        top: "-15px",
        backgroundColor: "#fff",
        color: "#999999",
        lineHeight: "40px",
        fontSize: "20px",
        cursor: "pointer",
        zIndex: "100",
        boxShadow: "0 14px 26px -12px rgba(153, 153, 153, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(153, 153, 153, 0.2)"
    };

    return props.show ? (
        <Modal
            open={true}
            onClose={props.close}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <Paper sx={paperStyles}>
                <div style={closeBtnStyles} onClick={props.close}>
                    <i className="fa fa-times"/>
                </div>
                <Container sx={containerStyles}>
                    {props.children}
                </Container>
            </Paper>
        </Modal>
    ) : null;
}
export default ProjectModal;