import React from 'react';
import ReactDOM from 'react-dom';
import AddSource from './AddSource';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddSource />, div);
  ReactDOM.unmountComponentAtNode(div);
});