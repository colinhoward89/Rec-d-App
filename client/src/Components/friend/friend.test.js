import React from 'react';
import ReactDOM from 'react-dom';
import Friend from './Friend';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Friend />, div);
  ReactDOM.unmountComponentAtNode(div);
});