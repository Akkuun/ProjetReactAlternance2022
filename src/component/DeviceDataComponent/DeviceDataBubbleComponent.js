import * as React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PopupWattsType from "../popupComponent/popupWattsType";


const DeviceDataBubbleComponent = ({
                                       install_name,
                                       device_name,
                                       mode,
                                       temp,
                                       last_updated,
                                       uc,
                                       keyValue,
                                       rows,
                                       a1,
                                       Installation_Id,
                                       Device_Id
                                   }) => {



    let ImageCard, IsConnectedImage;





    function getImageCard() {
        if (mode === 1) {
            ImageCard = <LocalFireDepartmentRoundedIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        } else if (mode === 5) {
            ImageCard = <HourglassBottomRoundedIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        } else if (mode === 0) {
            ImageCard = <CancelRoundedIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        } else if (mode === 4) {
            ImageCard = <AcUnitRoundedIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        } else if (mode === 3) {
            ImageCard = <AccessTimeRoundedIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        } else if (mode === 6) {
            ImageCard = <PanToolRoundedIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        } else if (mode === 2) {
            ImageCard = <WatchLaterIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        }
        return ImageCard;
    }

    function getIsconnected() {
        uc === 0 ? IsConnectedImage = <CircleOutlinedIcon fontSize={"22%"} sx={{marginTop: "6%"}}/> : IsConnectedImage =
            <CircleIcon fontSize={"22%"} sx={{marginTop: "6%"}}/>
        return IsConnectedImage;
    }


    return (

        <Card sx={{
            Width: "100%",
            height: "100%",
            maxWidth: "100%",
            borderRadius: 5,
            flex: "80%",
            marginTop: "5%",


        }}>
            <CardHeader
                avatar={
                    <LocationOnIcon fontSize={"large"}>

                    </LocationOnIcon>
                }

                title={
                    <Typography gutterBottom variant="h5" component="h2" fontSize={40}>
                        {install_name} - {device_name}
                    </Typography>
                }/>


            <CardContent key={keyValue}>
                <div style={{
                    display: 'flex',
                    alignItems: 'left',
                    height: 125,
                    maxHeight: 150,
                    fontSize: 75,
                    maxWidth: "100%",
                    width: "100%",
                    justifyContent: "center",

                }}>

                    {getImageCard()}
                    <div style={{fontSize: "40%"}}>
                        {getIsconnected()}

                    </div>
                    <div style={{
                        fontSize: 75,
                        paddingTop: "5%",
                        width: "80%"
                    }}>    {temp} °C
                    </div>
                    <div ><PopupWattsType row={rows} device_ID={Device_Id} installation_ID={Installation_Id} a1={a1} /></div>


                </div>

                <Typography variant="body2" color="text.secondary" sx={{marginTop: '5%', fontSize: 30}}>
                    Last update : {last_updated}
                </Typography>
            </CardContent>

        </Card>
    );

}


export default DeviceDataBubbleComponent;