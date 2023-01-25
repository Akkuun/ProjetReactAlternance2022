import * as React from 'react';
import {useEffect, useState} from 'react';


import Grid from "@mui/material/Grid";

import ListItem from "@mui/material/ListItem";

import {Icon, TextField, Toolbar, Tooltip} from "@mui/material";
import {AccountCircle, Login} from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
import {DataGrid, GridToolbarContainer, GridToolbarQuickFilter} from "@mui/x-data-grid"
import Popup from "../popupComponent/popup";
import {
    getDataByDeviceID,
    getListInstallation,
    getListOfRoomByInstallation,
    getTokenAPI,
    sendUserConnected
} from "../../services/Api";

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeviceDataBubbleComponent from "./DeviceDataBubbleComponent";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";


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


const DeviceDataComponent = ({classes}) => {


    const [a1, setA1] = useState('');
    const [mac, setMac] = useState('');

    const [install_id, setInstallID] = useState('')
    const [device_id, setDeviceID] = useState('')
    const [selectedDevice, setSelectedDevice] = useState(null)


//recuperation du a1 pour requêtes
    const a1Handler = async (a1) => {
        if (a1.length === 12) {
            setA1(a1);
            await getToken(a1);
        } else {
            setA1("");
        }
    }
    const MacHandler = async (mac) => {
        if (mac.length === 12) {
            setMac(mac);
            // await getToken(mac);
        } else {
            setMac("");
        }
    }

// recuperation data

    let newMapConfiguration = {};


    const getToken = async (a1) => {
        try {
            let token = await getTokenAPI("device");

            // Get the list of installation by a A1
            let installationsListResult = await getListInstallation(token, a1)


            let installationsList = [];
            let tempMapDevicesData = {};
            for (let install of installationsListResult.data) {

                let installationResult = await getListOfRoomByInstallation(token, a1, install)

                let devices = [];
                //for each room, get the data of
                for (let room of installationResult.data.rooms) {

                    let configurationResult = await getDataByDeviceID(token, room.devices[0].Id_deviceId);
                    newMapConfiguration[room.devices[0].Id_deviceId] = configurationResult.data;
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

                    tempMapDevicesData[room.devices[0].Id_deviceId] = deviceConfigurationData;
                   console.log(room.devices[0].Id_deviceId);
                    setDeviceID(room.devices[0].Id_deviceId)
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




            console.log("device id");
            console.log(device_id)
            setInstallationsList(installationsList);
            console.log(installationsList)
            console.log("tempdevicedata avant set")
            setMapDevicesData(tempMapDevicesData[device_id]);
            console.log("tempdevicedata après set")

            console.log("tempDeviceData")
            console.log(tempMapDevicesData)
            console.log("map deivces data")




            //setMapDevicesData(new Map(mapDevicesData.set(device_id, tempMapDevicesData)))
            setMapDevicesData(new Array(mapDevicesData[device_id] = tempMapDevicesData))
            setMapDevicesData(new Array(mapDevicesData[device_id] = tempMapDevicesData))
          /*  console.log(mapDevicesData[""]["240AC41C7164"][6].col3)
            console.log(mapDevicesData[""]["240AC41C7164"][18].col3)
            console.log(mapDevicesData[""]["240AC41C7164"][20].col3)
            console.log(mapDevicesData[""]["240AC41C7164"][2].col3)
            console.log(mapDevicesData[""]["240AC41C7164"][1].col3)
            console.log(mapDevicesData[""]["240AC41C7164"][12].col3)
            console.log("test")
            console.log(mapDevicesData);*/

            mapDevicesData.map(elem=> {
                console.log("tototoot")
                console.log(elem)
            })
        } catch (e) {

            console.error(e);
        }
    }


    const [installationsList, setInstallationsList] = useState([]);
    const [mapDevicesData, setMapDevicesData] = useState([])


    const addToClipboard = (content) => {
        navigator.clipboard.writeText(content.target.innerText);
        toast.info('Ajouté au presse-papier: ' + content.target.innerText, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    };

    useEffect(() => {
        //setMapDevicesData(getToken(a1))
        //console.log(mapDevicesData)

    }, []);


    async function DataRefresh() {

        console.log("install ID")
        console.log(install_id)

        console.log(device_id)

        let dataRefreshed;

        await sendUserConnected(a1, install_id, device_id);

        let token = await getTokenAPI("device");
        // setTimeout(5000, test());


        dataRefreshed = await getDataByDeviceID(token, device_id)


        let RowUpdated = [];
        let added = 0;
        let newMap = {};
        for (const [key, value] of Object.entries(dataRefreshed.data)) {

            added++;
            RowUpdated.push({
                id: added,
                'col1': value.timestamp,
                'col2': key,
                'col3': value.value
            })
        }
        console.log("row")


        console.log("apres")
        //setMapDevicesData(mapDevicesData[device_id] = RowUpdated)
        console.log("toto")
        //console.log(mapDevicesData[""][device_id][0].col3)
    }

    function test() {
        for (let i = 0; i < 10000; i++) {
            console.log(i)
        }
    }


    // creation accodion avec tableaux a partir de la map des donnes obtenu
    return (

        <Grid container spacing={3} marginTop="0%" key={Math.random()}
        >
            <Grid item xs={9} key={Math.random()}>
                <form>
                    <div style={{paddingLeft: "35%", justifyContent: "space-between"}}>
                        <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
                        <TextField id="outlined-basic" label="A1" variant="outlined"
                                   onChange={(e) => a1Handler(e.target.value)}/>
                        <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
                        <TextField id="outlined-basic2" label="MAC" variant="outlined"
                                   onChange={(e) => MacHandler(e.target.value)}/>
                    </div>
                </form>


                {mac.length === 0 && a1.length === 12 ? <div style={{
                    flexDirection: "row",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "100%",
                    marginLeft: "20%"

                }}>

                    {installationsList.map(station => (

                        station.devices.map(device => (

                            <div style={{
                                borderStyle: "solid",
                                borderColor: "red" /* red */,
                                height: "10%",
                                width: "45%",
                                display: "flex",
                                flexDirection: "row"
                            }} key={Math.random()}>


                                <div><DeviceDataBubbleComponent// keyValue={mapDevicesData[""][device.deviceName][0].col3}
                                    //                          mode={mapDevicesData[""][device.deviceName][6].col3}
                                    //                          device_name={mapDevicesData[device.deviceName][20].col3}
                                    //                          install_name={mapDevicesData[device.deviceName][18].col3}
                                    //                          temp={((((mapDevicesData[device.deviceName][1].col3) / 10) - 32) / 1.8).toPrecision(3)}
                                                           // last_updated={mapDevicesData[""]["240AC41C7164"][0].col3}
                                                             data={installationsList}
                                                                 a1={a1}
                                    // rows={mapDevicesData[device.deviceName]}
                                                               Installation_Id={station.installation}
                                                                Device_Id={device.deviceName}/>


                                </div>


                                <IconButton onClick={async () => {

                                    setSelectedDevice(device);
                                    setDeviceID(device.deviceName);
                                    setInstallID(station.installation)
                                    await DataRefresh()
                                }}> <RefreshIcon sx={{
                                    position: "left",
                                    float: "20%",
                                    Width: "10%",
                                    height: "10%",
                                }}/> </IconButton>
                            </div>
                        ))

                    ))}

                </div> : (
                    <div>rien</div>)
                }


            </Grid>
        </Grid>
    )
}

export default DeviceDataComponent
