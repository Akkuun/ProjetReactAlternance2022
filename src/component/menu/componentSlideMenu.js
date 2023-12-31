import React, {useState} from 'react';
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
import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';
import LeaderboardTwoToneIcon from '@mui/icons-material/LeaderboardTwoTone';
// create the list of object ( listiem with his link to ... , his text, style
const ListItems = ({items, onClick}) =>
    items
        .filter(({hidden}) => !hidden)
        .map(({label, disabled, Icon, lien}, i) => (

            <ListItem button key={i} disabled={disabled} onClick={onClick(label)}>
                <ListItemIcon>

                    <Icon/>
                </ListItemIcon>
                <Link to={`${lien}`} style={{textDecoration: "none", color: "black"}}>
                    <ListItemText>{label}</ListItemText> </Link>
            </ListItem>
        ));
//return the version/date of the project
function getVersionAndData() {
    return "V  "+ "3.2" +"     " + "29/06/2023";
}

//associate each item data for the menu ( link,label,icon)
const DrawerSections = ({classes}) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('Home');

    const [itemsWattsProd] = useState({
        Clouds: [
            {label: 'Watts Prod', Icon: CloudIcon, lien: '/wattsProd'},
        ],
        Pages: [
            {label: 'User Data', Icon: PersonIcon, lien: '/wattsProd/pageUserData'},
            {label: 'Device Data', Icon: DeviceHubIcon, lien: '/wattsProd/pageDeviceData'},
            {label: 'Localisation Device',Icon: MapTwoToneIcon, lien: '/wattsProd/pageLocalisation'}
        ]
    });
    const [itemsWattsDev] = useState({
        Clouds: [
            {label: 'Watts Dev', Icon: CloudIcon, lien: '/wattsDev'},
        ],
        Pages: [
            {label: 'User Data', Icon: PersonIcon, lien: '/wattsDev/pageUserData'},
            {label: 'Device Data', Icon: DeviceHubIcon, lien: '/wattsDev/pageDeviceData'},
            {label: 'Localisation Device',Icon: MapTwoToneIcon, lien: '/wattsDev/pageLocalisation'}
        ]
    });
    const [itemsGKP] = useState({
        Clouds: [
            {label: 'GKP', Icon: CloudIcon, lien: '/GKP'},
        ],
        Pages: [
            {label: 'User Data', Icon: PersonIcon, lien: '/GKP/pageUserData'},
            {label: 'Device Data', Icon: DeviceHubIcon, lien: '/GKP/pageDeviceData'},
            {label: 'Localisation Device',Icon: MapTwoToneIcon, lien: '/GKP/pageLocalisation'}
        ]
    });
    const [itemsFENIX] = useState({
        Clouds: [
            {label: 'FENIX', Icon: CloudIcon, lien: '/FENIX'},
        ],
        Pages: [
            {label: 'User Data', Icon: PersonIcon, lien: '/FENIX/pageUserData'},
            {label: 'Device Data', Icon: DeviceHubIcon, lien: '/FENIX/pageDeviceData'},
            {label: 'Localisation Device',Icon: MapTwoToneIcon, lien: '/FENIX/pageLocalisation'}
        ]
    });
    const [itemsDELTACALOR] = useState({
        Clouds: [
            {label: 'DELTACALOR', Icon: CloudIcon, lien: '/DELTACALOR'},
        ],
        Pages: [
            {label: 'User Data', Icon: PersonIcon, lien: '/DELTACALOR/pageUserData'},
            {label: 'Device Data', Icon: DeviceHubIcon, lien: '/DELTACALOR/pageDeviceData'},
            {label: 'Localisation Device',Icon: MapTwoToneIcon, lien: '/DELTACALOR/pageLocalisation'}
        ]
    });
    const [itemLocalisationGlobale] = useState({
        Clouds: [
            {label: 'Localisation Device', Icon: CloudIcon, lien: '/ALL/pageLocalisation'},
        ],
    });
    const [itemStatistique] = useState({
        Clouds: [
            {label: 'Statistiques Device', Icon: LeaderboardTwoToneIcon, lien: '/ALL/pageStatistique'},
        ],
    });
    //state for open the menu
    const onClick = (content) => () => {
        setOpen(true);
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
                                    expandIcon={<ExpandMoreIcon/>}
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
                            </Accordion>
                            <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
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
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography><ListItems items={itemsGKP.Clouds} onClick={onClick}/></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <ListItems items={itemsGKP.Pages} onClick={onClick}>
                                        </ListItems>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography><ListItems items={itemsFENIX.Clouds} onClick={onClick}/></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <ListItems items={itemsFENIX.Pages} onClick={onClick}>
                                        </ListItems>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography><ListItems items={itemsDELTACALOR.Clouds} onClick={onClick}/></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <ListItems items={itemsDELTACALOR.Pages} onClick={onClick}>
                                        </ListItems>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                    <ListItems items={itemLocalisationGlobale.Clouds} onClick={onClick}/>
                            </Accordion>
                            <Accordion>
                                <ListItems items={itemStatistique.Clouds} onClick={onClick}/>
                            </Accordion>
                        </div>
                    </List>
                    <div style={{paddingTop: "90%", paddingLeft: "5%"}}>{getVersionAndData()}</div>
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