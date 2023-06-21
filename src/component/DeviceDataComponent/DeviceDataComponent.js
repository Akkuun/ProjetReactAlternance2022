import * as React from 'react';
import {useEffect, useReducer, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Grid from "@mui/material/Grid";
import {AccountCircle} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    getDataByDeviceID,
    getListInstallation,
    getListOfRoomByInstallation,
    getTokenAPI,
    sendUserConnected
} from "../../services/Api";
import PopupWattsType from "../popupComponent/popupWattsType";
import DeviceDataBubbleComponent from "./DeviceDataBubbleComponent";
import {SnackbarProvider, useSnackbar} from 'notistack';
import {useLocation, useParams} from "react-router-dom";
import {TextField} from "@mui/material";

//component which create all the other data component
const DeviceDataComponent = () => {
    //notification object
    const {enqueueSnackbar} = useSnackbar();
    //states declaration
    const [a1, setA1] = useState('');
    const [mac, setMac] = useState('');
    const [install_id, setInstallID] = useState('')
    const [device_id, setDeviceID] = useState('')
    //array which contains all the installation of a user by a MAC/A1
    const [installationsList, setInstallationsList] = useState([]);
    //map which contains all the data of a device
    const [mapDevicesData, setMapDevicesData] = useState(new Map())
    const [mapWattsTypeForUc, setMapWattsTypeForUc] = useState('')
    const [ucValue, setUcValue] = useState(new Map())
    const [a1ValueForUc, setA1ValueForUc] = useState('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    // get thr current cloud in the cookies
    let {cloud} = useParams();
    let cloud_Name = cloud.toUpperCase();
    let newMapConfiguration = {};
    const location = useLocation();
    //function design to get the A1 value
    const a1Handler = async (a1) => {
        if (a1.length === 12) {
            setMac("")
            setA1(a1);
            await GetDataByInput(a1, "a1");
        } else {
            setA1("");
        }
    }
    //function designed to get data by a column name specified of a map
    function getDataByColName(mapData, attr) {
        for (let element of mapData) {
            if (element.col2 === attr) {
                return element.col3
            }
        }
        return "--"
    }
    //function designed to get the MAC value
    const MacHandler = async (mac) => {
        if (mac.length === 12) {
            setA1("")
            setMac(mac);
            await GetDataByInput(mac, "mac")
        } else {
            setMac("");
        }
    }
    //function designed to get the correct value of the JSON object passed in parameter
    function transformData(configurationResult) {
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
        return deviceConfigurationData;
    }
    //function designed get the data from the different input (A1 or MAC) and print fill out specific Map/array depending on the mode used
    const GetDataByInput = async (value, mode) => {
        //erase the previous component for the new request
        ManageDisplay()
        let token = await getTokenAPI("device", cloud_Name);
        if (mode === "a1") {
            // Get the list of installation by a A1
            let installationsListResult = await getListInstallation(token, value, cloud_Name)
            let installationsList = [];
            let tempMapDevicesData = {};
            if (installationsListResult.data === '') {
                ManageDisplay()
            }
            for (let install of installationsListResult.data) {
                let installationResult = await getListOfRoomByInstallation(token, value, install, cloud_Name)
                let devices = [];
                //for each room, get the data of
                for (let room of installationResult.data.rooms) {
                    let configurationResult = await getDataByDeviceID(token, room.devices[0].Id_deviceId, cloud_Name)
                    newMapConfiguration[room.devices[0].Id_deviceId] = configurationResult.data;
                    let deviceConfigurationData = transformData(configurationResult);
                    tempMapDevicesData[room.devices[0].Id_deviceId] = deviceConfigurationData;
                    //devices data
                    devices.push({
                        roomName: room.Rn,
                        deviceName: room.devices[0].Id_deviceId,
                        wattsType: deviceConfigurationData,
                        Il: installationResult.data.Il
                    })
                }
                //installation data on doit push en dehors de la boucle sinon on a un duplicata de données non voulu
                installationsList.push({
                    installation: install,
                    devices: devices
                });
                //update the installationList state
                setInstallationsList(installationsList);
                for (let [key, value] of Object.entries(tempMapDevicesData)) {
                    setMapDevicesData(new Map(mapDevicesData.set(key, value)))
                }
            }
            enqueueSnackbar('Data received ! With ' + installationsList.length + " Devices");
        } else {
            let tempMapDevicesData = {};
            let configurationResult = await getDataByDeviceID(token, value, cloud_Name);
            let deviceConfigurationData = transformData(configurationResult);
            //set states for futur UC use
            setMapWattsTypeForUc(deviceConfigurationData)
            setA1ValueForUc(getDataByColName(deviceConfigurationData, "A1"))
            let installationsListResult = await getListInstallation(token, a1ValueForUc, cloud_Name)
            // we make a comparison on every installationID of the user with the installationID given by the MAC inserted
            for (let install of installationsListResult.data) {
                let installationResult = await getListOfRoomByInstallation(token, a1ValueForUc, install, cloud_Name)
                //loop on evry installationID of the user, if we found the MAC, we save the installationID
                if (installationResult.data.rooms[0].devices[0].Id_deviceId === value) {
                }
                for (let room of installationResult.data.rooms) {
                    tempMapDevicesData[room.devices[0].Id_deviceId] = deviceConfigurationData;
                }
            }
        }

    }
    // State callBack used to force a synchronisation and allow a dynamic refresh
    useEffect(() => {
        ManageDisplay()
        setMac("")
    }, [location]);
    //function design to send a request to update data map/array and refresh the current component with ManageDisplay()
    async function DataRefresh(installation_id_param,device_id_param) {
        let dataRefreshed;
        await sendUserConnected(a1, install_id, device_id, cloud_Name);
        let token = await getTokenAPI("device", cloud_Name);
        dataRefreshed = await getDataByDeviceID(token, device_id, cloud_Name)
        let RowUpdated = [];
        let added = 0;
        for (const [key, value] of Object.entries(dataRefreshed.data)) {
            added++;
            RowUpdated.push({
                id: added,
                'col1': value.timestamp,
                'col2': key,
                'col3': value.value
            })
        }
        setMapDevicesData(mapDevicesData.set(device_id, RowUpdated))
        forceUpdate()
        setUcValue(ucValue.set(device_id_param,1));
        setTimeout(function () {
            setUcValue(ucValue.set(device_id_param,0))
        }, 300000);
        enqueueSnackbar('Data refreshed !');
    }
    //function designed to display nothing if we don't have/received data and erased precedent object from a previous request
    function ManageDisplay() {
        if (mapDevicesData.size > 0) {
            document.querySelectorAll(".DeviceDataBubble").forEach(elem => elem.style.visibility = 'hidden');
        }
        return <div></div>
    }
    return (
        <Grid container spacing={3} marginTop="0%" key={Math.random()}
        >
            <Grid item xs={9} key={Math.random()}>

                <div style={{paddingLeft: "35%", justifyContent: "space-between"}}>
                    <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
                    <TextField  id="outlined-basic" label="A1" variant="outlined"
                               onChange={(e) => a1Handler(e.target.value)}/>
                    <AccountCircle sx={{color: 'action.active', mr: 1, my: 2,paddingLeft:"30%"}}/>
                    <TextField id="outlined-basic2" label="MAC" variant="outlined"
                               onChange={(e) => MacHandler(e.target.value)}/>
                </div>

                <SnackbarProvider maxSnack={3}>


                    {mac.length === 0 && a1.length === 12 ? <div style={{
                        flexDirection: "row",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        width: "100%",
                        marginLeft: "20%"

                    }}>
                        {/*We loop on the installationListe Map which contain all user installation, and on every installation, we use his data to create bubble component*/}
                        {mapDevicesData.length === 0 ? <div></div> :
                            installationsList.map(station => (
                                station.devices.map(device => (
                                    <div style={{
                                        height: "9%",
                                        width: "45%",
                                        display: "flex",
                                        flexDirection: "row",
                                        paddingTop: "5%",
                                    }} className="DeviceDataBubble" key={Math.random()}>
                                        <div>
                                            {<DeviceDataBubbleComponent keyValue={Math.random()}
                                                                        mode={getDataByColName(mapDevicesData.get(device.deviceName), "Cm")}
                                                                        device_name={getDataByColName(mapDevicesData.get(device.deviceName), "S2")}
                                                                        install_name={device.roomName}
                                                                        temp={((((getDataByColName(mapDevicesData.get(device.deviceName), "At")) / 10) - 32) / 1.8).toPrecision(3)}
                                                                        last_updated={getDataByColName(mapDevicesData.get(device.deviceName), "Dd")}
                                                                        data={installationsList}
                                                                        a1={a1}
                                                                        rows={mapDevicesData.get(device.deviceName)}
                                                                        Installation_Id={station.installation}
                                                                        Device_Id={device.deviceName}
                                                                        uc={ucValue.get(device.deviceName)}
                                            />}
                                        </div>
                                        {/*refresh data button functionality*/}
                                        <IconButton disableFocusRipple disableRipple disableTouchRipple
                                                    onClick={async () => {
                                                        // function used to get the id,device name of the device/installation to refresh and refresh the data
                                                        let Device_id_for_refresh;
                                                        setDeviceID(device.deviceName);
                                                        setInstallID(station.installation)
                                                        //loop on every installation to get the installation with the current roomName clicked to get the id
                                                        for (let element in installationsList){
                                                            for(let a in installationsList[element].devices){
                                                            if(installationsList[element].devices[a].roomName===device.roomName)  Device_id_for_refresh = installationsList[element].devices[a].deviceName
                                                            }
                                                        }
                                                        setDeviceID(Device_id_for_refresh)
                                                        //refresh the data of the bubble component clicked
                                                        await DataRefresh(station.installation,Device_id_for_refresh);
                                                    }}> <RefreshIcon sx={{
                                            position: "left",
                                            float: "20%",
                                            Width: "10%",
                                            height: "10%",
                                            display: "flex"
                                        }}/> </IconButton>
                                    </div>
                                ))
                            ))}
                    {/*print the Popup direct if we only enter the MAC*/}
                    </div> : (
                        <div>
                            {mac.length === 12 && a1.length === 0 ? (
                                <PopupWattsType row={mapWattsTypeForUc} device_ID={mac} installation_ID={install_id}
                                                a1={a1ValueForUc} mode={"MAC"} cloud={cloud_Name}/>) : (
                                <div style={{paddingLeft: "35%"}}>Rien </div>)}
                        </div>
                    )
                    }
                </SnackbarProvider>

            </Grid>
        </Grid>
    )
}

export default DeviceDataComponent