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
    const [valueInfluxTimeTab, setValueInfluxTimeTab] = React.useState();
    //Influx credentials for connection
    const token = '5NqNMxecJV6FuXdsGvNH0rizry14lMI0Jqvs8mig23kBAY8I-KDDaLRflhQ5OpFv6cLu4DpmibSlHuYkwa2Awg=='
    let org = `Watts`
    const url = 'http://10.99.3.47:8086'
    // InfluxAPI object for communications
    const queryApi = new InfluxDB({url, token}).getQueryApi(org)

    // function which get the request parameters and send it to Influx to display in a chart
    const requestInfluxForChart = async () => {
        //clear arrays
        let timeInflux = []
        setValueInfluxDataTab([]);
        setValueInfluxTimeTab([]);
        //get the dates and re-arrange them
        const formattedValueDebut = dayjs(valueDebut.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();
        const formattedValueFin = dayjs(valueFin.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();

        //Influx query declaration
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

        fluxQuery += `\n    |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
    |> yield(name: "mean")`;

        //get the result from the InfluxDB object
        const modeData = {}; // Object to store data for each mode
        for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
            const o = tableMeta.toObject(values);
            const mode = o.wattsType;
            const value = o._value;
            const time = o._time;
            if (!modeData[mode]) {
                modeData[mode] = [];
            }
            //push the data to the associated mode
            modeData[mode].push({value, time});
            timeInflux.push(time); // Add the timestamp to the array
        }
        //states updates
        setValueInfluxDataTab(modeData);
        setValueInfluxTimeTab(timeInflux);
    }

    // chart data
    const dataInfluxRes = {
        labels: valueInfluxTimeTab,
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
                </DemoContainer>
            </LocalizationProvider>


        </div>

    )


}


export default InfluxDBComponent
