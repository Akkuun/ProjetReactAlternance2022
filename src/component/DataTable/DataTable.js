import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({ rows,columns,loading}) => {

    return(
        
        <DataGrid columns={columns} rows={rows} loading={loading}/>
    )
}
export default DataTable