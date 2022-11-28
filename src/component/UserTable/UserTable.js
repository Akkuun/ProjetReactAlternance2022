import React, {useEffect, useState} from "react"
import DataTable from "../DataTable/DataTable"
import axios from "axios";
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {GridActionsCellItem} from "@mui/x-data-grid";
const columns = [
    {field: 'id', headerName: 'User ID', width: 150},
    {field: 'name', headerName: 'Name', width: 150},
    {field: 'userName', headerName: 'User name', width: 150},
    {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
            <GridActionsCellItem icon={<MarkEmailReadOutlinedIcon/>} label="renvoyer mail d'activation" showInMenu/>,
            <GridActionsCellItem icon={<SendOutlinedIcon/>}  label="forcer activation du compte"  showInMenu />,
        ]
    }

];

const userTableStyles = {
flexGrow : 1,
    height: 800,
    width: '40%',


}


const UserTable = () => {

    const getAllUser = async () => {
        let tokenResult = await axios.post("https://visionsystem2-identity-dev.azurewebsites.net/connect/token", {
            'grant_type': 'client_credentials',
            'scope': 'https://visionsystem2.com/tou/user_impersonation https://visionsystem2.com/schemas/user_impersonation https://visionsystem2.com/iotmanagement/user_impersonation https://visionsystem2.com/identity/user_impersonation https://visionsystem2.com/firmware/user_impersonation https://visionsystem2.com/businessmodule/user_impersonation',
            'client_id': '428d5523-cb72-47ef-8602-8a63a8836d68',
            'client_secret': '4040ABD71CA1FA1F268A38E825E3E3158577330F70F19A1913C3571A8FD5E58A'
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        let userListResult = axios.get("https://visionsystem2-identity-dev.azurewebsites.net/api/v1.0/Users", {
            headers: {
                'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': ''
            }
        })
        userListResult.then(function (result) {
            const toto = result.data;
            console.log(toto)
            setUsers(toto);
        })
    }

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUser();


    }, []);

    return (

        <DataTable rows={users} columns={columns} loading={!users.length} sx={userTableStyles}/>

    )

}



export default UserTable;