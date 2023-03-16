import React from "react"
import {useParams} from "react-router-dom";

function GetCloudFunction() {
    let {cloud} = useParams();
    let cloud_Name = cloud.toUpperCase();
    return cloud_Name
}
const pageLocalisation = ()=> {


    let cloud = GetCloudFunction()
    window.open(`http://10.99.3.48/LocalisationDevice/?cloud=${cloud}`, '_blank');
    return (

        <div>

            home
        </div>

    )


}

export default pageLocalisation;