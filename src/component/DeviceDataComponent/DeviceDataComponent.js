import axios from "axios";
import Cookies from "universal-cookie";

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
import {useState} from "react";
import CloudIcon from "@mui/icons-material/Cloud";
import PersonIcon from "@mui/icons-material/Person";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import CottageIcon from '@mui/icons-material/Cottage';
import {random} from "@mui/x-data-grid-generator";
import {Icon} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid"

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
    {field: 'col1', headerName: 'WattsType', width: 150},
    {field: 'col2', headerName: 'Value', width: 150},
];


const DeviceDataComponent = ({classes}) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    
    const [icons] = useState({
        installation: [
            {Icon: CottageIcon},
        ],
        
        device: [
            {Icon: DeviceHubIcon},
        ]
    });
    
    var statios = [
        {
            installation: 'installation one', devices: [
                {
                    roomName: 'room1',
                    deviceName: 'device 1 1 ',
                    wattsType: [{id: 1, col1: 'At', col2: '670'}, {id: 2, col1: 'Uc', col2: '1'}]
                },
                {
                    roomName: 'room2',
                    deviceName: 'device 1 2 ',
                    wattsType: [{id: 1, col1: 'At', col2: '999'}, {id: 2, col1: 'Uc', col2: '0'}]
                }
            ]
        },
        {
            installation: 'installation two', devices: [
                {
                    roomName: 'room1',
                    deviceName: 'device 2 1 ',
                    wattsType: [{id: 1, col1: 'At', col2: '456'}, {id: 2, col1: 'Uc', col2: '1'}]
                },
                {
                    roomName: 'room2',
                    deviceName: 'device 2 2 ',
                    wattsType: [{id: 1, col1: 'At', col2: '656'}, {id: 2, col1: 'Uc', col2: '1'}]
                }
            ]
        },
    ];
    
    const onClick = (content) => () => {
        setOpen(false);
        setContent(content);
    };
    
    return (
        <Grid container spacing={3} marginLeft="10%" marginTop="0%">
            <Grid item xs={9}>
                <List>
                    <div>
                        {/*iteration avec map permettant d'afficher tous les bouttons ect ..*/}
                        {statios.map(station => (
                            // permier acordion pour les noms des installations
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    
                                    <Typography>
                                        <ListItems items={icons.installation}
                                                   onClick={onClick}/>
                                    </Typography>
                                    
                                    <ListItem key={station.installation}>
                                        <ListItemIcon>
                                            
                                            <Icon/>
                                        </ListItemIcon>
                                        
                                        {station.installation}
                                    
                                    </ListItem>
                                </AccordionSummary>
                                {/* ce que va avoir quand on va clicker sur laccordion de l'installation donc les devices*/}
                                <AccordionDetails>
                                    {station.devices.map(device => (
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography>
                                                    <ListItems items={icons.device}
                                                               onClick={onClick}/>
                                                </Typography>
                                                <ListItem key={device.deviceName}>
                                                    <ListItemIcon>
                                                        <Icon/>
                                                    </ListItemIcon>
                                                    {`${device.roomName} - ${device.deviceName}`}
                                                
                                                </ListItem>
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
                </List>
            </Grid>
        </Grid>
    );
}

export default DeviceDataComponent