import React, {useState} from "react";

import LineChart from "./LineChart";
import TimePickingComponent from "./TimePickingComponent"

const InfluxDBComponent = () => {



    return (
        <div style={{  borderColor:"red",borderStyle:"solid", height:"70%", width:"60%", position:"center"}}>
             <div > <LineChart /></div>
            <TimePickingComponent/>
        </div>

    )


}


export default InfluxDBComponent



