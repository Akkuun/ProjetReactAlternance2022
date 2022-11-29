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
    const [items] = useState({
        Pages: [
            { label: 'Device Data', Icon: DeviceHubIcon, lien: 'pageDeviceData' },
            { label: 'User data', Icon: PersonIcon, lien: 'pageUserData' },
        ],
        Clouds: [
            { label: 'Watts Dev', Icon:CloudIcon },
            { label: 'Watts Prod', Icon: CloudIcon },
            { label: 'Fenix', Icon: CloudIcon },
            { label: 'Gkp', Icon: CloudIcon },
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
                        <ListSubheader>Pages</ListSubheader>
                        <ListItems items={items.Pages} onClick={onClick}>
                        </ListItems>
                        <Divider/>
                        <ListSubheader>Clouds</ListSubheader>
                        <ListItems items={items.Clouds} onClick={onClick}>
                        </ListItems>

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