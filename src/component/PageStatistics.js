import { getToken } from '../services/Api';
import React from 'react';
import { useEffect, useState } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import "./stats.scss"
import 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from "axios";
import moment from "moment";
import 'moment/locale/fr';
import ThermostatIcon from '@mui/icons-material/Thermostat';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Popup from "./popupComponent/popup";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
    ChartDataLabels
);



export const options = {
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

export const data = {
    labels: ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"],
    datasets: [
        {
            label: 'Temperature',
            data: [20, 22, 19, 19.5, 21, 20.5, 18, 20, 22, 19, 19.5, 21, 20.5, 18, 20, 22, 19, 19.5, 21, 20.5, 18],
            fill: false,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'transparent',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 3,
            pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
            pointHoverBorderWidth: 10,
            lineTension: 0,
        }
    ]
};

export const optionsConso = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            right: 0,
            left: 0,
            top: 20,
            bottom: -50
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

const PageStatistics = ({classes}) => {
    const [active, setActive] = useState("");
    const [axis, setAxis] = useState((<div></div>));
    const [graphDataConso, setGraphDataConso] = useState((<div></div>));
    
    const handleClick = event => {
        setActive(event.target.id);
        getStats(event.target.innerHTML);
    };
    
    async function getStats(dataInterval) {
        if(dataInterval != undefined) {
    
            console.log(dataInterval)
            let tokenResult = await axios.post("https://visionsystem2-identity-dev.azurewebsites.net/connect/token", {
                'grant_type': 'client_credentials',
                'scope': 'Device.Write Installation.Read IOTManagement.Write TermOfUse.Read TermOfUse.Write Commissionings.Read Commissionings.Write DataProcessing.Read DataProcessing.Write Device.Read Firmware.Read Firmware.Write HistoricalData.Read HistoricalData.Write Installation.Write IOTManagement.Read Room.Read Room.Write Schema.Read Schema.Write https://visionsystem2.com/iotmanagement/user_impersonation https://visionsystem2.com/operations/user_impersonation https://visionsystem2.com/tou/user_impersonation https://visionsystem2.com/businessmodule/user_impersonation https://visionsystem2.com/identity/user_impersonation https://visionsystem2.com/dataprocessing/user_impersonation',
                'client_id': '2b64fa79-35c3-418f-8a78-3ef6f9df9c53',
                'client_secret': 'EB44AA55C51AD31B87D139528CD5DE7E89BE925B301A4351B918E4CB568B3252'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            let now = moment();
            let realDataInterval;
            let listChildren = [];
    
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
            
            if (dataInterval == "Day") {
                realDataInterval = "Hour";
    
                let resApi = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/installation/installSimulated/EC9A8BDDBEEE/${realDataInterval}/Wc/2022-12-19/2022-12-21`, {
                    headers: {
                        'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Ocp-Apim-Subscription-Key': ''
                    }
                });
                
                resApi.data = resApi.data.reverse();
                let i = 0;
                if(resApi.data.length>24) i = resApi.data.length-24;
                
                for (i; i < resApi.data.length; i++) {
                    let elem = resApi.data[i];
                    // Axis
                    let timeDataStart = moment(elem.startDateOfMetric)
                    timeDataStart.add(2, 'h')
                    listChildren.push(<div className="tick" key={timeDataStart}>
                        <span className="day-number">{`${timeDataStart.format('H')}H`}</span>
                        <span className="day-name">{timeDataStart.format('ddd')}</span>
                    </div>)
                    // Graph
                    dataConso.labels.push(timeDataStart.format('h'))
                    dataConso.datasets[0].data.push(elem.sum)
                }
            } else if (dataInterval == "Week") {
                realDataInterval = "Day";
    
                let resApi = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/installation/installSimulated/EC9A8BDDBEEE/${realDataInterval}/Wc/2022-12-14/2022-12-21`, {
                    headers: {
                        'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Ocp-Apim-Subscription-Key': ''
                    }
                });
    
                resApi.data = resApi.data.reverse();
                let i = 0;
                if(resApi.data.length>7) i = resApi.data.length-7;
    
                for (i; i < resApi.data.length; i++) {
                    let elem = resApi.data[i];
                    console.log(elem)
                    // Axis
                    let timeDataStart = moment(elem.startDateOfMetric)
                    timeDataStart.add(2, 'h')
                    listChildren.push(<div className="tick" key={timeDataStart}>
                        <span className="day-number">{`${timeDataStart.format('D')}`}</span>
                        <span className="day-name">{timeDataStart.format('ddd')}</span>
                    </div>)
                    // Graph
                    dataConso.labels.push(timeDataStart.format('h'))
                    dataConso.datasets[0].data.push(elem.sum)
                }
            } else if (dataInterval == "Year") {
                realDataInterval = "Year";
                let resApi = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/installation/installSimulated/EC9A8BDDBEEE/${realDataInterval}/Wc/2020-10-18/2022-12-21`, {
                    headers: {
                        'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Ocp-Apim-Subscription-Key': ''
                    }
                });
    
                resApi.data = resApi.data.reverse();
                let i = 0;
                if(resApi.data.length>5) i = resApi.data.length-5;
    
                for (i; i < resApi.data.length; i++) {
                    let elem = resApi.data[i];
                    console.log(elem)
                    // Axis
                    let timeDataStart = moment(elem.startDateOfMetric)
                    timeDataStart.add(2, 'h')
                    listChildren.push(<div className="tick" key={timeDataStart}>
                        <span className="day-number">{`${timeDataStart.format('MM')}`}</span>
                        <span className="day-name">{timeDataStart.format('YYYY')}</span>
                    </div>)
                    // Graph
                    dataConso.labels.push(timeDataStart.format('h'))
                    dataConso.datasets[0].data.push(elem.sum)
                }
            } else if (dataInterval == "Month") {
                realDataInterval = "Month";
                let resApi = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/installation/installSimulated/EC9A8BDDBEEE/${realDataInterval}/Wc/2022-10-18/2022-12-21`, {
                    headers: {
                        'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Ocp-Apim-Subscription-Key': ''
                    }
                });
                
                resApi.data = resApi.data.reverse();
                let i = 0;
                if(resApi.data.length>12) i = resApi.data.length-12;
    
                for (i; i < resApi.data.length; i++) {
                    let elem = resApi.data[i];
                    console.log(elem)
                    // Axis
                    let timeDataStart = moment(elem.startDateOfMetric)
                    timeDataStart.add(2, 'h')
                    listChildren.push(<div className="tick" key={timeDataStart}>
                        <span className="day-number">{`${timeDataStart.format('MM')}`}</span>
                        <span className="day-name">{timeDataStart.format('YYYY')}</span>
                    </div>)
                    // Graph
                    dataConso.labels.push(timeDataStart.format('h'))
                    dataConso.datasets[0].data.push(elem.sum)
                }
            }
    
            setAxis(React.createElement('div', {className: 'axis'}, listChildren))
            setGraphDataConso(<Bar options={optionsConso} data={dataConso}/>)
        }
    }
    
    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
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
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
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
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
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
                <p className="lead">DEVICE_ID</p>
                <FormGroup className="switch-button">
                    <FormControlLabel
                        control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
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

export default PageStatistics;