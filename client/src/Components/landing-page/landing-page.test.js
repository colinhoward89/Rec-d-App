import React from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './LandingPage';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LandingPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});