import React, { useState } from 'react';

import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PersonIcon from '@mui/icons-material/Person';
import {Link} from "react-router-dom"
import MenuIcon from '@mui/icons-material/Menu';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// creation des objets web par rapport a drawerSections
const ListItems = ({ items, onClick }) =>
    items
        .filter(({ hidden }) => !hidden)
        .map(({ label, disabled, Icon, lien }, i) => (

            <ListItem button key={i} disabled={disabled}     onClick={onClick(label)}>
                <ListItemIcon>

                    <Icon />
                </ListItemIcon>
                <Link  to={`${lien}`} style={{textDecoration : "none", color : "black"}} >  <ListItemText>{label}</ListItemText> </Link>
            </ListItem>
        ));

function getVersionAndData() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}/${month}/${year}`;
    return "V   1.1 "+ currentDate;
}

// contenu  des boutons pour redirection
const DrawerSections = ({ classes }) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('Home');

    const [itemsWattsProd] = useState({
        Clouds: [
            { label: 'Watts Prod', Icon:CloudIcon,lien : '/wattsProd'  },
        ],
        Pages: [
            { label: 'User Data', Icon:PersonIcon,lien: '/wattsProd/pageUserData'  },
            { label: 'Device Data', Icon: DeviceHubIcon,lien: '/wattsProd/pageDeviceData' },
        ]
    });


    const [itemsWattsDev] = useState({
        Clouds: [
            { label: 'Watts Dev', Icon:CloudIcon,lien : '/wattsDev'  },
        ],
        Pages: [
            { label: 'User Data', Icon:PersonIcon,lien: '/wattsDev/pageUserData'  },
            { label: 'Device Data', Icon: DeviceHubIcon,lien: '/wattsDev/pageDeviceData' },
        ]
    });


    const onClick = (content) => () => {
        setOpen(false);
        setContent(content);
    };

    return (
        <Grid container justify='space-between'>
            <Grid item>
                <Typography>

                </Typography>
            </Grid>
            <Grid item>
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <List>

                        <div>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography><ListItems items={itemsWattsDev.Clouds} onClick={onClick}/></Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <ListItems items={itemsWattsDev.Pages} onClick={onClick}>
                                    </ListItems>
                                </Typography>
                            </AccordionDetails>
                        </Accordion><Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography><ListItems items={itemsWattsProd.Clouds} onClick={onClick}/></Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <ListItems items={itemsWattsProd.Pages} onClick={onClick}>
                                    </ListItems>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        </div>
                    </List>
                    <div style={{paddingTop:"90%",paddingLeft:"5%"}}>{getVersionAndData()  }</div>
                </Drawer>

            </Grid>
            <Grid item>
                <Button onClick={() => setOpen(!open)}>
                    <MenuIcon/>
                </Button>
            </Grid>
        </Grid>
    );
};

export default DrawerSections;