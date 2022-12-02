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

            <ListItem button key={i} disabled={disabled} onClick={onClick(label)}>
                <ListItemIcon>

                    <Icon/>
                </ListItemIcon>
                {label}

            </ListItem>
        ));


const rows: GridRowsProp = [
    {id: 1, col1: 'Hello', col2: 'World'},
    {id: 2, col1: 'DataGridPro', col2: 'is Awesome'},
    {id: 3, col1: 'MUI', col2: 'is Amazing'},
];

const columns: GridColDef[] = [
    {field: 'col1', headerName: 'Column 1', width: 150},
    {field: 'col2', headerName: 'Column 2', width: 150},
];


const DeviceDataComponent = ({classes}) => {


    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');

    const [itemsInstallationName] = useState({
        installations: [
            {label: 'Installation 1 .name', Icon: CottageIcon},


        ],

        devices: [
            {label: 'rooms 1 ', Icon: PersonIcon},
            {label: 'rooms 2', Icon: DeviceHubIcon},
        ]
    });


    var statios = [
        {installation: 'installation one', devices: [['device 1 1 '], ['device 1 2 ']]},
        {installation: 'installation two', devices: ['device 2 2 ', 'device 2 2 ']},
    ];
    const onClick = (content) => () => {
        setOpen(false);
        setContent(content);
    };

function titi(){
    console.log("titi")
}
    function getComponent(tree) {
        return tree.map(value => (
            <button key={value} onClick={() => {
                alert("button " + value + " is clicked")
            }}>{value} </button>
        ))
    }

    statios.map(value => console.log(value))
    return (


        <Grid container justify='space-between' marginLeft="45%" marginTop="3%">
            <Grid item>
                <Typography>


                </Typography>
            </Grid>
            <Grid item>
                <List>
                    <div>
                        <>
                            {/*iteration avec map permettant d'afficher tous les bouttons ect ..*/}
                            {statios.map(station => (
                                // permier acordion pour les noms des installations
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >


                                        <ListItem button key={station.installation}>
                                            <ListItemIcon>

                                                <Icon/>
                                            </ListItemIcon>

                                            {station.installation}

                                        </ListItem>

                                    </AccordionSummary>
                                   {/* ce que va avoir quand on va clicker sur laccordion de l'installation donc les devices*/}
                                    <AccordionDetails>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                {/* TEST autre map iterant sur les devices pour crer un bouton accordion pour chaque device present sur l'installation en coours*/}
                                                {statios.map(deviceID => (
                                                <ListItem button key={deviceID.devices}  onClick={titi}>
                                                    <ListItemIcon>

                                                        <Icon/>
                                                    </ListItemIcon>

                                                    {deviceID.devices}
                                                </ListItem>
                                                        ))}


                                            </AccordionSummary>
                                            {/* ce qu'on va avoir quand on a cliquer sur le device, le tableau des ty avec les données du device en cours   */}
                                            <AccordionDetails>
                                                <div style={{height: 300, width: '100%'}}>
                                                    <DataGrid rows={rows} columns={columns}/>
                                                </div>

                                            </AccordionDetails>
                                        </Accordion>


                                    </AccordionDetails>
                                </Accordion>

                            ))}
                        </>
                    </div>

                    <div>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography><ListItems items={itemsInstallationName.installations}
                                                       onClick={onClick}/></Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >

                                        <Typography><ListItems items={itemsInstallationName.devices}
                                                               onClick={onClick}/></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>etejoeeo </AccordionDetails>
                                </Accordion>

                            </AccordionDetails>
                        </Accordion>


                    </div>
                </List>
            </Grid>

        </Grid>


    );


}

export default DeviceDataComponent