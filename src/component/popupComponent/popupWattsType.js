import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AssessmentIcon from "@mui/icons-material/Assessment";
import PageStatistics from "../PageStatistics";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import {DataGrid, GridToolbarContainer, GridToolbarQuickFilter} from "@mui/x-data-grid";
import LoadingButton from "@mui/lab/LoadingButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import {Container, Tooltip} from "@mui/material";
import moment from "moment/moment";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'background.paper',
    'border-radius': '10px',
    boxShadow: '24',
    p: 4,
};

let popupData;

function CustomToolbar() {
    const [loading, setLoading] = React.useState(false);

    const handleClick = () => {

        setLoading(!loading);


        for (let i = 0; i < 150; i++) {
            console.log("tototo")
        }

        setLoading(!loading);


    }


    return (
        <GridToolbarContainer>
            {/*search feature*/}
            <GridToolbarQuickFilter onBlur={handleClick}

                                    quickFilterParser={(searchInput) =>
                                        searchInput.split(',').map((value) => value.trim())
                                    }
                                    quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
                                    debounceMs={200} // time before applying the new quick filter value

            />


            <LoadingButton
                loading={loading}
                onClick={() => {
                    setLoading(!loading);
                    for (let i = 0; i < 150; i++) {
                        console.log("tototo")
                    }
                    setLoading(!loading);
                }}
                endIcon={<RefreshIcon/>}
                loadingPosition="end"
                variant="text"
            >
                SEND UC=1
            </LoadingButton>
        </GridToolbarContainer>
    )
}




const Popup = ({classes, value, row}) => {
    const columns: GridColDef[] = [
        {
            field: 'col1',
            headerName: 'Last Updated',
            width: 150,
            //hover effect on Last Updated -> timestamp conversion
            renderCell: (params: any) => (
                <Tooltip title={moment.unix(params.value).format("YYYY-MM-DD HH:mm:ss")}>
                    <span className="table-cell-trucate">{params.value}</span>
                </Tooltip>
            ),
        },
        {field: 'col2', headerName: 'Value', width: 150},
        {field: 'col3', headerName: 'WattsType', width: 400},

    ];





    const [openPopupComponent, setOpenPopupComponent] = React.useState(false);
    const handleOpenPopupComponent = () => {
        if (classes === "popupData") {
            popupData = value;
        }
        setOpenPopupComponent(true)
    };
    const handleClosePopupComponent = () => {
        setOpenPopupComponent(false);
    }


    return (
        <div style={{height:"60%"}}>

            <IconButton onClick={handleOpenPopupComponent}> <InfoIcon/> </IconButton>
            <Modal
                open={openPopupComponent}
                onClose={handleClosePopupComponent}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/*component stats*/}
                    <Container sx={{height:"90%",borderStyle: "solid", borderColor: "red",}}>
                        <DataGrid rows={row} columns={columns} components={{Toolbar: CustomToolbar}}/>
                    </Container>
                </Box>
            </Modal>
        </div>
    );
}
export default Popup;