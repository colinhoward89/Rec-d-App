import React from 'react';
import ReactDOM from 'react-dom';
import RatingAdd from './RatingAdd';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RatingAdd />, div);
  ReactDOM.unmountComponentAtNode(div);
});