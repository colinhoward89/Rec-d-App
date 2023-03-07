import React from 'react';
import ReactDOM from 'react-dom';
import RecAdd from './RecAdd';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecAdd />, div);
  ReactDOM.unmountComponentAtNode(div);
});