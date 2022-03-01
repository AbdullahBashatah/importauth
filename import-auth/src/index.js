import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Amplify, { Auth } from 'aws-amplify';


Amplify.configure({
  Auth: {
    cookieStorage: {
      domain: 'localhost',
      secure: false,
      path: '/',
      expires: 365,
    },
    }
    });

ReactDOM.render(
  <BrowserRouter>
        <App />
    </BrowserRouter>, 
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
