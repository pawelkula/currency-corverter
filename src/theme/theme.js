import { createTheme } from '@material-ui/core';

export const theme = createTheme({
  palette: {
    common: {
      black: '#404040',
      white: '#FFFFFF',
    },
    primary: {
      light: '#FFFFFF',
      main: '#009688',
      dark: '#404040',
    },
    secondary: {
      main: '#FFFFFF',
    },
    info: {
      main: '#94C720',
    },
    text: {
      secondary: '#8D8D8D'
    },
    type: 'light',
    error: {
      main: '#C70D38'
    }
  },
  typography: {
    fontSize: 16
  }
});
