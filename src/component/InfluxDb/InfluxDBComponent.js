import React, {useState} from "react";

import {Line} from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";
import {InfluxDB} from "@influxdata/influxdb-client";

import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {TextField} from "@mui/material";
import {Autocomplete} from "@mui/joy";
import Checkbox from '@mui/material/Checkbox';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const optionsMode = [{title: 'Bt'}, {title: 'Cm'}, {title: 'Ma'}, {title: 'Rt'}, {title: 'bo'}, {title: 'cf'}, {title: 'df'}, {title: 'ec'}];
const optionsCloud = [{title: 'Deltacalor'}, {title: 'GKP'}, {title: 'Dev'}, {title: 'Prod'}, {title: 'FENIX'}]


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;


const InfluxDBComponent = () => {


    const [valueDebut, setValueDebut] = React.useState();
    const [valueFin, setValueFin] = React.useState();

    const [valueDebutRequest, setValueDebutRequest] = React.useState();
    const [valueFinRequest, setValueFinRequest] = React.useState()

    const [valueMode, setValueMode] = React.useState(optionsMode[0]);
    const [valueCloud, setValueCloud] = React.useState(optionsMode[0]);

    const [inputValueMode, setInputValueMode] = React.useState('');
    const [inputValueCloud, setInputValueCloud] = React.useState('');


    const [valueInfluxDataTab, setValueInfluxDataTab] = React.useState();
    const [valueInfluxTimeTab, setValueInfluxTimeTab] = React.useState();

    const token = '5NqNMxecJV6FuXdsGvNH0rizry14lMI0Jqvs8mig23kBAY8I-KDDaLRflhQ5OpFv6cLu4DpmibSlHuYkwa2Awg=='
    let org = `Watts`
    const url = 'http://10.99.3.47:8086'
    const queryApi = new InfluxDB({url, token}).getQueryApi(org)
    const [chartDataLoaded, setChartDataLoaded] = useState(false);




    const requestInfluxForChart = async () => {
        let dataInflux = []
        let timeInflux = []
        setValueInfluxDataTab([]);
        setValueInfluxTimeTab([]);
        const formattedValueDebut = dayjs(valueDebut.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();
        const formattedValueFin = dayjs(valueFin.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();



        const fluxQuery = `from(bucket: "StatsWattsType")
      |> range(start: ${formattedValueDebut}, stop: ${formattedValueFin})
      |> filter(fn: (r) => r["_measurement"] == "measurementWattsType")
      |> filter(fn: (r) => r["cloud"] == "${valueCloud}")
      |> filter(fn: (r) => r["wattsType"] == "${valueMode}")
      |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
      |> yield(name: "mean")`



        for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
            const o = tableMeta.toObject(values)
            dataInflux.push(o._value)
            timeInflux.push(o._time)
        }

        setValueInfluxDataTab(dataInflux);
        setValueInfluxTimeTab(timeInflux);
        setChartDataLoaded(true);
    }


    const dataInfluxRes = {
        labels: valueInfluxTimeTab,
        datasets: [
            {
                label: "Résultats",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: valueInfluxDataTab,
            },
        ],
    };
    const handleModeChange = (event, values) => {
        const selectedModes = values.map((value) => value.title);
        setValueMode(selectedModes);
    };

    const handleCloudChange = (event, values) => {
        const selectedCloud = values.map((value) => value.title);
        setValueCloud(selectedCloud);
    };

    return (
        <div style={{
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height:"100%", width:"100%"
        }}>


                <Line data={dataInfluxRes} />




            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
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
                            multiple
                            id="mode"
                            placeholder={"choix du mode"}
                            options={optionsMode}
                            onChange={handleModeChange}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.title}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {option.title}
                                </li>
                            )}
                            style={{width: 500}}
                            renderinput={(params) => (
                                <TextField {...params} label="Checkboxes" placeholder="Favorites"/>
                            )}
                        />

                        <Autocomplete
                            multiple
                            id="cloud"
                            options={optionsCloud}
                            disableCloseOnSelect
                            onChange={handleCloudChange}
                            placeholder={"choix du cloud"}
                            getOptionLabel={(option) => option.title}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {option.title}
                                </li>
                            )}
                            style={{width: 500}}
                            renderinput={(params) => (
                                <TextField {...params} label="Checkboxes" placeholder="Favorites"/>
                            )}
                        />

                        <Button variant="contained" endIcon={<SendIcon/>} onClick={() => {
                            requestInfluxForChart()


                        }}>
                            Envoyer requête
                        </Button></div>
                </DemoContainer>
            </LocalizationProvider>


        </div>

    )


}


export default InfluxDBComponent
