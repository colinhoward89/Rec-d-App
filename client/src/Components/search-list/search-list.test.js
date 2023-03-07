import React from 'react';
import ReactDOM from 'react-dom';
import SearchList from './SearchList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchList />, div);
  ReactDOM.unmountComponentAtNode(div);
});