
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import {InfluxDB} from "@influxdata/influxdb-client";




const token = '5NqNMxecJV6FuXdsGvNH0rizry14lMI0Jqvs8mig23kBAY8I-KDDaLRflhQ5OpFv6cLu4DpmibSlHuYkwa2Awg=='
let org = `Watts`
const url = 'http://10.99.3.47:8086'
const queryApi = new InfluxDB({url, token}).getQueryApi(org)

const fluxQuery = `from(bucket: "StatsWattsType")
      |> range(start: 2023-04-04T15:48:20Z, stop: 2023-06-12T15:48:20Z)
      |> filter(fn: (r) => r["_measurement"] == "measurementWattsType")
      |> filter(fn: (r) => r["cloud"] == "Deltacalor")
      |> filter(fn: (r) => r["wattsType"] == "Ma")
      |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
      |> yield(name: "mean")`
let dataInflux=[]
let timeInflux=[]



const myQuery = async () => {
    for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
        const o = tableMeta.toObject(values)
        dataInflux.push(o._value)
        timeInflux.push(o._time)
    }
}
dataInflux.map(x=> console.log(x))


/** Execute a query and receive line table metadata and rows. */
myQuery().then(r => console.log(r))


console.log(timeInflux)
console.log(dataInflux)

const dataInfluxRes = {
    labels: timeInflux,
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: dataInflux,
        },
    ],
};

const LineChart = () => {
    return (
        <div>
            <Line data={dataInfluxRes} />

        </div>
    );
};
export default LineChart;