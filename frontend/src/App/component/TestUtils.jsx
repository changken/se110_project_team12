import React from 'react';
import { Provider } from 'react-redux';
import reducers from '../../redux/reducer';
import { render as rtlRender } from '@testing-library/react';
import { createStore } from 'redux';

const render = (
  ui,
  {
    initialState,
    store = createStore(reducers, initialState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = children => {
    return <Provider store={store}></Provider>;
  };

  rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { render };
