import { getToken } from '../services/Api';
import React from 'react';
import { useEffect, useState } from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar, Line} from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import "./stats.scss"
import 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            right: 45,
            left: 45,
            top: 20,
            bottom: 20
        }
    },
    elements: {
        point: {
            radius: 8,
            hitRadius: 6,
            hoverRadius: 6
        }
    },
    plugins: {
        legend: {
            display: false
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
    legend: {
        display: false,
    },
    tooltips: {
        backgroundColor: 'transparent',
        displayColors: false,
        bodyFontSize: 14,
        callbacks: {
            label: function(tooltipItems, data) {
                return tooltipItems.yLabel + '°C';
            }
        }
    },
    scales: {
        x: {
            display: false,
            ticks: {
                backdropPadding: 50,
            }
        },
        y: {
            display: false,
            ticks: {
                suggestedMin: 15,
                suggestedMax: 25,
                beginAtZero: true,
            },
        }
    }
};

export const data = {
    labels: ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"],
    datasets: [
        {
            label: 'Temperature',
            data: [20, 22, 19, 19.5, 21, 20.5, 18],
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

export const dataConso = {
    labels: ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"],
    datasets: [
        {
            label: 'Consommation',
            data: [990, 1000, 0, 850, 200, 995, 364],
            fill: false,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 2,
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
            bottom: 20
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
        }
    },
    legend: {
        display: false,
    },
    tooltips: {
        backgroundColor: 'transparent',
        displayColors: false,
        bodyFontSize: 14,
        callbacks: {
            label: function(tooltipItems, data) {
                return tooltipItems.yLabel + '°C';
            }
        }
    },
    scales: {
        x: {
            display: false,
            ticks: {
                backdropPadding: 50,
            }
        },
        y: {
            display: false,
            ticks: {
                suggestedMin: 15,
                suggestedMax: 25,
                beginAtZero: true,
            },
        }
    }
};


export default function PageStatistics() {
    const [active, setActive] = useState("");
    const handleClick = event => {
        setActive(event.target.id);
    };
    
    return (
        <div className="card">
            
            <div className="about">
                <h3>Chart.js</h3>
                <p className="lead">Temperature in °C</p>
                
                <div>
                    <div className="App">
                        <div className="app-header">
                            <h1 className="app-title">Dashboard</h1>
                            <ul className="app-segmented-control">
                                <li className="app-segmented-control-item">
                                    <button key={1}
                                            className={active === "1" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"1"}
                                            onClick={handleClick}
                                            data-interval="day">
                                        Day
                                    </button>
                                </li>
                                <li className="app-segmented-control-item">
                                    <button key={2}
                                            className={active === "2" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"2"}
                                            onClick={handleClick}
                                            data-interval="week">
                                        Week
                                    </button>
                                </li>
                                <li className="app-segmented-control-item">
                                    <button key={3}
                                            className={active === "3" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"3"}
                                            onClick={handleClick}
                                            data-interval="month">
                                        Month
                                    </button>
                                </li>
                                <li className="app-segmented-control-item">
                                    <button key={4}
                                            className={active === "4" ? "btn-segmented-control active" : "btn-segmented-control"}
                                            id={"4"}
                                            onClick={handleClick}
                                            data-interval="year">
                                        Year
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div>
                    <Line options={options} data={data}/>
                    {/*<Bar options={optionsConso} data={dataConso} />*/}
                </div>
                
                <div className="axis">
                    <div className="tick">
                        <span className="day-number">10</span>
                        <span className="day-name">LUN</span>
                        <span className="value value--this">26°C</span>
                    </div>
                    <div className="tick">
                        <span className="day-number">11</span>
                        <span className="day-name">MAR</span>
                        <span className="value value--this">14°C</span>
                    </div>
                    <div className="tick">
                        <span className="day-number">12</span>
                        <span className="day-name">MER</span>
                        <span className="value value--this">22°C</span>
                    </div>
                    <div className="tick">
                        <span className="day-number">13</span>
                        <span className="day-name">JEU</span>
                        <span className="value value--this">12°C</span>
                    </div>
                    <div className="tick">
                        <span className="day-number">14</span>
                        <span className="day-name">VEN</span>
                        <span className="value value--this">20°C</span>
                    </div>
                    <div className="tick">
                        <span className="day-number">15</span>
                        <span className="day-name">SAM</span>
                        <span className="value value--this">12°C</span>
                    </div>
                    <div className="tick">
                        <span className="day-number">16</span>
                        <span className="day-name">DIM</span>
                        <span className="value value--this">18°C</span>
                    </div>
                </div>
            </div>
        </div>)
}