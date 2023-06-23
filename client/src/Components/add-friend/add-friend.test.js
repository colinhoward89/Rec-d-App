import React from 'react';
import ReactDOM from 'react-dom';
import AddFriend from './AddFriend';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddFriend />, div);
  ReactDOM.unmountComponentAtNode(div);
});