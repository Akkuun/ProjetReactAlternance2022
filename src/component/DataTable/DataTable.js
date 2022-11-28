import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {useState} from "react";

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

        />
    )
}
export default DataTable