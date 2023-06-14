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
import {InputLabel, MenuItem, TextField} from "@mui/material";
import {Autocomplete, FormControl, FormHelperText} from "@mui/joy";
import Box from "@mui/material/Box";
const optionsMode = ['Bt','Cm','Ma','Rt','bo','cf','df','ec'];
const optionsCloud = ['Bt','Cm','Ma','Rt','bo','cf','df','ec'];
const InfluxDBComponent = () => {


    const [valueDebut, setValueDebut] = React.useState();
    const [valueFin, setValueFin] = React.useState();
    const [valueMode, setValueMode] = React.useState(optionsMode[0]);
    const [inputValueMode, setInputValueMode] = React.useState('');

    const [valueCloud, setValueCloud] = React.useState(optionsMode[0]);
    const [inputValueCloud, setInputValueCloud] = React.useState('');




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
        <div style={{  borderColor:"red",borderStyle:"solid", justifyContent:"space-between", display:"flex", alignItems:"center",flexDirection:"column"}}>
             <div >
                 <Line data={dataInfluxRes} style={{borderColor:"blue", borderStyle:"solid", display:"flex", height:"30%"}}  />
             </div>







            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <div style={{display:"flex", flexDirection:"row" ,borderColor:"green", borderStyle:"solid", justifyContent:"space-between"}}>
                        <DateTimePicker
                            label="Début"
                            value={valueDebut}
                            onChange={(newValue) => setValueDebut(newValue)}
                        />
                        <DateTimePicker
                            label="Fin"
                            value={valueFin}
                            onChange={(newValue) => setValueFin(newValue)}
                        />
                        <Autocomplete
                            value={valueMode}
                            onChange={(event, newValue) => {
                                setValueMode(newValue);
                            }}
                            inputValue={inputValueMode}
                            onInputChange={(event, newInputValue) => {
                                setInputValueMode(newInputValue);
                            }}
                            id="mode"
                            options={optionsMode}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Controllable" />}
                        />
                        <Autocomplete
                            value={valueCloud}
                            onChange={(event, newValue) => {
                                setValueCloud(newValue);
                            }}
                            inputValue={inputValueCloud}
                            onInputChange={(event, newInputValue) => {
                                setInputValueCloud(newInputValue);
                            }}
                            id="cloud"
                            options={optionsCloud}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Controllable" />}
                        />

                        <Button variant="contained" endIcon={<SendIcon /> } onClick={() => {
alert(valueMode)
                            alert(valueCloud)


                        }}>
                            Envoyer requête
                        </Button></div>
                </DemoContainer>
            </LocalizationProvider>



        </div>

    )


}


export default InfluxDBComponent



