import { getToken } from '../services/Api';
import React from 'react';
import { useEffect, useState } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import "./stats.scss"
import 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from "axios";
import moment from "moment";
import 'moment/locale/fr';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

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


export default function PageStatistics() {
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
    
            let realDataInterval;
            if (dataInterval == "Day") {
                realDataInterval = "Hour";
            }
    
            let now = moment();
            let resApi = await axios.get(`https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/installation/installSimulated/EC9A8BDDBEEE/${realDataInterval}/Wc/${now.format("YYYY-MM-DD")}/${now.add(1, 'days').format("YYYY-MM-DD")}`, {
                headers: {
                    'Authorization': 'Bearer ' + tokenResult.data["access_token"],
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Ocp-Apim-Subscription-Key': ''
                }
            });
    
            console.log(resApi.data)
            
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
    
            for(let elem of resApi.data.reverse()) {
                console.log(elem)
                
                // Axis
                let timeDataStart = moment(elem.startDateOfMetric)
                timeDataStart.add(2, 'h')
                listChildren.push(<div className="tick" key={timeDataStart.format('hh')}>
                    <span className="day-number">{`${timeDataStart.format('h')}H`}</span>
                    <span className="day-name">{timeDataStart.format('dddd')}</span>
                </div>)
    
                // Graph
                dataConso.labels.push(timeDataStart.format('h'))
                dataConso.datasets[0].data.push(elem.sum)
    
            }
            setAxis(React.createElement('div', {className: 'axis'}, listChildren))
    
            setGraphDataConso(<Bar options={optionsConso} data={dataConso} />)
        }
    }
    
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