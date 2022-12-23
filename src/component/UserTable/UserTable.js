import React, {useEffect, useState} from "react"
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {GridActionsCellItem} from "@mui/x-data-grid";
import DataTable from "../DataTable/DataTable"
import {useParams} from "react-router-dom";
import { getTokenAPI,getListOfUser} from "../../services/Api";
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
            <GridActionsCellItem icon={<SendOutlinedIcon/>} label="forcer activation du compte" showInMenu/>,
        ],
        width: 225
    }
// note pour plus tard, go to https://mui.com/material-ui/react-chip/ pour signaler si le mec a son compte validé / bloquer ect ..
];

const userTableStyles = {
    flexGrow: 1,
    height: 850,
    width: '60%',
    marginLeft: '20%',
}

const UserTable = () => {
    //get the current cloud by the cookie
    const {cloud} = useParams();
    const getAllUser = async () => {
        console.log("get all users")
        let tokenResult = await getTokenAPI("user");
        let userListResult =  getListOfUser(tokenResult)
        
        userListResult.then(function (result) {
            const sizeUser = result.data;
            setUsers(sizeUser);
            const cookies = new Cookies();
            cookies.set('sizeUser', sizeUser.length)
            console.log(cookies.get('sizeUser'));
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