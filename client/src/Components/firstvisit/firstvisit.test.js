import React from 'react';
import ReactDOM from 'react-dom';
import Firstvisit from './Firstvisit';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Firstvisit />, div);
  ReactDOM.unmountComponentAtNode(div);
});