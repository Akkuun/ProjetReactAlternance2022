import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";

import {
    DataGrid,
    gridFilteredSortedRowIdsSelector,
    GridToolbarContainer, GridToolbarExport, GridToolbarExportContainer,
    GridToolbarQuickFilter, gridVisibleColumnFieldsSelector, useGridApiContext
} from "@mui/x-data-grid";

import RefreshIcon from "@mui/icons-material/Refresh";
import {Container, MenuItem, Tooltip} from "@mui/material";
import moment from "moment/moment";
import {useReducer, useState} from "react";
import {getDataByDeviceID, getTokenAPI, sendUserConnected} from "../../services/Api";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: '24',
    p: 4,
};

let popupData;


const exportBlob = (blob, filename) => {
    // Save the blob in a json file
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    });
};

//transform data to JSON
const getJson = (apiRef) => {
    // Select rows and columns
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

    // Format the data. Here we only keep the value
    const data = filteredSortedRowIds.map((id) => {
        const row = {};
        visibleColumnsField.forEach((field) => {
            row[field] = apiRef.current.getCellParams(id, field).value;
        });
        return row;
    });

    // Stringify with some indentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
    return JSON.stringify(data, null, 2);
};


const JsonExportMenuItem = (props) => {
    const apiRef = useGridApiContext();

    const {hideMenu} = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = getJson(apiRef);
                const blob = new Blob([jsonString], {
                    type: 'text/json',
                });

                exportBlob(blob, 'List_User.json');

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            JSON
        </MenuItem>
    );
};





const Popup = ({classes, value, row,installation_ID,device_ID,a1}) => {

    const [mapWattsType, setMapWattsType] = useState(row)
    const [, forceUpdate] = useReducer(x => x + 1, 0);




    async function RefreshHandler() {

        let dataRefreshed;


         await sendUserConnected(a1, installation_ID, device_ID);

         let token = await getTokenAPI("device");


         dataRefreshed = await getDataByDeviceID(token, device_ID)
        console.log(row)
        console.log("CAMION")
        console.log(dataRefreshed.data)
      //  setMapWattsType(dataRefreshed.data)
        //forceUpdate();


         let RowUpdated = [];
         let added = 0;
         let newMap = {};
         for (const [key, value] of Object.entries(dataRefreshed.data)) {

             added++;
             RowUpdated.push({
                 id: added,
                 'col1': value.timestamp,
                 'col2': key,
                 'col3': value.value
             })
         }

        setMapWattsType(RowUpdated)
      forceUpdate();


    }


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
    function CustomToolbar() {




        return (
            <GridToolbarContainer>
                {/*search feature*/}
                <GridToolbarQuickFilter

                    quickFilterParser={(searchInput) =>
                        searchInput.split(',').map((value) => value.trim())
                    }
                    quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
                    debounceMs={200} // time before applying the new quick filter value

                />

                <Button onClick={RefreshHandler}>
                    <RefreshIcon/>
                    SEND UC=1
                </Button>
                <GridToolbarExportContainer>
                    {/*export feature*/}
                    <GridToolbarExport printOptions={{disableToolbarButton: true}}/>
                    <div className="JsonButton">
                        <JsonExportMenuItem/>
                    </div>

                </GridToolbarExportContainer>
            </GridToolbarContainer>
        )

    }


    return (
        <div style={{height: "60%"}}>

            <IconButton onClick={handleOpenPopupComponent}> <InfoIcon/> </IconButton>
            <Modal
                open={openPopupComponent}
                onClose={handleClosePopupComponent}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/*component stats*/}
                    <Container sx={{height: "90%"}}>
                        <DataGrid rows={mapWattsType} columns={columns} components={{Toolbar: CustomToolbar}}/>
                    </Container>
                </Box>
            </Modal>
        </div>
    );
}
export default Popup;