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
import {Icon, TextField, Tooltip} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import moment from "moment";
import RefreshIcon from '@mui/icons-material/Refresh';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListItemIcon from "@mui/material/ListItemIcon";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarExportContainer,
    GridToolbarQuickFilter
} from "@mui/x-data-grid"
import Popup from "../popupComponent/popup";
import {getDataByRoomID, getListInstallation, getListOfRommByInstallation, getTokenAPI} from "../../services/Api";
import Accordion from '@mui/material/Accordion';
import LoadingButton from '@mui/lab/LoadingButton';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';




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
const columns: GridColDef[] = [
    {
        field: 'col1',
        headerName: 'Last Updated',
        width: 150,
        //hover effect on Last Updated -> timestamp conversion
        renderCell: (params: any) => (
            <Tooltip title={moment.unix(params.value).format("YYYY-MM-DD HH:mm:ss")}>
                <span className="table-cell-trucate">{params.value}</span>
            </Tooltip>
        ),
    },
    {field: 'col2', headerName: 'Value', width: 150},
    {field: 'col3', headerName: 'WattsType', width: 400},

];



const DeviceDataComponent = ({classes}) => {
    
    const [a1, setA1] = useState('');
    const [accordionOpen, setAccordionOpen] = React.useState(false);
    const [accordionOpen2, setAccordionOpen2] = React.useState(false);
    
    
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

// recuperation data
    const getToken = async (a1) => {
        try {
            let token = await getTokenAPI("device");
            
            // Get the list of installation by a A1
            let installationsListResult = await getListInstallation(token, a1)
            
            let installationsList = [];
            for (let install of installationsListResult.data) {
                
                let installationResult = await getListOfRommByInstallation(token, a1, install)
                
                let devices = [];
                //for each room, get the data of
                for (let room of installationResult.data.rooms) {
                    let configurationResult = await getDataByRoomID(token, room.devices[0].Id_deviceId);
                    
                    
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
    

    function CustomToolbar() {

        const [loading, setLoading] = React.useState(false);

        const handleClick = () => {

            setLoading(!loading);


            for(let i=0;i<150;i++){
                console.log("tototo")
            }

            setLoading(!loading);


        }


        return (
            <GridToolbarContainer>
                {/*search feature*/}
                <GridToolbarQuickFilter onBlur={handleClick}

                    quickFilterParser={(searchInput) =>
                        searchInput.split(',').map((value) => value.trim())
                    }
                    quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
                    debounceMs={200} // time before applying the new quick filter value

                />

                <LoadingButton
                    loading={loading}
                    onClick={()=>{
                        setLoading(!loading);


                        for(let i=0;i<150;i++){
                            console.log("tototo")
                        }

                        setLoading(!loading);
                    }}
                    endIcon={<RefreshIcon />}
                    loadingPosition="end"
                    variant="text"
                >
                    Send
                </LoadingButton>
            </GridToolbarContainer>
        )
    }


    const [installationsList, setInstallationsList] = useState([]);
    
    // creation accodion avec tableaux a partir de la map des donnes obtenu
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
                                        {station.devices[0].Il}
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
                                                    {` Room : ${device.roomName} -  Device : ${device.deviceName}`}
                                                
                                                </ListItem>
                                                
                                                <Popup classes="popupData"
                                                       value={{"statsDevice": [a1, station.installation, device.deviceName]}}/>
                                            
                                            
                                            </AccordionSummary>
                                            {/* ce qu'on va avoir quand on a cliquer sur le device, le tableau des ty avec les données du device en cours   */}
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
                </List>) : (<div></div>)}
            
            </Grid>
        
        </Grid>
    
    
    )
}

export default DeviceDataComponent
