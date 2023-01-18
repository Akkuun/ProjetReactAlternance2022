import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PlayCircleFilledWhiteRoundedIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';



const DeviceDataBubbleComponent = ({
                                     install_name,
                                     device_name,
                                     mode,
                                     temp,
                                     last_updated,
                                       uc
                                 }) => {

    const [expanded, setExpanded] = React.useState(false);
    let ImageCard,IsConnectedImage;
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    function getImageCard(){
        if(mode===1){
            ImageCard = <LocalFireDepartmentRoundedIcon fontSize={"22%"} sx={{marginTop:"6%"}}  />
        }
        else if(mode===2){
            ImageCard = <HourglassBottomRoundedIcon fontSize={"22%"} sx={{marginTop:"6%"}} />
        }
        else if (mode ===3){
            ImageCard = <CancelRoundedIcon fontSize={"22%"} sx={{marginTop:"6%"}} />
        }
        else if (mode ===4){
            ImageCard = <PlayCircleFilledWhiteRoundedIcon fontSize={"22%"} sx={{marginTop:"6%"}}/>
        }
        else if (mode ===5){
            ImageCard =<AcUnitRoundedIcon fontSize={"22%"} sx={{marginTop:"6%"}} />
        }
        else if (mode ===6){
            ImageCard = <AccessTimeRoundedIcon fontSize={"22%"} sx={{marginTop:"6%"}}/>
        }
        else if (mode ===7){
            ImageCard = <PanToolRoundedIcon fontSize={"22%"} sx={{marginTop:"6%"}}/>
        }
        return ImageCard;
    }

    function getIsconnected(){
        uc===0? IsConnectedImage=<CircleOutlinedIcon fontSize={"22%"} sx={{marginTop:"6%"}}/> :  IsConnectedImage=<CircleIcon fontSize={"22%"} sx={{marginTop:"6%"}}/>
        return IsConnectedImage;
    }





    return (

        <Card sx={{Width: "40%", maxWidth:"40%",borderRadius:5,flex:"80%",marginTop:"5%", borderStyle:"solid",borderColor:"blue"}}>
            <CardHeader
                avatar={
                    <LocationOnIcon fontSize={"large"}>

                    </LocationOnIcon>
                }

                title={
                    <Typography gutterBottom variant="h5" component="h2" fontSize={40}>
                        {install_name} - {device_name}
                    </Typography>
                } />



            <CardContent>
                <div style={{
                    display: 'flex',
                    alignItems: 'left',
                    height:125,
                    maxHeight:150,
                    fontSize:75,
                    maxWidth:"100%",
                    width:"100%",
                    borderStyle:"solid",borderColor:"purple",justifyContent:"center",
                }}>

                    {getImageCard()}
                    <div style={{fontSize:"40%"}}>
                        {getIsconnected()}

                    </div>
                    <div style={{fontSize:75, paddingTop:"5%"}}>    {temp} °C  <IconButton> <InfoIcon/></IconButton> </div>

                </div>

                <Typography variant="body2" color="text.secondary"  sx={{marginTop:'5%',fontSize:40}} >
                    Last update : {last_updated} <IconButton>  <RefreshIcon /> </IconButton>
                </Typography>
            </CardContent>

        </Card>
    );

}

export default DeviceDataBubbleComponent;