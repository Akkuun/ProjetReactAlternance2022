import React from "react";
import {InfluxDB} from "@influxdata/influxdb-client";
import {FluxTableMetaData} from "@influxdata/influxdb-client";

const InfluxDBComponent = ()=> {
    const {InfluxDB} = require('@influxdata/influxdb-client')

    const token = 'SN12c-NOIptEN7rTWtFcnCLPkw2yxTNyDV6OFf4t-g0wmHg3AJhzrH0M9AXFX0qKpFwv9GpRhTVe2uTzhsr1eg=='
    let org = `Watts`
    const url = 'http://10.99.3.47:8086'
    let bucket = `StatsWattsType`

    const client = new InfluxDB({url, token})
    let queryClient = client.getQueryApi(org)

    const fluxQuery = `from(bucket: "StatsWattsType")
          |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
          |> filter(fn: (r) => r["cloud"] == "Dev")
          |> filter(fn: (r) => r["wattsType"] == "Cm")
          |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
          |> yield(name: "mean")`

    queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
            const tableObject = tableMeta.toObject(row)
            console.log(tableObject)
        },
        error: (error) => {
            console.error('\nError', error)
        },
        complete: () => {
            console.log('\nSuccess')
        },
    })

    return (


    <div> salut</div>

)
}


export default InfluxDBComponent