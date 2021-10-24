import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux/reducer'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const myStore = createStore(rootReducer)

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f8e678',
      // light: '#f6e04f', 
      main: '#f6e04f',
      dark: '#ac9c3c',
      // contrastText: '#fff', 
      contrastText: '#676767'
    },
    secondary: {
      light: '#b2e3ff',
      main: '#9fddff',
      dark: '#6f9ab2',
      contrastText: '#000',
    },
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={myStore}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
