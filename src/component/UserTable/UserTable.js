import React, {useEffect, useState} from "react"
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {GridActionsCellItem} from "@mui/x-data-grid";
import DataTable from "../DataTable/DataTable"
import {useParams} from "react-router-dom";
import { getTokenAPI,getListOfUser} from "../../services/Api";
import Cookies from 'universal-cookie';
// column content of the component
const columns = [
    {field: 'id', headerName: 'A1', width: 250},
    {field: 'name', headerName: 'Name', width: 250},
    {field: 'userName', headerName: 'Mail', width: 305},
    {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
            <GridActionsCellItem icon={<MarkEmailReadOutlinedIcon/>} label="renvoyer mail d'activation" showInMenu/>,
            <GridActionsCellItem icon={<SendOutlinedIcon/>} label="forcer activation du compte" showInMenu/>,
        ],
        width: 225
    }
];

const userTableStyles = {
    flexGrow: 1,
    height: 850,
    width: '60%',
    marginLeft: '20%',
}

const UserTable = () => {
    //get the current cloud by the cookie
    let {cloud} = useParams();
    let cloud_Name =cloud.toUpperCase();
    const getAllUser = async () => {
        let tokenResult = await getTokenAPI("user",cloud_Name);
        let userListResult =  getListOfUser(tokenResult,cloud_Name)
        userListResult.then(function (result) {
            const sizeUser = result.data;
            setUsers(sizeUser);
            const cookies = new Cookies();
            cookies.set('sizeUser', sizeUser.length)
        })
    }
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getAllUser();
    }, []);
    return (
        <DataTable rows={users} columns={columns} loading={!users.length} sx={userTableStyles} />
    )
}


export default UserTable;