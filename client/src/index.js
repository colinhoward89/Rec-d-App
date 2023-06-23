import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import { ContextProvider } from "./Context";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="rec-d.uk.auth0.com"
      clientId="TS1WV9zdKs1idZTC0dqjQ0k4wvsU24Gu"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/home"
      }}
    >
      <ContextProvider>
    <App />
    </ContextProvider>
    </Auth0Provider>,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
