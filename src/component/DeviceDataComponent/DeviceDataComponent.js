import * as React from 'react';
import {useEffect, useReducer, useState} from 'react';
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import {Icon, TextField} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
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


//creation item par rapport à une liste de données


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


            setInstallationsList(installationsList);

            for (let [key, value] of Object.entries(tempMapDevicesData)) {
                console.log(key)
                console.log(value)
                setMapDevicesData(new Map(mapDevicesData.set(key, value)))
            }

        } catch (e) {

            console.error(e);
        }
    }


    const [installationsList, setInstallationsList] = useState([]);
    const [mapDevicesData, setMapDevicesData] = useState(new Map())
    const [ucValue, setUcValue] = useState(0)

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


    }, []);


    async function DataRefresh() {


        let dataRefreshed;

        await sendUserConnected(a1, install_id, device_id);

        let token = await getTokenAPI("device");


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


        console.log("apres")
        setMapDevicesData(mapDevicesData.set(device_id, RowUpdated))
        console.log(mapDevicesData)
        setUcValue(1);
        forceUpdate();

        setTimeout(function() {
            setUcValue(0)
        }, 300000);


    }


    const [, forceUpdate] = useReducer(x => x + 1, 0);


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
                                height: "10%",
                                width: "45%",
                                display: "flex",
                                flexDirection: "row"
                            }} key={Math.random()}>


                                <div>

                                    {<DeviceDataBubbleComponent keyValue={Math.random()}
                                                                mode={mapDevicesData.get(device.deviceName)[4].col3}
                                                                device_name={mapDevicesData.get(device.deviceName)[20].col3}
                                                                install_name={mapDevicesData.get(device.deviceName)[18].col3}
                                                                temp={((((mapDevicesData.get(device.deviceName)[1].col3) / 10) - 32) / 1.8).toPrecision(3)}
                                                                last_updated={mapDevicesData.get(device.deviceName)[6].col3}
                                                                data={installationsList}
                                                                a1={a1}
                                                                rows={mapDevicesData.get(device.deviceName)}
                                                                Installation_Id={station.installation}
                                                                Device_Id={device.deviceName}
                                                                uc={ucValue}
                                    />}


                                </div>


                                <IconButton  disableFocusRipple disableRipple disableTouchRipple
                                 onClick={async () => {

                                    setSelectedDevice(device);
                                    setDeviceID(device.deviceName);
                                    setInstallID(station.installation)
                                    await DataRefresh()
                                }}> <RefreshIcon sx={{
                                    position: "left",
                                    float: "20%",
                                    Width: "10%",
                                    height: "10%",
                                }} /> </IconButton>
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
