import React from 'react';
import ReactDOM from 'react-dom';
import RatingList from './RatingList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RatingList />, div);
  ReactDOM.unmountComponentAtNode(div);
});