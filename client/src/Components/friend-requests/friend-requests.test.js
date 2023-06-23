import React from 'react';
import ReactDOM from 'react-dom';
import FriendRequests from './FriendRequests';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FriendRequests />, div);
  ReactDOM.unmountComponentAtNode(div);
});