import React from 'react';
import ReactDOM from 'react-dom';
import FriendList from './FriendList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FriendList />, div);
  ReactDOM.unmountComponentAtNode(div);
});