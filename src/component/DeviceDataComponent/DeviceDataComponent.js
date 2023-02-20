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
import {useParams} from "react-router-dom";
import {TextField} from "@mui/material";

//creation item par rapport à une liste de données


const DeviceDataComponent = () => {

    const {enqueueSnackbar} = useSnackbar();
    const [a1, setA1] = useState('');
    const [mac, setMac] = useState('');
    const [install_id, setInstallID] = useState('')
    const [device_id, setDeviceID] = useState('')
    const [installationsList, setInstallationsList] = useState([]);
    const [mapDevicesData, setMapDevicesData] = useState(new Map())
    const [mapWattsTypeForUc, setMapWattsTypeForUc] = useState('')
    const [ucValue, setUcValue] = useState('')
    const [a1ValueForUc, setA1ValueForUc] = useState('');


    let {cloud} = useParams();
    let cloud_varible =cloud.toUpperCase();

//recuperation du a1 pour requêtes
    const a1Handler = async (a1) => {

        if (a1.length === 12) {
            setMac("")
            setA1(a1);

            await getDataByInput(a1, "a1");

        } else {
            setA1("");

        }

    }


    function getDataByColName(mapData, attr) {

        for (let element of mapData) {


            if (element.col2 === attr) {
                return element.col3
            }

        }
        //si il n'y a pas de données, on retoune --
        return "--"
    }

    const MacHandler = async (mac) => {

        if (mac.length === 12) {
            setA1("")
            setMac(mac);
            await getDataByInput(mac, "mac")

        } else {
            setMac("");
        }

    }

// recuperation data

    let newMapConfiguration = {};


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


    const getDataByInput = async (value, mode) => {
        ManageDisplay()


        console.log(cloud_varible)
        let token = await getTokenAPI("device",cloud);
        if (mode === "a1") {


            // Get the list of installation by a A1
            let installationsListResult = await getListInstallation(token, value)
            let installationsList = [];
            let tempMapDevicesData = {};

            if (installationsListResult.data === '') {
                ManageDisplay()
            }

            for (let install of installationsListResult.data) {
                let installationResult = await getListOfRoomByInstallation(token, value, install)
                let devices = [];

                //for each room, get the data of
                for (let room of installationResult.data.rooms) {

                    let configurationResult = await getDataByDeviceID(token, room.devices[0].Id_deviceId)

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

                //udate the installationList state
                setInstallationsList(installationsList);
                for (let [key, value] of Object.entries(tempMapDevicesData)) {

                    setMapDevicesData(new Map(mapDevicesData.set(key, value)))
                }


            }

            enqueueSnackbar('Data received ! With ' + installationsList.length + " Devices");
        } else {
            let tempMapDevicesData = {};
            let configurationResult = await getDataByDeviceID(token, value);
            let deviceConfigurationData = transformData(configurationResult);
            setMapWattsTypeForUc(deviceConfigurationData)


            //valeur du A1 correspondant au device


            setA1ValueForUc(getDataByColName(deviceConfigurationData, "A1"))


            //avec le a1 obtenu on obtient la liste des installation lié à L'A1
            let installationsListResult = await getListInstallation(token, a1ValueForUc)


            //la strat ici est de faire une comparaison sur les intallationId que l'utilisateur possède par rapport au A1 obtenu avec la mac donné
            for (let install of installationsListResult.data) {

                let installationResult = await getListOfRoomByInstallation(token, a1ValueForUc, install)

                //ici on réalise une boucle sur toutes les intallationsID de l'utilisateur et si on trouve une installation qui possède la mac donnée, cela veut dire que on a bien trouvé notre instalaltionID par rapport à notre MAC
                // on rapelle qu'on utilise installationId pour créer le compoenent permettant d'afficher nos informations a traverse le compoenent wattstype
                if (installationResult.data.rooms[0].devices[0].Id_deviceId === value) {

                }
                for (let room of installationResult.data.rooms) {
                    tempMapDevicesData[room.devices[0].Id_deviceId] = deviceConfigurationData;
                }

            }


        }

    }


    useEffect(() => {


    }, []);


    async function DataRefresh() {

        let dataRefreshed;
        await sendUserConnected(a1, install_id, device_id);
        let token = await getTokenAPI("device");
        dataRefreshed = await getDataByDeviceID(token, device_id)
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

        setUcValue(1);
        forceUpdate();
        setTimeout(function () {
            setUcValue(0)
        }, 300000);
        enqueueSnackbar('Data refreshed !');

    }

    const [, forceUpdate] = useReducer(x => x + 1, 0);


    function ManageDisplay() {
        if (mapDevicesData.size > 0) {

//si y' apas de device, on n'affiche aucun component
            document.querySelectorAll(".Test").forEach(elem => elem.style.visibility = 'hidden');

        }
        return <div> y'a R</div>
    }

    return (

        <Grid container spacing={3} marginTop="0%" key={Math.random()}
        >
            <Grid item xs={9} key={Math.random()}>

                <div style={{paddingLeft: "35%", justifyContent: "space-between"}}>
                    <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
                    <TextField id="outlined-basic" label="A1" variant="outlined"
                               onChange={(e) => a1Handler(e.target.value)}/>
                    <AccountCircle sx={{color: 'action.active', mr: 1, my: 2}}/>
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
                        {/*la strat ici est de boucler sur la map installationListe qui ocntient toutes les installations de l'utilisateur,*/}
                        {/*ensuite pour chaque résultat on voir  les données correspondant pour le device associté à l'installation en cours de boucle (dans deviceDataMap)*/}
                        {mapDevicesData.length === 0 ? <div></div> :
                            installationsList.map(station => (

                                station.devices.map(device => (

                                    <div style={{
                                        height: "9%",
                                        width: "45%",
                                        display: "flex",
                                        flexDirection: "row",
                                        paddingTop: "5%",
                                    }} className="Test" key={Math.random()}>

                                        <div>

                                            {/*ici pour roomName, on a pas la bonne data dans DeviceMap, on prends donc dans la map installationListe pour le device en question*/}
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
                                                                        uc={ucValue}


                                            />}


                                        </div>


                                        <IconButton disableFocusRipple disableRipple disableTouchRipple

                                                    onClick={async () => {


                                                        setDeviceID(device.deviceName);
                                                        setInstallID(station.installation)
                                                        await DataRefresh();
                                                    }}> <RefreshIcon sx={{
                                            position: "left",
                                            float: "20%",
                                            Width: "10%",
                                            height: "10%"
                                        }}/> </IconButton>
                                    </div>

                                ))

                            ))}

                    </div> : (
                        <div>
                            {mac.length === 12 && a1.length === 0 ? (
                                <PopupWattsType row={mapWattsTypeForUc} device_ID={mac} installation_ID={install_id}
                                                a1={a1ValueForUc} mode={"MAC"}/>) : (
                                <div style={{paddingLeft: "35%"}}>Rien </div>)}


                        </div>)
                    }
                </SnackbarProvider>

            </Grid>
        </Grid>


    )

}

export default DeviceDataComponent