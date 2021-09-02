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
    type: 'light',
  },
  typography: {
    fontSize: 16
  }
});
