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
        {installation: 'installation one', devices: ['000','0001']},
        {installation: 'installation two', devices: ['010','0011']},
    ];
    const onClick = (content) => () => {
        setOpen(false);
        setContent(content);
    };



    return (


        <Grid container justify='space-between' marginLeft="45%" marginTop="3%">
            <Grid item>
                <Typography>


                </Typography>
            </Grid>
            <Grid item>
                <List>
                    <div>

                            {statios.map(station => (






                                    <div key={station.call} className='station'>{station.installation}</div>

                                    ))}

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