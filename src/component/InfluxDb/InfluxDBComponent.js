import React, {useState} from "react";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import {InfluxDB} from "@influxdata/influxdb-client";

import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

const InfluxDBComponent = () => {


    const [value, setValue] = React.useState();
    const [value2, setValue2] = React.useState();

    const token = '5NqNMxecJV6FuXdsGvNH0rizry14lMI0Jqvs8mig23kBAY8I-KDDaLRflhQ5OpFv6cLu4DpmibSlHuYkwa2Awg=='
    let org = `Watts`
    const url = 'http://10.99.3.47:8086'
    const queryApi = new InfluxDB({url, token}).getQueryApi(org)

    const fluxQuery = `from(bucket: "StatsWattsType")
      |> range(start: 2023-04-04T15:48:20Z, stop: 2023-06-12T15:48:20Z)
      |> filter(fn: (r) => r["_measurement"] == "measurementWattsType")
      |> filter(fn: (r) => r["cloud"] == "Deltacalor")
      |> filter(fn: (r) => r["wattsType"] == "Bt")
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
                label: "Resultats",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: dataInflux,
            },
        ],
    };


    return (
        <div style={{  borderColor:"red",borderStyle:"solid", height:"70%", width:"60%", position:"center"}}>
             <div >
                 <Line data={dataInfluxRes} style={{borderColor:"blue", borderStyle:"solid"}}  />
             </div>



            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <div style={{display:"flex", flexDirection:"row" ,borderColor:"green", borderStyle:"solid"}}>
                        <DateTimePicker
                            label="Début"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                        />
                        <DateTimePicker
                            label="Fin"
                            value={value2}
                            onChange={(newValue) => setValue2(newValue)}
                        />
                        <Select
                            disabled={false}
                            placeholder="Choix wattsType…"
                        >
                            <Option value={"Bt"}>Bt</Option>
                            <Option value={"Cm"}>Cm</Option>
                            <Option value={"Ma"}>Ma</Option>
                            <Option value={"Rt"}>Rt</Option>
                            <Option value={"bo"}>bo</Option>
                            <Option value={"cf"}>cf</Option>
                            <Option value={"df"}>df</Option>
                            <Option value={"ec"}>ec</Option>
                        </Select>

                        <Select
                            disabled={false}
                            placeholder="Choix cloud…"
                        >
                            <Option value={"Deltacalor"}>Deltacalor</Option>
                            <Option value={"Dev"}>Dev</Option>
                            <Option value={"FENIX"}>FENIX</Option>
                            <Option value={"GKP"}>GKP</Option>
                            <Option value={"Prod"}>Prod</Option>
                        </Select>
                        <Button variant="contained" endIcon={<SendIcon /> } onClick={() => {
                            console.log()



                        }}>
                            Envoyer requête
                        </Button></div>
                </DemoContainer>
            </LocalizationProvider>



        </div>

    )


}


export default InfluxDBComponent



