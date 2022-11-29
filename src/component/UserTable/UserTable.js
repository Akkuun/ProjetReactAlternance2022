import React, {useEffect, useState} from "react"
import DataTable from "../DataTable/DataTable"
import axios from "axios";
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {GridActionsCellItem} from "@mui/x-data-grid";
import Cookies from 'universal-cookie';

const columns = [
    {field: 'id', headerName: 'A1', width: 250},
    {field: 'name', headerName: 'Name', width: 250},
    {field: 'userName', headerName: 'Mail', width: 305},
    {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
            <GridActionsCellItem icon={<MarkEmailReadOutlinedIcon/>} label="renvoyer mail d'activation" showInMenu/>,
            <GridActionsCellItem icon={<SendOutlinedIcon/>}  label="forcer activation du compte"  showInMenu />,
        ],
        width: 225
    }
// note pour plus tard, go to https://mui.com/material-ui/react-chip/ pour signaler si le mec a son compte validé / bloquer ect ..
];

const userTableStyles = {
flexGrow : 1,
    height: 850,
    width: '60%',
marginLeft : '20%',

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
            setUsers(toto);
            const cookies = new Cookies();
            cookies.set('sizeUser',toto.length)
            console.log(cookies.get('sizeUser'));
        })
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
        getAllUser();
    }, []);

    return (

        <DataTable rows={users} columns={columns} loading={!users.length} sx={userTableStyles}    />

    )

}



export default UserTable;