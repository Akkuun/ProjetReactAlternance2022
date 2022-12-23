import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AssessmentIcon from "@mui/icons-material/Assessment";
import PageStatistics from "../PageStatistics";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height:'375px',
    bgcolor: 'background.paper',
    'border-radius': '10px',
    boxShadow: '24',
    p: 4,
};

let popupData;

const Popup = ({classes,value})=> {
    const [openPopupComponent, setOpenPopupComponent] = React.useState(false);
    const handleOpenPopupComponent = () => {
        if (classes==="popupData"){
            console.log(value)
            popupData = value;
        }
        setOpenPopupComponent(true)
    };
    const handleClosePopupComponent = () => {
        setOpenPopupComponent(false);
    }

    return (
        <div>
            <Button onClick={handleOpenPopupComponent}>   <AssessmentIcon/> </Button>
            <Modal
                open={openPopupComponent}
                onClose={handleClosePopupComponent}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/*component stats*/}
                    <PageStatistics classes="popupData" value={popupData}/>
                </Box>
            </Modal>
        </div>
    );
}
export default Popup;