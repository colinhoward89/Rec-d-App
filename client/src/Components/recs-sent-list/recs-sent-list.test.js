import React from 'react';
import ReactDOM from 'react-dom';
import RecsSentList from './RecsSentList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecsSentList />, div);
  ReactDOM.unmountComponentAtNode(div);
});