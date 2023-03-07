import React from 'react';
import ReactDOM from 'react-dom';
import RecList from './RecList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecList />, div);
  ReactDOM.unmountComponentAtNode(div);
});