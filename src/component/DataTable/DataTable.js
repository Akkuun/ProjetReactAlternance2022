import * as React from 'react';
import {DataGrid, GridToolbarContainer, GridToolbarExport} from '@mui/x-data-grid';
import {useState} from "react";


function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

const DataTable = ({
                       rows,
                       columns,
                       loading,
                       sx
                   }) => {

    const [pageSize,setPageSize] = useState(10)

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
            components={{Toolbar : CustomToolbar}}
        />
    )
}
export default DataTable