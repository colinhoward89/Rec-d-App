import React from 'react';
import ReactDOM from 'react-dom';
import RecSend from './RecSend';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecSend />, div);
  ReactDOM.unmountComponentAtNode(div);
});