import React from 'react';
import ReactDOM from 'react-dom/client';
import './styleComponent/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"
import {SnackbarProvider} from "notistack";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // element pour creer le routeur
    <React.StrictMode>
        <BrowserRouter>
            <SnackbarProvider maxSnack={3}>
            <App/>
            </SnackbarProvider>
        </BrowserRouter>
    </React.StrictMode>
);


reportWebVitals();
