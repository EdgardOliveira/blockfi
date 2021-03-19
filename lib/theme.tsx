import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#404e5a',
    },
    secondary: {
      main: '#a6bcd0',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F0F4F8',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 762,
      lg: 1024,
      xl: 1280,
    },
  },
  typography: {
    fontSize: 16
  }  
});

export default theme;
