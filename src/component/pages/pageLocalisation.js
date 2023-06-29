import React from "react"
import {useParams} from "react-router-dom";
//function design to get the current cloud
function GetCloudFunction() {
    let {cloud} = useParams();
    let cloud_Name = cloud.toUpperCase();
    return cloud_Name
}
const pageLocalisation = ()=> {
    //get the cloud
    let cloud = GetCloudFunction()
    //open a new windows for the map
    window.open(`http://10.99.3.48/LocalisationDevice/?cloud=${cloud}`, '_blank');
    return (
        <div>
            home
        </div>
    )
}

export default pageLocalisation;