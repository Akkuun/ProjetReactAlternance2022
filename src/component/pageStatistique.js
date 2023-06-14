import React from "react"
import InfluxDBComponent from "./InfluxDb/InfluxDBComponent";

const pageStatistique = () => {

    return (
        <div style={{height:"80%",width:"50%", paddingLeft:"25%"}} >
            <InfluxDBComponent/>
        </div>
    )
};

export default pageStatistique;