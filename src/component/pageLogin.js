import React, {useState} from 'react';
import axios from "axios";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";

const PageLogin = ({classes, value}) => {
    const [mailInput, setMailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    
    let navigate = useNavigate();
    localStorage.clear();
    
    async function getToken() {
        let tokenResult = await axios.post("https://visionsystem2-identity-dev.azurewebsites.net/connect/token", {
            'grant_type': 'password',
            'scope': 'Commissionings.Read Commissionings.Write DataProcessing.Read DataProcessing.Write Device.Read Device.Write Firmware.Read Firmware.Write HistoricalData.Read HistoricalData.Write https://visionsystem2.com/businessmodule/user_impersonation https://visionsystem2.com/dataprocessing/user_impersonation https://visionsystem2.com/identity/user_impersonation https://visionsystem2.com/iotmanagement/user_impersonation https://visionsystem2.com/operations/user_impersonation https://visionsystem2.com/tou/user_impersonation Installation.Read Installation.Write IOTManagement.Read IOTManagement.Write openid profile Room.Read Room.Write Schema.Read Schema.Write TermOfUse.Read TermOfUse.Write',
            'client_id': 'f7065c95-6c66-4225-b4a1-c8fae2e3ead5',
            'client_secret': '1CAEBDD193549167334CB37A995FD057028302ED5BB493A0B2D4759BB17A14FA',
            'username': mailInput,
            'password': passwordInput,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        
        let decodedToken = jwt_decode(tokenResult.data["access_token"]);
        localStorage.setItem('a1', decodedToken.sub);
        localStorage.setItem('access_token', tokenResult.data["access_token"]);
        
        navigate("/wattsDev/pageDeviceData");
    }
    
    
    return (
        <div>
            <TextField id="input-mail" label="Mail" variant="outlined" onChange={(newValue) => setMailInput(newValue.target.value)} value={mailInput}/>
            <br/>
            <br/>
            <TextField id="input-password" label="Password" type="password" autoComplete="current-password" onChange={(newValue) => setPasswordInput(newValue.target.value)} value={passwordInput}/> <br/>
            <br/>
            <Button variant="contained" endIcon={<SendIcon/>} onClick={getToken}>
                Connexion
            </Button>
        </div>)
}


export default PageLogin;