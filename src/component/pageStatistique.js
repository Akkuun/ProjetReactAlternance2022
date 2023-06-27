import React from "react"
import InfluxDBComponent from "./InfluxDb/InfluxDBComponent";

const pageStatistique = () => {
    return (
        <div style={{width:"80%", paddingLeft:"10%"}} >
            <InfluxDBComponent/>
        </div>
    )
};

export default pageStatistique;