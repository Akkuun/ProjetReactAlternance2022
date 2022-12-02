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

    const[itemsInstallationName] =useState({
        installations: [
            { label: 'Installation.name', Icon :CottageIcon  },
        ],
        Pages: [
            { label: 'User Data', Icon:PersonIcon },
            { label: 'Device Data', Icon: DeviceHubIcon },
        ]
    });


    const onClick = (content) => () => {
        setOpen(false);
        setContent(content);
    };




    return (
        <Grid container justify='space-between' marginLeft="25%" marginTop="3%">
            <Grid item>
                <Typography>

                </Typography>
            </Grid>
            <Grid item>
                <List>


                <div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography><ListItems items={itemsInstallationName.installations} onClick={onClick}/></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                            Component contenant les nom des devices / rooms
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Accordion 2</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
                </List>
            </Grid>

        </Grid>
    );
}


export default DeviceDataComponent