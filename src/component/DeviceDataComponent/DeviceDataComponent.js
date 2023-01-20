import * as React from 'react';
import {useEffect, useState} from 'react';

import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import CottageIcon from '@mui/icons-material/Cottage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {Icon, TextField, Toolbar, Tooltip} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import moment from "moment";
import RefreshIcon from '@mui/icons-material/Refresh';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListItemIcon from "@mui/material/ListItemIcon";
import {DataGrid, GridToolbarContainer, GridToolbarQuickFilter} from "@mui/x-data-grid"
import Popup from "../popupComponent/popup";
import {getDataByDeviceID, getListInstallation, getListOfRoomByInstallation, getTokenAPI} from "../../services/Api";
import Accordion from '@mui/material/Accordion';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingButton from '@mui/lab/LoadingButton';
import DeviceDataBubbleComponent from "./DeviceDataBubbleComponent";
//creation item par rapport à une liste de données
const ListItems = ({items}) =>
    items
        .filter(({hidden}) => !hidden)
        .map(({label, disabled, Icon}, i) => (
            <ListItem key={i}>
                <ListItemIcon>
                    <Icon/>
                </ListItemIcon>
                {label}
            </ListItem>
        ));
//definition colonne de DataGrid



const DeviceDataComponent = ({classes}) => {

    const [a1, setA1] = useState('');
    const [mac, setMac] = useState('');
    const [accordionOpen, setAccordionOpen] = React.useState(false);
    const [accordionOpen2, setAccordionOpen2] = React.useState(false);
    const [mapAccordionOpen, setMapAccordionOpen] = React.useState({});

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


//recuperation du a1 pour requêtes
    const a1Handler = async (a1) => {
        if (a1.length === 12) {
            setA1(a1);
            await getToken(a1);
        } else {
            setA1("");
        }
    }
    const MacHandler = async (mac) => {
        if (mac.length === 12) {
            setMac(mac);
            console.log("entre dna le mac")
            // await getToken(mac);
        } else {
            setMac("");
        }
    }

// recuperation data

    let newMapConfiguration = {};


    const getToken = async (a1) => {
        try {
            let token = await getTokenAPI("device");

            // Get the list of installation by a A1
            let installationsListResult = await getListInstallation(token, a1)
            // console.log(installationsListResult.data)

            let installationsList = [];
            for (let install of installationsListResult.data) {

                let installationResult = await getListOfRoomByInstallation(token, a1, install)
                console.log(installationResult.data)
                let devices = [];
                //for each room, get the data of
                for (let room of installationResult.data.rooms) {
                    console.log(room)
                    let configurationResult = await getDataByDeviceID(token, room.devices[0].Id_deviceId);
                    newMapConfiguration[room.devices[0].Id_deviceId] = configurationResult.data;
                    let deviceConfigurationData = [];
                    let added = 0;
                    // for each data of the configuration, insert the correct data in the list
                    for (const [key, value] of Object.entries(configurationResult.data)) {
                        added++;
                        deviceConfigurationData.push({
                            id: added,
                            'col1': value.timestamp,
                            'col2': key,
                            'col3': value.value
                        })
                    }
                    //devices data
                    devices.push({
                        roomName: room.Rn,
                        deviceName: room.devices[0].Id_deviceId,
                        wattsType: deviceConfigurationData,
                        Il: installationResult.data.Il
                    })
                }
//installation data
                installationsList.push({
                    installation: install,
                    devices: devices
                });

            }
            //udate the installationList
            setInstallationsList(installationsList);
            console.log("installation")
            console.log(installationsList)

        } catch (e) {
            console.error(e);
        }
    }





    const [installationsList, setInstallationsList] = useState([]);


    const addToClipboard = (content) => {
        navigator.clipboard.writeText(content.target.innerText);
        toast.info('Ajouté au presse-papier: ' + content.target.innerText, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    };

    function manageOpenAccordion(id) {
        let newMap = {};
        for (let [key, value] of Object.entries(mapAccordionOpen)) {
            newMap = {[key]: !value}
        }
        setMapAccordionOpen(newMap)
    }


    // creation accodion avec tableaux a partir de la map des donnes obtenu
    return (

        <Grid container spacing={3} marginTop="0%" key={"toto"}
            >
            <Grid item xs={9}>
                <form>
                    <div style={{paddingLeft: "35%", justifyContent: "space-between"}}>
                        <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
                        <TextField id="outlined-basic" label="A1" variant="outlined"
                                   onChange={(e) => a1Handler(e.target.value)}/>
                        <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
                        <TextField id="outlined-basic2" label="MAC" variant="outlined"
                                   onChange={(e) => MacHandler(e.target.value)}/>
                    </div>
                </form>
{/*

                {a1.length === 12 && mac.length === 0 ? (<List>

                    <div>
                        iteration avec map permettant d'afficher tout les boutons ect ..
                        {installationsList.map(station => (
                            // permier accordion pour les noms des installations
                            <Accordion key={station.installation} expanded={mapAccordionOpen[station.installation]}>
                                <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    expandIcon={
                                        <ExpandMoreIcon
                                            style={{cursor: 'pointer'}}
                                            onClick={() => manageOpenAccordion(station.installation)}/>
                                    }
                                    sx={{cursor: 'unset !important'}}
                                >
                                    <Typography component={'span'}>
                                        <ListItems items={icons.installation}/>
                                    </Typography>

                                    <ListItem>
                                        <Typography onClick={addToClipboard}>
                                            {station.devices[0].Il}
                                        </Typography>
                                    </ListItem>

                                    <Popup classes="popupData"
                                           value={{"statsInstallation": [a1, station.installation]}}/>
                                </AccordionSummary>

                                ce que va avoir quand on va cliquer sur l'accordion de l'installation donc les devices
                                <AccordionDetails>
                                    {station.devices.map(device => (
                                        <Accordion key={device.deviceName} expanded={accordionOpen2}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                expandIcon={
                                                    <ExpandMoreIcon
                                                        style={{cursor: 'pointer'}}
                                                        onClick={() => setAccordionOpen2(!accordionOpen2)}/>
                                                }
                                                sx={{cursor: 'unset !important'}}
                                            >
                                                <Typography component={'span'}>
                                                    <ListItems items={icons.device}/>
                                                </Typography>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        <Icon/>
                                                    </ListItemIcon>
                                                    <span>Room:&nbsp;</span>
                                                    <Typography onClick={addToClipboard}>
                                                        {device.roomName}
                                                    </Typography>
                                                    <span>&nbsp;Device:&nbsp;</span>
                                                    <Typography onClick={addToClipboard}>
                                                        {device.deviceName}
                                                    </Typography>
                                                    <ToastContainer/>
                                                </ListItem>

                                                <Popup classes="popupData"
                                                       value={{"statsDevice": [a1, station.installation, device.deviceName]}}/>

                                            </AccordionSummary>
                                            ce qu'on va avoir quand on a cliquer sur le device, le tableau des ty avec
                                            les données du device en cours
                                            <AccordionDetails>
                                                <div style={{height: 300, width: '100%'}}>
                                                    <DataGrid rows={device.wattsType} columns={columns} components={{
                                                        Toolbar: CustomToolbar
                                                    }}/>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>



                </List>*/}

                {mac.length === 0 && a1.length === 12 ? <div style={{
                    flexDirection: "row",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "100%",
                    marginLeft: "20%"

                }}>

                    {installationsList.map(station => (
                       //<DeviceDataBubbleComponent mode={station.devices.wattsType["Cm"]} />
                       station.devices.map(device=> (

                           <DeviceDataBubbleComponent keyValue={device.wattsType[0].col3}
                                                      mode={device.wattsType[4].col3}
                                                      device_name={device.wattsType[20].col3}
                                                      install_name={device.wattsType[18].col3}
                                                      temp={((((device.wattsType[1].col3)/10)-32)/1.8).toPrecision(3)}
                                                      last_updated={device.wattsType[6].col3}
                                                      data={installationsList}
                                                      a1={a1}
                                                      rows={device.wattsType}
                           />

                       ))

                    ))}

                </div> : (
                    <div>rien</div>)}



            </Grid>
        </Grid>
    )
}

export default DeviceDataComponent
