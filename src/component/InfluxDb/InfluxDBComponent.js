import React from "react";
import {Chart, Line, Pie} from "react-chartjs-2";
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
import NestedList from "./NestedList";
// option for proposed modes/clouds in input
const optionsMode = [{title: 'Bt'}, {title: 'Cm'}, {title: 'Ma'}, {title: 'Rt'}, {title: 'bo'}, {title: 'cf'}, {title: 'df'}, {title: 'ec'}];
const optionsCloud = [{title: 'Deltacalor'}, {title: 'GKP'}, {title: 'Dev'}, {title: 'Prod'}, {title: 'FENIX'}]
//icons
const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;
//GOAL: Print all stats data in a diagram depend on the user' passed request
const InfluxDBComponent = () => {
    //state variables
    //state for date range of the measure
    const [valuesStartMeasure, setValuesStartMeasure] = React.useState();
    const [valueEndMeasure, setValueEndMeasure] = React.useState();
    //state for the cloud(s) and mode(s) value(s) selected
    const [valueModeSelected, setValueModeSelected] = React.useState([]);
    const [valueCloudSelected, setValueCloudSelected] = React.useState([]);
    //state for the dataTab/timeTab for the chart
    const [valueInfluxDataTab, setValueInfluxDataTab] = React.useState({});
    const [valueInfluxTimeTab, setValueInfluxTimeTab] = React.useState([]);
    //state for stats parameter
    const [valueAverage, setValueAverage] = React.useState();
    const [valueEcart, setValueEcart] = React.useState();
    //state for the PieChartData
    const [valueInfluxDataTabRepartition, setvalueInfluxDataTabRepartition] = React.useState({});
    //state for the graph type choice
    const [valueChoiceGraphPie, setValueChoiceGraphPie] = React.useState(false);
    //Influx credentials for connection
    const token = '5NqNMxecJV6FuXdsGvNH0rizry14lMI0Jqvs8mig23kBAY8I-KDDaLRflhQ5OpFv6cLu4DpmibSlHuYkwa2Awg=='
    let org = `Watts`
    const url = 'http://10.99.3.47:8086'
    // InfluxAPI object for communications
    const queryApi = new InfluxDB({url, token}).getQueryApi(org)

    //Function designed to send Request to InfluxDB, fill all the Map/array for the chart, take the mode in parameter to adapt the request
    async function sendRequest(mode) {
        setValueChoiceGraphPie(false)
        let value;
        let timeInflux = []
        let AverageArrayValue = []
        const dataRepartitionForPieChart = [];
        const DataForEachMode = {};
        //used to store the start and the end of the measure
        const formattedValueDebut = dayjs(valuesStartMeasure.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();
        const formattedValueFin = dayjs(valueEndMeasure.$d).format("YYYY-MM-DDTHH:mm:ss[Z]").toString();
        switch (mode) {
            //case temparature measurement mode, linear diagram
            case "mean":
                let fluxQuery = `from(bucket: "StatsWattsType")
                 |> range(start: ${formattedValueDebut}, stop: ${formattedValueFin})
                 |> filter(fn: (r) => r["_measurement"] == "measurementWattsType")`
                //if there are more than 1 mode/cloud in the request,  we must adapt the FluxQueryRequest to include those in the request
                if (valueCloudSelected.length > 0) {
                    const cloudFilters = valueCloudSelected.map((cloud) => `r["cloud"] == "${cloud}"`).join(" or ");
                    fluxQuery += `\n    |> filter(fn: (r) => ${cloudFilters})`;
                }
                if (valueModeSelected.length > 0) {
                    const modeFilters = valueModeSelected.map((mode) => `r["wattsType"] == "${mode}"`).join(" or ");
                    fluxQuery += `\n    |> filter(fn: (r) => ${modeFilters})`;
                }
                //end of the query
                fluxQuery += `\n    |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
            |> yield(name: "mean")`;
                //get the data from the query
                for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
                    const o = tableMeta.toObject(values);
                    const mode = o.wattsType;
                    const time = o._time;
                    //some modes represent some temperature mode, so we don't have to transform them, but for the other we have to do it to have the value in ° for a better understanding
                    //if isTemperatureMode return true, it converts the data to the °C format, else it just keep the value
                    isTemperatureMode(mode) ? value = transformToDegree(o._value) : value = o._value
                    if (!DataForEachMode[mode]) {
                        DataForEachMode[mode] = [];
                    }
                    //push the data to the associated mode
                    DataForEachMode[mode].push({value, time});
                    timeInflux.push(time); // Add the timestamp to the array
                    //states updates
                }
                //state data update for the Line Chart(data values, time axis values)
                setValueInfluxDataTab(DataForEachMode);
                setValueInfluxTimeTab(timeInflux);
                //we store every data in an array
                for (let i = 0; i < DataForEachMode[valueModeSelected].length; i++) {
                    AverageArrayValue.push(DataForEachMode[valueModeSelected][i].value)
                }
                //normal law parameter operations
                setValueAverage(calculateMean(AverageArrayValue).toFixed(2))
                setValueEcart(calculateStandardDeviation(AverageArrayValue).toFixed(2))
                break;
            //case for general cloud repartition
            case "repart":
                setValueChoiceGraphPie(true)
                let fluxQueryRepartition = `from(bucket: "StatsWattsType")
              |> range(start: ${formattedValueDebut}, stop: ${formattedValueFin})
              |> group(columns: ["cloud"])
              |> count()`
                for await (const {values, tableMeta} of queryApi.iterateRows(fluxQueryRepartition)) {
                    const o = tableMeta.toObject(values);
                    const cloud = o.cloud;
                    const value = o._value
                    //each week, we send 8 data for each device so to have a good representation of the cloud's repartition we have to divide by 8 to have
                    dataRepartitionForPieChart[cloud] = Math.floor(value / 8)
                }
                setvalueInfluxDataTabRepartition(dataRepartitionForPieChart)
                break
            //case for data repartition diagram for non temperature mode (Cm : Current mode, Rt : Room type)
            case "modeRepart":
                setValueChoiceGraphPie(true)
                let FluxQueryCmRepartition
                let FluxQuery;
                let CmRepartitonDataArray = []
                let CmList = ["OFF", "eco", "auto", "confort", "defrost", "boost", "manual", "sunday"]
                let FluxQueryBegin = `from(bucket: "StatsWattsType")\n|> range(start: ${formattedValueDebut}, stop: ${formattedValueFin})\n`
                // we must adapt the request if various mode are selected
                if (valueCloudSelected.length > 0) {
                    const cloudFilters = valueCloudSelected.map((cloud) => `r["cloud"] == "${cloud}"`).join(" or ");
                    FluxQueryBegin += `|> filter(fn: (r) => ${cloudFilters})\n`;
                }
                //for each mode, we adapt the requet to ask tne number of device for each mode 1,2,3,4.....
                for (let i = 0; i < CmList.length; i++) {
                    FluxQueryCmRepartition = `|> filter(fn: (r) => r["wattsType"] == "Cm")\n|> filter(fn: (r) => r["_value"] == ${i}) \n`
                    FluxQuery = FluxQueryBegin + FluxQueryCmRepartition
                    FluxQuery += `\n|> count()\n`
                    for await (const {values, tableMeta} of queryApi.iterateRows(FluxQuery)) {
                        CmRepartitonDataArray[CmList[i]] = values[4]
                    }
                }
                //State value update
                setvalueInfluxDataTabRepartition(CmRepartitonDataArray)
                break;
            case "modeRtRepart":
                setValueChoiceGraphPie(true)
                let FluxQueryRtRepartition
                let FluxQueryRt;
                let RtRepartitonDataArray = []
                let RtList = ["Bathroom", "Bedroom", "DiningRoom", "Entrance", "Garage", "Garden", "Hall", "Kitchen", "LivingRoom", "Loft", "Office", "Outbuilding", "Terrace", "Toilet", "Various"]
                let FluxQueryBeginRt = `from(bucket: "StatsWattsType")\n|> range(start: ${formattedValueDebut}, stop: ${formattedValueFin})\n`
                // we must adapt the request if various mode are selected
                if (valueCloudSelected.length > 0) {
                    const cloudFilters = valueCloudSelected.map((cloud) => `r["cloud"] == "${cloud}"`).join(" or ");
                    FluxQueryBeginRt += `|> filter(fn: (r) => ${cloudFilters})\n`;
                }
                //for each mode, we adapt the requet to ask tne number of device for each mode 1,2,3,4.....
                for (let i = 0; i < RtList.length; i++) {
                    FluxQueryRtRepartition = `|> filter(fn: (r) => r["wattsType"] == "Rt")\n|> filter(fn: (r) => r["_value"] == ${i}) \n`
                    FluxQueryRt = FluxQueryBeginRt + FluxQueryRtRepartition
                    FluxQueryRt += `\n|> count()\n`
                    for await (const {values, tableMeta} of queryApi.iterateRows(FluxQueryRt)) {
                        RtRepartitonDataArray[RtList[i]] = values[4]
                    }
                }
                //State value update
                setvalueInfluxDataTabRepartition(RtRepartitonDataArray)
                break;
        }
    }

    //function design to calculate the Mean of an array value
    function calculateMean(tab) {
        let val = 0, cpt = 0
        for (let i = 0; i < tab.length; i++) {
            val += tab[i]
            cpt++
        }
        return val / cpt
    }

    //function designed to calculate the standard deviation of an array values
    function calculateStandardDeviation(values) {
        const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
        const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
        const sumSquaredDifferences = squaredDifferences.reduce((sum, value) => sum + value, 0);
        const variance = sumSquaredDifferences / values.length;
        return Math.sqrt(variance);
    }

    //function design to send InfluxDB request for temperature modes
    const requestInfluxForChart = async () => {
        //clear arrays
        setValueInfluxDataTab([]);
        setValueInfluxTimeTab([]);
        setValueAverage(0)
        setValueEcart(0)
        if (valueModeSelected[0] === "Cm" && valueModeSelected.length === 1) {
            await sendRequest("modeRepart")
        } else if (valueModeSelected[0] === "Rt" && valueModeSelected.length === 1) {
            await sendRequest("modeRtRepart")
        } else {
            await sendRequest("mean")
        }


    }
    //we filter the values of valueInfluxTimeTab to prevent a bug when x time series are added for each selected mode
    const uniqueTimeInflux = valueInfluxTimeTab.filter((time, index) => valueInfluxTimeTab.indexOf(time) === index);
    //data for Line Chart
    const dataInfluxRes = {
        labels: uniqueTimeInflux,
        datasets: Object.keys(valueInfluxDataTab).map((mode, index) => ({
            label: mode,
            backgroundColor: `rgb(${index * 50}, ${index * 100}, ${index * 150})`,
            borderColor: `rgb(${index * 50}, ${index * 100}, ${index * 150})`,
            data: valueInfluxDataTab[mode].map((data) => data.value),
        })),
    };
    //functions to update the mode/cloud variable (state) when there are changes
    const handleModeChange = (event, values) => {
        const selectedModes = values.map((value) => value.title);
        setValueModeSelected(selectedModes);
    };
    const handleCloudChange = (event, values) => {
        const selectedCloud = values.map((value) => value.title);
        setValueCloudSelected(selectedCloud);
    };

    //function designed to return if the current mode is a temperature related mode or representative mode
    function isTemperatureMode(mode) {
        return mode !== "Rt" && mode !== "Cm" && mode !== "Bt"
    }

    //function design to transform the passed value in degree
    function transformToDegree(value) {
        return (value / 10 - 32) / 1.8
    }

    //chart Pie values
    const dataP = {
        labels: Object.keys(valueInfluxDataTabRepartition),
        datasets: [
            {
                label: 'nombre total',
                data: Object.values(valueInfluxDataTabRepartition),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(153, 65, 18, 0.2)',
                    'rgba(130, 159, 64, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%"
            , height: "30%",
        }}>
            {valueChoiceGraphPie === true ?
                <div style={{width: "50%", height: "50%", alignItems: "center"}}><Pie data={dataP}/></div> :
                <div style={{width: "80%", height: "40%", alignItems: "center"}}><Line data={dataInfluxRes}/></div>}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                        <DateTimePicker
                            label="Début"
                            value={valuesStartMeasure}
                            onChange={(newValue) => setValuesStartMeasure(newValue)}
                        />
                        <DateTimePicker
                            label="Fin"
                            value={valueEndMeasure}
                            onChange={(newValue) => setValueEndMeasure(newValue)}
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
                            style={{}}
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
                            style={{}}
                            renderinput={(params) => (
                                <TextField {...params} label="Checkboxes" placeholder="Favorites"/>
                            )}
                        />
                        <Button variant="contained" endIcon={<SendIcon/>} onClick={() => {
                            requestInfluxForChart()
                        }}>
                            Envoyer requête
                        </Button></div>
                    <div> Moyenne totale {valueAverage}</div>
                    <div> écart-type {valueEcart}</div>
                    <div><Button variant="contained" endIcon={<SendIcon/>} onClick={() => {
                        sendRequest("repart")
                    }}>
                        Répartiton des clouds
                    </Button></div>
                </DemoContainer>
            </LocalizationProvider>
            <div style={{left: "82%", width: '40%', position: "fixed"}}>
                <NestedList/>
            </div>
        </div>
    )
}
export default InfluxDBComponent
