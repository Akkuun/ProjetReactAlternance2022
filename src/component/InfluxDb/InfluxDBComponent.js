import React from "react";
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
// option for proposed modes/clouds in input
const optionsMode = [{title: 'Bt'}, {title: 'Cm'}, {title: 'Ma'}, {title: 'Rt'}, {title: 'bo'}, {title: 'cf'}, {title: 'df'}, {title: 'ec'}];
const optionsCloud = [{title: 'Deltacalor'}, {title: 'GKP'}, {title: 'Dev'}, {title: 'Prod'}, {title: 'FENIX'}]
//icons
const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;
//component rendering
const InfluxDBComponent = () => {
    //state variables
    //state for date range of the measure
    const [valueDebut, setValueDebut] = React.useState();
    const [valueFin, setValueFin] = React.useState();
    //state for the cloud(s) and mode(s) value(s) selected
    const [valueMode, setValueMode] = React.useState([]);
    const [valueCloud, setValueCloud] = React.useState([]);
    //state for the dataTab/timeTab for the chart
    const [valueInfluxDataTab, setValueInfluxDataTab] = React.useState({});
    const [valueInfluxTimeTab, setValueInfluxTimeTab] = React.useState([]);

    const [valueMax, setValueMax] = React.useState();
    const [valueMin, setValueMin] = React.useState();
    //Influx credentials for connection
    const token = '5NqNMxecJV6FuXdsGvNH0rizry14lMI0Jqvs8mig23kBAY8I-KDDaLRflhQ5OpFv6cLu4DpmibSlHuYkwa2Awg=='
    let org = `Watts`
    const url = 'http://10.99.3.47:8086'
    // InfluxAPI object for communications
    const queryApi = new InfluxDB({url, token}).getQueryApi(org)

    //Function designed to send Request to InfluxDB, fill all the Map/array for the chart, take the mode in parameter to adapt the request
    async function sendRequest(mode) {
        let value;
        let timeInflux = []
        const modeData = {}; // Object to store data for each mode
        let tabval = []
        let max = -Infinity;
        const formattedValueDebut = dayjs(valueDebut.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();
        const formattedValueFin = dayjs(valueFin.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();
        let fluxQuery = `from(bucket: "StatsWattsType")
                 |> range(start: ${formattedValueDebut}, stop: ${formattedValueFin})
                 |> filter(fn: (r) => r["_measurement"] == "measurementWattsType")`
        //if there are more than 1 mode/cloud, adapt the request to include 2 line in the chart for different mode or
        //have the request with diffrent cloud
        if (valueCloud.length > 0) {
            const cloudFilters = valueCloud.map((cloud) => `r["cloud"] == "${cloud}"`).join(" or ");
            fluxQuery += `\n    |> filter(fn: (r) => ${cloudFilters})`;
        }
        if (valueMode.length > 0) {
            const modeFilters = valueMode.map((mode) => `r["wattsType"] == "${mode}"`).join(" or ");
            fluxQuery += `\n    |> filter(fn: (r) => ${modeFilters})`;
        }

        switch (mode) {
            case "mean":
                fluxQuery += `\n    |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
                 |> yield(name: "mean")`;

                for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
                    const o = tableMeta.toObject(values);
                    const mode = o.wattsType;
                    const time = o._time;
                    //these modes represent temperature mode, so we don't have to transform them, but for the other we have to do it to have the value in ° for a better understanding
                    //if isTemperatureMode return true, it converts the data to the °C format, else jsute keep the value
                    isTemperatureMode(mode) ? value = transformToDegree(o._value) : value = o._value

                    if (!modeData[mode]) {
                        modeData[mode] = [];
                    }
                    //push the data to the associated mode
                    modeData[mode].push({value, time});
                    timeInflux.push(time); // Add the timestamp to the array
                    //states updates

                }
                setValueInfluxDataTab(modeData);
                setValueInfluxTimeTab(timeInflux);
                break;
            case "gaps":

                break;
        }
    }


    const requestInfluxForChart = async () => {
        //clear arrays

        setValueInfluxDataTab([]);
        setValueInfluxTimeTab([]);
        //get the dates and re-arrange them

        //get the result from the InfluxDB object
        await sendRequest("mean")
        await sendRequest("gaps")


    }
    // chart data
    const uniqueTimeInflux = valueInfluxTimeTab.filter((time, index) => valueInfluxTimeTab.indexOf(time) === index);
    const dataInfluxRes = {
        labels: uniqueTimeInflux,
        datasets: Object.keys(valueInfluxDataTab).map((mode, index) => ({
            label: mode,
            backgroundColor: `rgb(${index * 50}, ${index * 100}, ${index * 150})`,
            borderColor: `rgb(${index * 50}, ${index * 100}, ${index * 150})`,
            data: valueInfluxDataTab[mode].map((data) => data.value),
        })),
    };
    //functions to update the mode variable (state) when there are changes
    const handleModeChange = (event, values) => {
        const selectedModes = values.map((value) => value.title);
        setValueMode(selectedModes);
    };
    const handleCloudChange = (event, values) => {
        const selectedCloud = values.map((value) => value.title);
        setValueCloud(selectedCloud);
    };
    //functiond designed to return if the current mode is a temperature related mode or representative mode
    function isTemperatureMode(mode) {
        return mode !== "Rt" && mode !== "Cm" && mode !== "Bt"
    }

    function transformToDegree(value){
        return (value / 10 - 32) / 1.8
    }

    return (
        <div style={{
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%", width: "100%"
        }}>
            <Line data={dataInfluxRes}/>
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
                    <div> Moyenne totale</div>
                    <div> écart-type</div>

                </DemoContainer>
            </LocalizationProvider>
        </div>
    )
}
export default InfluxDBComponent
