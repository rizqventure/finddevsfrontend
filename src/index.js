import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals.js';
import './index.css';
import { Provider } from "react-redux";
import store from "./Store/index";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import dotenv from 'dotenv';
dotenv.config ();

axios.defaults.baseURL = process.env.REACT_APP_API || "http://localhost:5001";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
