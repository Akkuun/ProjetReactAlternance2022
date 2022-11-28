import * as React from 'react';
import axios from "axios";
import {DataGrid} from '@mui/x-data-grid'
import {GridRowsProp} from "@mui/x-data-grid-pro";
import {Component} from "react";
import {GridColDef} from "@mui/x-data-grid-pro";



    const UserTable = ()=> {

        var a;

        const token = async () => {
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
                //console.log(result.data) // "Some User token"
                a = result.data
                console.log(a)
            })



        }

        return (
            <div style={{height: 300, width: '100%'}}>

                <button onClick={token}></button>
            </div>


        )
    }



export default UserTable;