import React, { useState } from 'react';

import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import {Link} from "react-router-dom"
import MenuIcon from '@mui/icons-material/Menu';
import pageDeviceData from "../pageDeviceData";
import pageUserData from "../pageUserData";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const ListItems = ({ items, onClick }) =>
    items
        .filter(({ hidden }) => !hidden)
        .map(({ label, disabled, Icon, lien }, i) => (

            <ListItem button key={i} disabled={disabled}     onClick={onClick(label)}>
                <ListItemIcon>

                    <Icon />
                </ListItemIcon>
                <Link  to={`/${lien}`} style={{textDecoration : "none", color : "black"}} >  <ListItemText>{label}</ListItemText> </Link>
            </ListItem>
        ));

const DrawerSections = ({ classes }) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('Home');

    const [itemsWattsProd] = useState({
        Clouds: [
            { label: 'Watts Prod', Icon:CloudIcon,lien : 'wattsProd'  },
        ],
        Pages: [
            { label: 'User Data', Icon:CloudIcon,lien: 'pageUserDataWattsProd'  },
            { label: 'Device Data', Icon: CloudIcon,lien: 'pageDeviceDataWattsProd' },
        ]
    });


    const [itemsWattsDev] = useState({
        Clouds: [
            { label: 'Watts Prod', Icon:CloudIcon,  },
        ],
        Pages: [
            { label: 'User Data', Icon:CloudIcon,lien: 'pageUserDataWattsDev'  },
            { label: 'Device Data', Icon: CloudIcon,lien: 'pageDeviceDataWattsDev' },
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
                        {/*<ListSubheader>Pages</ListSubheader>
                        <ListItems items={items.Clouds} onClick={onClick}>
                        </ListItems>
                        <Divider/>
                        <ListSubheader>Clouds</ListSubheader>
                        <ListItems items={items.Pages} onClick={onClick}>
                        </ListItems>*/}
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