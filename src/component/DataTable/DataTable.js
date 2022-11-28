import * as React from 'react';
import {
    DataGrid, gridPageCountSelector, gridPageSelector,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter, useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {useState} from "react";
import {LinearProgress, Pagination} from "@mui/material";


function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarQuickFilter
                quickFilterParser={(searchInput) =>
                    searchInput.split(',').map((value) => value.trim())
                }
                quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
                debounceMs={200} // time before applying the new quick filter value
            />
            <GridToolbarExport/>
        </GridToolbarContainer>
    );
}

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


const DataTable = ({
                       rows,
                       columns,
                       loading,
                       sx
                   }) => {

    const [pageSize, setPageSize] = useState(10)

    return (

        <DataGrid
            columns={columns}
            rows={rows}
            loading={loading}
            sx={sx}
            checkboxSelection={true}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 50, 100]}
            components={{Toolbar: CustomToolbar,Pagination: CustomPagination,  LoadingOverlay: LinearProgress,}}

        />
    )
}
export default DataTable