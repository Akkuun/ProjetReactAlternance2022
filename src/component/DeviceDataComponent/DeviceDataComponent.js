import axios from "axios";

import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import {Link} from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import {useEffect, useState} from "react";
import CloudIcon from "@mui/icons-material/Cloud";
import PersonIcon from "@mui/icons-material/Person";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import CottageIcon from '@mui/icons-material/Cottage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {random} from "@mui/x-data-grid-generator";
import {Icon, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid"
import Button from "@mui/material/Button";
import {AccountCircle} from "@mui/icons-material";
import DeviceTable from "../DeviceTable/DeviceTable";

const ListItems = ({items, onClick}) =>
    items
        .filter(({hidden}) => !hidden)
        .map(({label, disabled, Icon}, i) => (
            <ListItem key={i} disabled={disabled} onClick={onClick(label)}>
                <ListItemIcon>
                    <Icon/>
                </ListItemIcon>
                {label}
            </ListItem>
        ));

const columns: GridColDef[] = [
    {field: 'col1', headerName: 'Last Updated', width: 150},
    {field: 'col2', headerName: 'Value', width: 150},
    {field: 'col3', headerName: 'WattsType', width: 400},
];


const DeviceDataComponent = ({classes}) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [a1, setA1] = useState('');

    const [icons] = useState({
        installation: [
            {Icon: CottageIcon},
        ],
        device: [
            {Icon: DeviceHubIcon},
        ],
        stats: [
            {Icon: AssessmentIcon},
        ]
    });


    useEffect(() => {
        getToken();
    }, []);

    const a1Handler = async (a1) => {

        if (a1.length === 12) {
            setA1(a1);
            await getToken(a1);
        } else {
            setA1("");
        }
    }


    const getToken = async (a1) => {


        try {


            let tokenResult = await axios.post("https://visionsystem2-identity-dev.azurewebsites.net/connect/token", {
                'grant_type': 'client_credentials',
                'scope': 'Device.Write Installation.Read IOTManagement.Write TermOfUse.Read TermOfUse.Write Commissionings.Read Commissionings.Write DataProcessing.Read DataProcessing.Write Device.Read Firmware.Read Firmware.Write HistoricalData.Read HistoricalData.Write Installation.Write IOTManagement.Read Room.Read Room.Write Schema.Read Schema.Write https://visionsystem2.com/iotmanagement/user_impersonation https://visionsystem2.com/operations/user_impersonation https://visionsystem2.com/tou/user_impersonation https://visionsystem2.com/businessmodule/user_impersonation https://visionsystem2.com/identity/user_impersonation https://visionsystem2.com/dataprocessing/user_impersonation',
                'client_id': '2b64fa79-35c3-418f-8a78-3ef6f9df9c53',
                'client_secret': 'EB44AA55C51AD31B87D139528CD5DE7E89BE925B301A4351B918E4CB568B3252'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            // Get installations names list
            let installationsListResult = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/security/v1/security/getInstallationsByUser/${a1}`, {
                headers: {
                    'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
                }
            })

            let installationsList = [];
            for (let install of installationsListResult.data) {
                // Get rooms name list
                let installationResult = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/businessmodule/v1/installations/${a1}/${install}`, {
                    headers: {
                        'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
                    }
                })

                let devices = [];
                for (let room of installationResult.data.rooms) {
                    let configurationResult = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/iotmanagement/v1/configuration/${room.devices[0].Id_deviceId}/${room.devices[0].Id_deviceId}/v1/content/`, {
                        headers: {
                            'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
                        }
                    })

                    let deviceConfigurationData = [];
                    let added = 0;
                    for (const [key, value] of Object.entries(configurationResult.data)) {
                        added++;
                        deviceConfigurationData.push({
                            id: added,
                            'col1': value.timestamp,
                            'col2': key,
                            'col3': value.value
                        })
                    }

                    devices.push({
                        roomName: room.Rn,
                        deviceName: room.devices[0].Id_deviceId,
                        wattsType: deviceConfigurationData,
                        Il:installationResult.data.Il
                    })
                }

                installationsList.push({
                    installation: install,
                    devices: devices
                });

            }

            setInstallationsList(installationsList);
            console.log("installation")
            console.log(installationsList)
        } catch (e) {
            console.error(e);
        }
    }

    const onClick = (content) => () => {
        console.log("click!")
        setOpen(false);
        setContent(content);
    };

    const [installationsList, setInstallationsList] = useState([]);

    return (
        <Grid container spacing={3} marginLeft="10%" marginTop="0%">
            <Grid item xs={9}>
                <form>
                    <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
                    <TextField id="outlined-basic" label="A1" variant="outlined"
                               onChange={(e) => a1Handler(e.target.value)}/>
                </form>

                {a1.length === 12 ? (<List>
                    <div>
                        {/*iteration avec map permettant d'afficher tous les bouttons ect ..*/}
                        {installationsList.map(station => (
                            // permier acordion pour les noms des installations
                            <Accordion key={station.installation}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography component={'span'}>
                                        <ListItems items={icons.installation}
                                                   onClick={onClick}/>
                                    </Typography>

                                    <ListItem>
                                        {station.devices[0].Il}
                                    </ListItem>
                                    <Button onClick={onClick} startIcon={<AssessmentIcon/>}></Button>
                                </AccordionSummary>

                                {/*ce que va avoir quand on va clicker sur laccordion de l'installation donc les devices*/}
                                <AccordionDetails>
                                    {station.devices.map(device => (
                                        <Accordion key={device.deviceName}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography component={'span'}>
                                                    <ListItems items={icons.device}
                                                               onClick={onClick}/>
                                                </Typography>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <Icon/>
                                                    </ListItemIcon>
                                                    {` Room : ${device.roomName} -  Device : ${device.deviceName}`}

                                                </ListItem>
                                                <Button onClick={onClick} startIcon={<AssessmentIcon/>}></Button>
                                            </AccordionSummary>
                                            {/* ce qu'on va avoir quand on a cliquer sur le device, le tableau des ty avec les données du device en cours   */}
                                            <AccordionDetails>
                                                <div style={{height: 300, width: '100%'}}>
                                                    <DataGrid rows={device.wattsType} columns={columns}/>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </List>) : (<div> rien</div>)}

            </Grid>
        </Grid>
    )
}

export default DeviceDataComponent
