// theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#e3f2f9',
    100: '#c5e4f3',
    200: '#a2d4ec',
    300: '#7ac1e4',
    400: '#47a9da',
    500: '#0088cc',
    600: '#007ab8',
    700: '#006ba1',
    800: '#005885',
    900: '#003f5e',
  },
};

const fonts = {
  heading: 'Montserrat, sans-serif',
  body: 'Inter, sans-serif',
};

const styles = {
  global: {
    body: {
      bg: 'white',
      color: 'gray.800',
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components: {},
});

export default theme;
