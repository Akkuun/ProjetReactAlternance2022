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
import {FormControl, Icon, InputLabel, MenuItem, Select, Slider, TextField, Tooltip} from "@mui/material";
import moment from "moment";
import RefreshIcon from '@mui/icons-material/Refresh';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListItemIcon from "@mui/material/ListItemIcon";
import {DataGrid, GridToolbarContainer, GridToolbarQuickFilter} from "@mui/x-data-grid"
import Popup from "../popupComponent/popup";
import {getDataByDeviceID, getListInstallation, getListOfRoomByInstallation, replaceTwin} from "../../services/Api";
import {convertCelsiusToFahrenheit, convertFahrenheitToCelsius} from "../../services/Helper";
import Accordion from '@mui/material/Accordion';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";

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

const marks = [
    {
        value: 5,
        label: '5°C',
    },
    {
        value: 35,
        label: '35°C',
    }
];

function valuetext(value) {
    return `${value}°C`;
}

const DeviceDataComponent = ({classes}) => {
    const [a1, setA1] = useState('');
    const [accordionOpen, setAccordionOpen] = React.useState(false);
    const [accordionOpen2, setAccordionOpen2] = React.useState(false);
    const [selectModeValue, setSelectModeValue] = React.useState(99);
    const [installationsList, setInstallationsList] = useState([]);
    
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
        getData();
    }, []);


// recuperation data
    const getData = async () => {
        try {
            let token = localStorage.getItem("access_token");
            let a1 = localStorage.getItem("a1");
            
            // Get the list of installation by a A1
            let installationsListResult = await getListInstallation(token, a1)
            
            let installationsList = [];
            for (let install of installationsListResult.data) {
                
                let installationResult = await getListOfRoomByInstallation(token, a1, install)
                let devices = [];
                //for each room, get the data of
                for (let room of installationResult.data.rooms) {
                    let configurationResult = await getDataByDeviceID(token, room.devices[0].Id_deviceId);
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
        } catch (e) {
            console.error(e);
        }
    }
    
    
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
    
    async function handleModeChange(device, newMode) {
        setSelectModeValue(newMode)
        
        let newTwin = {
            "Id_deviceId": device.deviceName,
            "S1": device.deviceName,
            "configurationVersion": "v1.0",
            "data": [
                        {
                        "wattsType": "Dm",
                        "wattsTypeValue": newMode
                        }
                ]
        };
        await replaceTwin(localStorage.getItem("access_token"), device.deviceName, newTwin);
    }
    
    async function handleTemperatureChange(device, newSetpoint) {
        let currentMode = selectModeValue
        let wattsType = "";
        
        switch(currentMode) {
            case 1: (wattsType = "Ec"); break; // ECO
            case 3: (wattsType = "Cf"); break; // CONFORT
            case 4: (wattsType = "Df"); break; // DEFROST
            case 5: (wattsType = "Bo"); break; // BOOST
        }
        
        let newTwin = {
            "Id_deviceId": device.deviceName,
            "S1": device.deviceName,
            "configurationVersion": "v1.0",
            "data": [
                {
                    "wattsType": wattsType,
                    "wattsTypeValue": convertCelsiusToFahrenheit(newSetpoint)
                }
            ]
        };
        await replaceTwin(localStorage.getItem("access_token"), device.deviceName, newTwin);
    }
    
    function initSelectMode(device) {
        if (selectModeValue == "") {
            if(device.wattsType.filter(wt => wt.col2 == "Cm")[0] != undefined) {
                console.log(device.wattsType.filter(wt => wt.col2 == "Cm")[0].col3)
                setSelectModeValue(device.wattsType.filter(wt => wt.col2 == "Cm")[0].col3)
            }
        }
    }

    // creation accodion avec tableaux a partir de la map des donnes obtenu
    return (
        
        <Grid container spacing={3} marginLeft="10%" marginTop="0%">
            <Grid item xs={9}>
                <List>
                    <div>
                        {/*iteration avec map permettant d'afficher tout les boutons ect ..*/}
                        {installationsList.map(station => (
                            // permier accordion pour les noms des installations
                            <Accordion key={station.installation} expanded={accordionOpen}>
                                <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    expandIcon={
                                        <ExpandMoreIcon
                                            style={{cursor: 'pointer'}}
                                            onClick={() => setAccordionOpen(!accordionOpen)}/>
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
                                
                                {/*ce que va avoir quand on va cliquer sur l'accordion de l'installation donc les devices*/}
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
                                            {/* ce qu'on va avoir quand on a cliquer sur le device, le tableau des ty avec les données du device en cours   */}
                                            <AccordionDetails>
                                                <div style={{height: 300, width: '100%'}}>
                                                    <Box sx={{ minWidth: 120 }}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                                                            <Select
                                                                key={`select-mode-menu`}
                                                                labelId="mode-select-menu"
                                                                id="mode-select-menu"
                                                                value={selectModeValue}
                                                                label="Mode"
                                                                onChange={e => handleModeChange(device, e.target.value)}
                                                            >
                                                                <MenuItem value={3}>Confort</MenuItem>
                                                                <MenuItem value={2}>Programme</MenuItem>
                                                                <MenuItem value={1}>Eco</MenuItem>
                                                                <MenuItem value={5}>Boost</MenuItem>
                                                                <MenuItem value={4}>Hors-Gel</MenuItem>
                                                                <MenuItem value={0}>Off</MenuItem>
                                                                <MenuItem value={99}>-</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                    <br/>
                                                    <br/>
                                                    <br/>
                                                    <Box>
                                                        <Slider
                                                            key={`slider-temperature`}
                                                            aria-label="Always visible"
                                                            defaultValue={20}
                                                            getAriaValueText={valuetext}
                                                            step={0.5}
                                                            marks={marks}
                                                            valueLabelDisplay="on"
                                                            min={5}
                                                            max={35}
                                                            onChangeCommitted={(_, newValue) => handleTemperatureChange(device, newValue)}
                                                        />
                                                    </Box>
                                                    
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </List>
            </Grid>
        </Grid>
    )
}


export default DeviceDataComponent
