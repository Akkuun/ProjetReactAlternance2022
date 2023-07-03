import * as React from 'react';
import {
    DataGrid, gridFilteredSortedRowIdsSelector, gridPageCountSelector, gridPageSelector,
    GridToolbarContainer,
    GridToolbarExport, GridToolbarExportContainer,
    GridToolbarQuickFilter, gridVisibleColumnFieldsSelector, useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {useState} from "react";
import {LinearProgress, MenuItem, Pagination, Tooltip} from "@mui/material";
import Cookies from "universal-cookie";
import '../../styleComponent/JsonButton.css';
import {useSnackbar} from "notistack";

//object designed to export object
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
    return JSON.stringify(data, null, 2);
};
//function to create a customtoolbar (search bar,export button), which display the number of user recived in hover
function CustomToolbar() {
    const cookies = new Cookies();
    let sizeUser = cookies.get('sizeUser')
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
            <Tooltip title={"users : " + sizeUser} placement="right-end">
                <GridToolbarExportContainer>
                    {/*export feature*/}
                    <GridToolbarExport printOptions={{disableToolbarButton: true}}/>
                    <div className="JsonButton">
                        <JsonExportMenuItem/>
                    </div>

                </GridToolbarExportContainer>
            </Tooltip>
        </GridToolbarContainer>
    );
}
//function design to create a custom pagination
function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}
//Export the date with JSON format
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
//Entries :  rows for the data,columns for labels, loading a boolean to know if all the user are ready to be displayed, sx for object style
//GOAL : display all the entries data in a DataGrid Object
const DataTable = ({
                       rows,
                       columns,
                       loading,
                       sx,
                   }) => {
    //state for the PageSize
    const [pageSize, setPageSize] = useState(13)
    //notification object
    const {enqueueSnackbar} = useSnackbar()
    //double-click on element to copy the value of a box
    const addToClipboard = (content) => {
        navigator.clipboard.writeText(content.value);
        enqueueSnackbar('Added to clipboard !');
    };
    //return a data grid with the passed parameters
    return (
        <DataGrid
            columns={columns}
            rows={rows}
            loading={loading}
            sx={sx}
            checkboxSelection={false}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 50, 100]}
            components={{
                Toolbar: CustomToolbar
                , Pagination: CustomPagination,
                LoadingOverlay: LinearProgress,
            }}
            onCellDoubleClick={addToClipboard}
        />
    )
}
export default DataTable