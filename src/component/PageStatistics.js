import {getStatistics, getTokenAPI} from '../services/Api';
import React, {useEffect, useState} from 'react';
import {Bar, Line} from 'react-chartjs-2';
import Switch from '@mui/material/Switch';
import {styled} from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import "./stats.scss"
import 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import 'moment/locale/fr';

import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
    ChartDataLabels
);


const optionsConso = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            right: 0,
            left: 0,
            top: 20,
            bottom: 5
        }
    },
    plugins: {
        legend: {
            display: false
        },
        datalabels: {
            color: 'white',
            anchor: 'center',
            clamp: true,
            font: {
                weight: 'bold'
            },
        },
        tooltip: {
            enabled: false
        },
    },
    legend: {
        display: false,
    },
    scales: {
        x: {
            display: false,
            ticks: {
                backdropPadding: 0,
            }
        },
        y: {
            display: false,
            ticks: {
                beginAtZero: true,
            },
        }
    }
};


const optionsTemp = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            right: 25,
            left: 25,
            top: 50,
            bottom: 0
        }
    },
    elements: {
        point: {
            radius: 8,
            hitRadius: 8,
            hoverRadius: 8
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: false
        },
        datalabels: {
            color: 'white',
            clamp: true,
            align: -45,
            font: {
                weight: 'bold'
            },
        }
    },
    scales: {
        x: {
            display: false,
        },
        y: {
            display: false,
            ticks: {
                beginAtZero: true,
            },
        }
    }
};


let popupData;
let intervalClicked;
let switchChecked = false;

const PageStatistics = ({classes, value}) => {
    const [active, setActive] = useState("");
    const [axis, setAxis] = useState((<div></div>));
    const [graphDataConso, setGraphDataConso] = useState((<div></div>));
    const [windowSize, setWindowSize] = useState(getWindowSize());
    
    const [installationId, setInstallationId] = useState("N/A");
    const [deviceId, setDeviceId] = useState("N/A");
    const [a1, setA1] = useState("N/A");
    
    
    if (classes === "popupData") {
        popupData = value;
    }
    
    console.log(popupData)
    
    const handleClick = event => {
        setActive(event.target.id);
        intervalClicked = event.target.innerHTML
        getStats(intervalClicked, switchChecked);
    };
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        getStats(intervalClicked, event.target.checked);
        switchChecked = !switchChecked;
    };
    
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        
        window.addEventListener('resize', handleWindowResize);
        
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    
    
    async function getStats(dataInterval, stateSwitch) {
        setA1(localStorage.getItem("a1"));
        if (popupData.statsInstallation != undefined) { // Installation statistics
            setInstallationId(popupData.statsInstallation[1])
        } else { // Room statistics
            setInstallationId(popupData.statsDevice[1])
            setDeviceId(popupData.statsDevice[2])
        }
        
        let dataConso = {
            labels: [],
            datasets: [
                {
                    label: 'Consommation',
                    data: [],
                    fill: false,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                }
            ]
        };
        
        let dataTemp = {
            labels: [],
            datasets: [
                {
                    label: 'Temperature',
                    data: [],
                    fill: false,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 3,
                    pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
                    pointHoverBorderWidth: 0,
                    lineTension: 0,
                }
            ]
        };
        
        console.log("dataInterval = " + dataInterval + " state switch = " + stateSwitch)
        if (dataInterval != undefined) {
            let token = localStorage.getItem("access_token");
            
            let realDataInterval;
            let listChildren = [];
            let data;
            let options;
            
            if (stateSwitch) { // Consommation
                data = dataConso;
                options = optionsConso;
            } else { // Temperature
                data = dataTemp;
                options = optionsTemp;
            }
            
            let statsApiMinIntervalTime;
            let statsTimePeriod, statsTimePeriodUnit;
            let xAxisDayNumberFormat, xAxisDayNameFormat;
            
            switch (dataInterval) {
                case "Day":
                    statsTimePeriod = 24;
                    statsTimePeriodUnit = 'hours';
                    realDataInterval = "Hour";
                    statsApiMinIntervalTime = 2;
                    xAxisDayNumberFormat = "H";
                    xAxisDayNameFormat = "ddd";
                    break;
                case "Week":
                    statsTimePeriod = 7;
                    statsTimePeriodUnit = 'days';
                    realDataInterval = "Day";
                    statsApiMinIntervalTime = 8;
                    xAxisDayNumberFormat = "DD";
                    xAxisDayNameFormat = "ddd";
                    break;
                case "Month":
                    statsTimePeriod = 1;
                    statsTimePeriodUnit = 'months';
                    realDataInterval = "Month";
                    statsApiMinIntervalTime = 366;
                    xAxisDayNumberFormat = "MMMM";
                    xAxisDayNameFormat = "YYYY";
                    break;
                case "Year":
                    statsTimePeriod = 1;
                    statsTimePeriodUnit = 'year';
                    realDataInterval = "Year";
                    statsApiMinIntervalTime = 366 * 5;
                    xAxisDayNumberFormat = "YYYY";
                    xAxisDayNameFormat = " ";
                    break;
            }
            
            let statsResult = await getStatistics("installation", token, a1, installationId, deviceId, "Wc", realDataInterval, moment().subtract(statsApiMinIntervalTime, 'd').format("YYYY-MM-DD"), moment().add(1, 'd').format("YYYY-MM-DD"));
            statsResult.data = statsResult.data.reverse();
            let lastStatTime = moment(statsResult.data[statsResult.data.length - 1].startDateOfMetric);
            lastStatTime = lastStatTime.add(2, 'h').subtract(statsTimePeriod, statsTimePeriodUnit).unix()
            
            for (let i = 0; i < statsResult.data.length; i++) {
                let elem = statsResult.data[i];
                // Axis
                let timeDataStart = moment(elem.startDateOfMetric).add(2, 'h')
                if (timeDataStart.unix() >= lastStatTime) {
                    listChildren.push(<div className="tick" key={timeDataStart}>
                        <span className="day-number">{`${timeDataStart.format(xAxisDayNumberFormat)}`}</span>
                        <span className="day-name">{timeDataStart.format(xAxisDayNameFormat)}</span>
                    </div>)
                    // Graph
                    data.labels.push(timeDataStart.format('h'))
                    if (stateSwitch) { // Consommation
                        data.datasets[0].data.push(elem.sum)
                    } else { // Temperature
                        data.datasets[0].data.push(elem.avg)
                    }
                }
            }
            
            setAxis(React.createElement('div', {className: 'axis'}, listChildren))
            if (!stateSwitch) {
                options.layout.padding.left = (windowSize.innerWidth * 0.8) / data.datasets[0].data.length / 2
                options.layout.padding.right = (windowSize.innerWidth * 0.8) / data.datasets[0].data.length / 2
            }
            
            // Fix bug when only one data to display on chart
            if (data.datasets[0].data.length == 1) {
                data.datasets[0].data.unshift("NaN")
                data.datasets[0].data.push("NaN")
                data.labels.unshift("")
                data.labels.push("")
            }
            
            console.log(windowSize.innerWidth)
            if (stateSwitch) { // Consommation
                setGraphDataConso(<Bar options={options} data={data}/>)
            } else { // Temperature
                setGraphDataConso(<Line options={options} data={data}/>)
            }
        }
    }
    
    const MaterialUISwitch = styled(Switch)(({theme}) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="27" width="27" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                        '#fff',
                    )}" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/></svg>')`,
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
            width: 32,
            height: 32,
            '&:before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="27" width="27" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1h-1v1h1v2h-1v1h1v1h-2z"/></svg>')`,
            },
        },
        '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            borderRadius: 20 / 2,
        },
    }));
    
    
    useEffect(() => {
        async function fetchData() {
            const response = await getStats();
        }
        
        fetchData();
    }, []);
    
    return (
        <div className="card">
            <div className="about">
                <br/>
                <h3>Temperature in °C</h3>
                <p className="lead">A1: {a1}</p>
                <p className="lead">Installation: {installationId}</p>
                <p className="lead">Device: {deviceId}</p>
                <FormGroup className="switch-button">
                    <FormControlLabel
                        control={<MaterialUISwitch sx={{m: 1}} checked={switchChecked} onChange={handleChange}/>}
                    />
                </FormGroup>
                <div>
                    <div className="App">
                        <div className="app-header">
                            <ul className="app-segmented-control">
                                <li className="app-segmented-control-item">
                                    <button key={1}
                                            className={active === "1" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"1"}
                                            onClick={handleClick}
                                            datainterval="day">
                                        Day
                                    </button>
                                </li>
                                <li className="app-segmented-control-item">
                                    <button key={2}
                                            className={active === "2" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"2"}
                                            onClick={handleClick}
                                            datainterval="week">
                                        Week
                                    </button>
                                </li>
                                <li className="app-segmented-control-item">
                                    <button key={3}
                                            className={active === "3" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"3"}
                                            onClick={handleClick}
                                            datainterval="month">
                                        Month
                                    </button>
                                </li>
                                <li className="app-segmented-control-item">
                                    <button key={4}
                                            className={active === "4" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"4"}
                                            onClick={handleClick}
                                            datainterval="year">
                                        Year
                                    </button>
                                </li>
                            </ul>
                        
                        </div>
                    </div>
                </div>
                <div>
                    {graphDataConso}
                </div>
                {axis}
            </div>
        </div>)
}

function convertFahrenheitToCelsius(fahrenheit) {
    return Math.floor(5 / 9 * (fahrenheit - 32));
}

function convertCelsiusToFahrenheit(celsius) {
    return Math.floor(celsius * 9/5 + 32)
}

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}

export default PageStatistics;