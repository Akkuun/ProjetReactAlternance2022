import * as React from 'react';
import {useReducer, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import {
    DataGrid,
    gridFilteredSortedRowIdsSelector,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarExportContainer,
    GridToolbarQuickFilter,
    gridVisibleColumnFieldsSelector,
    useGridApiContext
} from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import {Container, MenuItem, Tooltip} from "@mui/material";
import moment from "moment/moment";
import {getDataByDeviceID, getTokenAPI, sendUserConnected} from "../../services/Api";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
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
//export object
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
const Popup = ({row, installation_ID, device_ID, a1, mode}) => {
    //we must put again this parameter, because is null passed in props and we can't put it ahead of the document
    let {cloud} = useParams();
    let cloud_Name =cloud.toUpperCase();
    //Data state
    const [mapWattsType, setMapWattsType] = useState(row)
    //refresh component refresh
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    //notification object
    const {enqueueSnackbar} = useSnackbar();
    //state for the opening of the datagrid, if the mode selected is MAC we display the component, or we hide it
    const [openPopupComponent, setOpenPopupComponent] = React.useState(setOpenComponentByMode);
    //function designed to send a request to refresh the current data, so we send UC=1 and read the data received
    async function RefreshHandler() {
        let dataRefreshed;
        await sendUserConnected(a1, installation_ID, device_ID,cloud_Name);
        let token = await getTokenAPI("device",cloud_Name);
        dataRefreshed = await getDataByDeviceID(token, device_ID,cloud_Name)
        let RowUpdated = [];
        let added = 0;
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
        enqueueSnackbar('Data refreshed !');
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
    //double lick on a element to copy to clipboard
    const addToClipboard = (content) => {
        navigator.clipboard.writeText(content.value);
        enqueueSnackbar('Added to clipboard !');
    };
    const handleOpenPopupComponent = () => {
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

    function setOpenComponentByMode() {
        return mode === "MAC";
    }
    return (
        <div style={{height: "60%"}}>
            {mode === "MAC" ? <div></div> : <IconButton  onClick={handleOpenPopupComponent}> <InfoIcon sx={{height:"15%",width:"15%"}}/> </IconButton>}
            <Modal
                open={openPopupComponent}
                onClose={handleClosePopupComponent}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/*component stats*/}
                    <Container sx={{height: "90%"}}>
                        <DataGrid rows={mapWattsType} columns={columns} components={{Toolbar: CustomToolbar}}
                                  onCellDoubleClick={addToClipboard}/>
                    </Container>
                </Box>
            </Modal>
        </div>
    );
}
export default Popup;