import React, {useState} from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


export default function NestedList() {
    const [openBt, setOpenBt] = useState(false);
    const [openCm, setOpenCm] = useState(false);
    const [openMa, setOpenMa] = useState(false);
    const [openRt, setOpenRt] = useState(false);
    const [openBo, setOpenBo] = useState(false);
    const [openCf, setOpenCf] = useState(false);
    const [openDf, setOpenDf] = useState(false);
    const [openEc, setOpenEc] = useState(false);

    const handleBtClick = () => {
        setOpenBt(!openBt);
    };

    const handleCmClick = () => {
        setOpenCm(!openCm);
    };

    const handleMaClick = () => {
        setOpenMa(!openMa);
    };

    const handleRtClick = () => {
        setOpenRt(!openRt);
    };

    const handleBoClick = () => {
        setOpenBo(!openBo);
    };

    const handleCfClick = () => {
        setOpenCf(!openCf);
    };

    const handleDfClick = () => {
        setOpenDf(!openDf);
    };

    const handleEcClick = () => {
        setOpenEc(!openEc);
    };

    return (
        <List
            dense={true}
            sx={{width: '40%', bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Légende
                </ListSubheader>
            }
        >
            <ListItemButton onClick={handleBtClick}>
                <ListItemText primary="Bt"/>
                {openBt ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openBt} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText primary="Boost time duration (min)"/>
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={handleCmClick}>
                <ListItemText primary="Cm"/>
                {openCm ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openCm} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    Current
                                    Mode<br/>
                                    0-OFF<br/>
                                    1-eco <br/>
                                    2-auto<br/>
                                    3-confort <br/>
                                    4-defrost<br/>
                                    5-boost<br/>
                                    6-manual<br/>
                                    7-sunday<br/>
                                </React.Fragment>}/>
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={handleMaClick}>
                <ListItemText primary="Ma"/>
                {openMa ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openMa} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText primary="Manual setpoint (C°)"/>
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={handleRtClick}>
                <ListItemText primary="Rt"/>
                {openRt ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openRt} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText primary={
                            <React.Fragment>
                                Room Type <br/>
                                1-Bathroom<br/>
                                2-Bedroom<br/>
                                3-DiningRoom<br/>
                                4-Entrance<br/>
                                5-Garage<br/>
                                6-Garden<br/>
                                7-Hall<br/>
                                8-Kitchen<br/>
                                9-LivingRoom<br/>
                                10-Loft<br/>
                                11-Office<br/>
                                12-Outbuilding<br/>
                                13-Terrace<br/>
                                14-Toilet<br/>
                                15-Various</React.Fragment>}/>
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={handleBoClick}>
                <ListItemText primary="bo"/>
                {openBo ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openBo} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText primary="Boost setpoint (°C)"/>
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={handleCfClick}>
                <ListItemText primary="cf"/>
                {openCf ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openCf} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText primary="Confort setpoint (°C)"/>
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={handleDfClick}>
                <ListItemText primary="df"/>
                {openDf ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openDf} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText primary="Defrost setpoint (°C)"/>
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={handleEcClick}>
                <ListItemText primary="ec"/>
                {openEc ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={openEc} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{pl: 4}}>
                        <ListItemText primary="eco setpoint (°C)"/>
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}
