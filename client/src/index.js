import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import { ContextProvider } from "./Context";

const root = ReactDOM.createRoot(document.getElementById('root'));

const url = process.env.REACT_APP_AUTH0_REDIRECT_URI;

console.log('url', url);
console.log('server', process.env.REACT_APP_SERVER_URL)

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="rec-d.uk.auth0.com"
      clientId="TS1WV9zdKs1idZTC0dqjQ0k4wvsU24Gu"
      authorizationParams={{
        redirect_uri: url,
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
